"use client";

import { useEffect, useState } from "react";
import Link from "next/link"; // ← добавлено только для вкладок
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CanvasComposer } from "@/components/pfp/CanvasComposer";
import { Controls } from "@/components/pfp/Controls";
import { getInitialTraits } from "@/lib/pfp/assets";
import type { Traits, Selection, LayerKey } from "@/lib/pfp/types";

export default function PfpPage() {
  const [traits, setTraits] = useState<Traits | null>(null);
  const [selection, setSelection] = useState<Selection>({});
  const [active, setActive] = useState<LayerKey | null>("glasses");
  const [transparentBg, setTransparentBg] = useState(false);
  const [baseOk, setBaseOk] = useState<boolean | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setBaseOk(true);
    img.onerror = () => setBaseOk(false);
    img.src = "/layers/base/base.png";
  }, []);

  useEffect(() => {
    getInitialTraits().then(setTraits).catch(console.error);
  }, []);

  const blocked = baseOk === false;

  return (
    <>
      {/* ВКЛАДКИ (шапка). Ничего в основном контенте ниже не меняем */}
      <header className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-wide">Mondana</Link>
          <nav className="hidden sm:flex items-center gap-7 text-sm text-white/80">
            <a className="neon-link" href="/#newcomers">Newcomers</a>
            <a className="neon-link" href="/#events">Contest</a>
            <a className="neon-link" href="/#predictions">Predictions</a>
            <Link href="/pfp" className="neon-link">PFP Generator</Link>
            <a className="neon-link" href="/#roadmap">Roadmap</a>
          </nav>
        </div>
      </header>

      {/* ТВОЙ ИСХОДНЫЙ КОНТЕНТ — без изменений */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="min-h-screen px-4 py-8"
      >
        <h1 className="shimmer-text mb-6 text-3xl">PFP Generator</h1>

        {blocked && (
          <Card className="neon-surface mb-4 p-4">
            Add base at <code>/public/layers/base/base.png</code> (1024×1024 PNG, transparent).
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-[420px_1fr]">
          <Card className="neon-surface p-4">
            <Controls
              traits={traits}
              selection={selection}
              setSelection={setSelection}
              active={active}
              setActive={setActive}
              transparentBg={transparentBg}
              setTransparentBg={setTransparentBg}
              disabled={blocked}
            />
          </Card>

          <Card className="neon-surface p-4">
            <CanvasComposer
              traits={traits}
              selection={selection}
              active={active}
              transparentBg={transparentBg}
            />
          </Card>
        </div>
      </motion.main>
    </>
  );
}
