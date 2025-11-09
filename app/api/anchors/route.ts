
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
const filePath = path.join(process.cwd(), "public", "anchors.json");

export async function GET() {
  try {
    const json = fs.readFileSync(filePath, "utf-8");
    return new NextResponse(json, { headers: { "content-type": "application/json" } });
  } catch {
    return NextResponse.json({ error: "anchors.json not found" }, { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    fs.writeFileSync(filePath, body, "utf-8");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
