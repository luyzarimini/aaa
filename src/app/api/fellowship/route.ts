import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "fellowship.json");

interface Member {
  id: string;
  nickname: string;
  phone: string;
  city: string;
  joinedAt: string;
}

async function read(): Promise<Member[]> {
  try {
    const text = await fs.readFile(FILE, "utf-8");
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function write(members: Member[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(members, null, 2), "utf-8");
}

export async function GET() {
  const members = await read();
  return NextResponse.json({ members });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { nickname, phone, city } = body ?? {};
  if (!nickname?.trim() || !phone?.trim() || !city?.trim()) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  const members = await read();
  const newMember: Member = {
    id: Date.now().toString(),
    nickname: nickname.trim(),
    phone: phone.trim(),
    city: city.trim(),
    joinedAt: new Date().toISOString().split("T")[0],
  };
  const updated = [newMember, ...members];
  try {
    await write(updated);
  } catch (err) {
    console.error("[fellowship] save failed:", err);
    return NextResponse.json({ error: "Failed to save. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ members: updated });
}

export async function DELETE(req: Request) {
  const body = await req.json().catch(() => null);
  const { id } = body ?? {};
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const members = await read();
  const updated = members.filter((m) => m.id !== id);
  if (updated.length === members.length) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }
  try {
    await write(updated);
  } catch (err) {
    console.error("[fellowship] delete failed:", err);
    return NextResponse.json({ error: "Failed to remove." }, { status: 500 });
  }
  return NextResponse.json({ members: updated });
}
