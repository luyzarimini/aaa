import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "inspirational-reflections.json");

interface ReflectionEntry {
  id: string;
  date: string;
  text: string;
}

const sort = (arr: ReflectionEntry[]) =>
  [...arr].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

async function read(): Promise<ReflectionEntry[]> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function write(entries: ReflectionEntry[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function GET() {
  const entries = await read();
  return NextResponse.json({ entries: sort(entries) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { text, date } = body ?? {};
  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "text required" }, { status: 400 });
  }
  const entries = await read();
  const newEntry: ReflectionEntry = {
    id: Date.now().toString(),
    date: date ?? new Date().toISOString().split("T")[0],
    text: text.trim(),
  };
  const updated = sort([...entries, newEntry]);
  try {
    await write(updated);
  } catch (err) {
    console.error("[reflections] save failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const { id, text } = body ?? {};
  if (!id || !text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "id and text required" }, { status: 400 });
  }
  const entries = await read();
  const updated = sort(entries.map((e) => e.id === id ? { ...e, text: text.trim() } : e));
  try {
    await write(updated);
  } catch (err) {
    console.error("[reflections] update failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const entries = await read();
  const updated = sort(entries.filter((e) => e.id !== id));
  try {
    await write(updated);
  } catch (err) {
    console.error("[reflections] delete failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}
