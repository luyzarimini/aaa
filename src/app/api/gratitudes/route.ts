import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "gratitudes.json");

interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
}

async function read(): Promise<GratitudeEntry[]> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function write(entries: GratitudeEntry[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(entries, null, 2), "utf-8");
}

const sort = (arr: GratitudeEntry[]) =>
  [...arr].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

export async function GET() {
  const entries = await read();
  return NextResponse.json({ entries: sort(entries) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const items: string[] = body?.items;
  if (!Array.isArray(items) || items.every((i) => !i?.trim())) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }
  const entries = await read();
  const newEntry: GratitudeEntry = {
    id: Date.now().toString(),
    date: body.date ?? new Date().toISOString().split("T")[0],
    items: items.filter((i) => i?.trim()),
  };
  const updated = sort([...entries, newEntry]);
  try {
    await write(updated);
  } catch (err) {
    console.error("[gratitudes] save failed:", err);
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
    console.error("[gratitudes] delete failed:", err);
    return NextResponse.json({ error: "Failed to delete." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}
