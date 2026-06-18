import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "my-traditions.json");

async function read(): Promise<Record<string, string>> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text);
    return typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export async function GET() {
  const entries = await read();
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { entries } = body ?? {};
  if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
    return NextResponse.json({ error: "entries required" }, { status: 400 });
  }
  try {
    await fs.writeFile(FILE, JSON.stringify(entries, null, 2), "utf-8");
  } catch (err) {
    console.error("[my-traditions] save failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ entries });
}
