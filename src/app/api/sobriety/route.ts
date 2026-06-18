import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "sobriety.json");

interface SobrietyData {
  startDate: string;
}

async function read(): Promise<SobrietyData | null> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" && parsed.startDate ? parsed : null;
  } catch {
    return null;
  }
}

export async function GET() {
  const data = await read();
  return NextResponse.json({ startDate: data?.startDate ?? null });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { startDate } = body ?? {};
  if (!startDate || typeof startDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return NextResponse.json({ error: "valid startDate required" }, { status: 400 });
  }
  try {
    await fs.writeFile(FILE, JSON.stringify({ startDate }, null, 2), "utf-8");
  } catch (err) {
    console.error("[sobriety] save failed:", err);
    return NextResponse.json({ error: "Failed to save." }, { status: 500 });
  }
  return NextResponse.json({ startDate });
}
