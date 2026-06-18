import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "sponsorship.json");

interface ChecklistItem {
  text: string;
  checked: boolean;
}

interface SponsorshipEntry {
  id: string;
  date: string;
  type?: "note" | "checklist";
  notes?: string;
  title?: string;
  items?: ChecklistItem[];
}

const sort = (arr: SponsorshipEntry[]) =>
  [...arr].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

async function read(): Promise<SponsorshipEntry[]> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function write(entries: SponsorshipEntry[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function GET() {
  const entries = await read();
  return NextResponse.json({ entries: sort(entries) });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { date, type, notes, title, items } = body ?? {};

  if (!date || typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "valid date required" }, { status: 400 });
  }
  if (type === "checklist") {
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items required for checklist" }, { status: 400 });
    }
  } else {
    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return NextResponse.json({ error: "notes required" }, { status: 400 });
    }
  }

  const entries = await read();
  const newEntry: SponsorshipEntry = type === "checklist"
    ? { id: Date.now().toString(), date, type: "checklist", title: title?.trim() || undefined, items }
    : { id: Date.now().toString(), date, notes: (notes as string).trim() };

  const updated = sort([...entries, newEntry]);
  try {
    await write(updated);
  } catch (err) {
    console.error("[sponsorship] save failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}

export async function PATCH(req: Request) {
  const body = await req.json().catch(() => null);
  const { id, notes, title, items } = body ?? {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const entries = await read();
  const updated = sort(entries.map((e) => {
    if (e.id !== id) return e;
    if (items !== undefined) return { ...e, title: title?.trim() || undefined, items };
    if (!notes || typeof notes !== "string" || !notes.trim()) return e;
    return { ...e, notes: notes.trim() };
  }));

  try {
    await write(updated);
  } catch (err) {
    console.error("[sponsorship] update failed:", err);
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
    console.error("[sponsorship] delete failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ entries: updated });
}
