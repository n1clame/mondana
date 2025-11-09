
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export async function GET() {
  const root = path.join(process.cwd(), "public", "layers");
  const cats = ["bg","glasses","headwear"] as const;
  const traits: Record<string, any[]> = { bg: [], glasses: [], headwear: [] };

  for (const c of cats) {
    const dir = path.join(root, c);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".png"));
    files.forEach(f => traits[c].push({
      id: f.replace(/\.png$/i, ""),
      name: f,
      file: `${c}/${f}`,
      rarity: 50
    }));
  }
  return NextResponse.json({ order: ["bg","glasses","headwear"], traits });
}
