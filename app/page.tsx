"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// ---------------- Events ----------------
// Контенты по запросу: скрываем прошлые контесты — вместо сетки показываем "SOON".
type Event = {
  id: number;
  date: string;
  title: string;
  description: string;
  detailsUrl?: string;
  resultsUrl?: string;
};
const EVENTS: Event[] = []; // очищено

export default function Page() {
  const [prediction, setPrediction] = useState<string>("");

  const PREDICTIONS = [
    "Luck finds you today.",
    "Your next mint will pop.",
    "Friends bring good news.",
    "Creativity is your edge.",
    "A surprise win is near.",
    "Your consistency will be rewarded.",
    "The right collab is coming.",
    "Small effort, big result.",
  ];

  const rollPrediction = () => {
    const pick = PREDICTIONS[Math.floor(Math.random() * PREDICTIONS.length)];
    setPrediction(pick);
    const end = Date.now() + 600;
    (function frame(){
      confetti({ particleCount: 24, startVelocity: 45, spread: 70, origin: { y: 0.6 } });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  return (
    <main className="min-h-screen selection:bg-red-500/30 shrimp-pattern">
      {/* Floating blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="blob w-72 h-72 bg-[#ef233c] left-10 top-10" />
        <div className="blob w-96 h-96 bg-[#d90429] right-10 top-40" style={{ animationDelay: "2s" }} />
        <div className="blob w-80 h-80 bg-[#7a0c0c] left-1/3 -bottom-10" style={{ animationDelay: "4s" }} />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="#hero" className="flex items-center gap-2 group">
              <span className="font-semibold tracking-wide">Mondana</span>
            </a>
            <div className="hidden sm:flex items-center gap-3 pl-3 ml-1 border-l border-white/10">
              {/* ссылки обновлены */}
              <a
                href="https://x.com/mondanabaddies"
                target="_blank" rel="noopener noreferrer"
                className="text-white/80 neon-link rainbow-text">
                Twitter
              </a>
              <a
                href="https://discord.gg/mondanahq"
                target="_blank" rel="noopener noreferrer"
                className="text-white/80 neon-link rainbow-text">
                Discord
              </a>
            </div>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-white/80">
            <a className="neon-link rainbow-snake" href="#newcomers">Newcomers</a>
            <a className="neon-link rainbow-snake" href="#events">Contest</a>
            <a className="neon-link rainbow-snake" href="#predictions">Predictions</a>
            <a className="neon-link rainbow-snake" href="#roadmap">Roadmap</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="hero">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight  hover-glow spread-hover" style={{color:"#5a4640"}}>Welcome, Newcomer!</h1>
            <p className="mt-4 text-lg text-white/80 max-w-xl">Your fast track into the Mondana community.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#newcomers" className="inline-block"><button className="neon-outline spread-hover rounded-2xl px-4 py-2 text-sm">Get Started</button></a>
              <a href="#events" className="inline-block"><button className="neon-outline spread-hover rounded-2xl px-4 py-2 text-sm">Past Contests</button></a>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative">
            <div className="relative w-full aspect-square max-w-md mx-auto neon-surface overflow-hidden">
              <img src="/images/hero.jpg" alt="Shrimpers main" className="w-full h-full object-cover aurora-border" />
            </div>
          </motion.div>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </section>

      {/* Newcomers */}
      <section id="newcomers" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            {/* заголовок заменён */}
            <h2 className="text-3xl sm:text-4xl font-bold hover-glow spread-hover violet-heading" style={{color:"#6d28d9"}}>For baddies</h2>
            <p className="mt-3 text-white/80">Start here and join our events to get involved fast. Follow the steps below and you’ll be ready in minutes.</p>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* карточки заменены */}
            <StepCard title="1. Participate in contests" text="participate for a chance to win a baddie" />
            <StepCard title="become a part" text="Create amazing content to have a chance to become part of the baddie club" />
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-3">FAQ</h3>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.q} className="neon-surface overflow-hidden">
                  <AccordionTrigger className={"px-4 faq-trigger"}>{item.q}</AccordionTrigger>
                  <AccordionContent className={"px-4 pb-4 text-white/80"}>
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      {item.a}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events / Contest */}
      <section id="events" className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Contest</h2>
              {/* текст под заголовком удалён по запросу */}
            </div>
          </div>

          {/* вместо сетки карточек — центрированный SOON */}
          <div className="mt-10">
            <div className="neon-surface p-12 grid place-items-center">
              <p className="text-4xl sm:text-5xl font-extrabold per-letter spread-hover">
                <span>S</span><span>O</span><span>O</span><span>N</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Predictions */}
      <section id="predictions" className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Positive Predictions</h2>
          <p className="mt-2 text-white/80">Tap the button to roll a feel-good prediction.</p>
          <div className="mt-6">
            <Tabs defaultValue="pred">
              <TabsList className="bg-white/5">
                <TabsTrigger value="pred">Predictions</TabsTrigger>
              </TabsList>
              <TabsContent value="pred" className="mt-6">
                <div className="neon-surface p-6 grid gap-4 place-items-center text-center">
                  <div className="min-h-[64px] grid place-items-center">
                    {prediction ? (
                      <motion.p key={prediction} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-xl sm:text-2xl font-semibold text-white/95">
                        {prediction}
                      </motion.p>
                    ) : (
                      <p className="text-white/70">Press the button and claim your positive vibe.</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={rollPrediction} className="bg-red-600 hover:bg-red-500 text-white rounded-2xl px-4 py-2 text-sm">Get a Prediction</button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-20 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold">Roadmap</h2>
          <div className="mt-6">
            <Tabs defaultValue="nftgenesis">
              <TabsList className="bg-white/5 flex flex-wrap">
                <TabsTrigger value="nftgenesis">NFT GENESIS</TabsTrigger>
                <TabsTrigger value="soon1" className=" spread-hover faq-tab"><span className="violet-heading glow-violet">SOON</span></TabsTrigger>
                <TabsTrigger value="soon2" className=" spread-hover faq-tab"><span className="violet-heading glow-violet">SOON</span></TabsTrigger>
                <TabsTrigger value="soon3" className=" spread-hover faq-tab"><span className="violet-heading glow-violet">SOON</span></TabsTrigger>
                <TabsTrigger value="soon4" className=" spread-hover faq-tab"><span className="violet-heading glow-violet">SOON</span></TabsTrigger>
              </TabsList>
              <TabsContent value="nftgenesis" className="mt-6">
                <div className="neon-surface p-12 grid place-items-center">
                  <p className="text-4xl font-extrabold  per-letter spread-hover"><span>S</span><span>O</span><span>O</span><span>N</span></p>
                </div>
              </TabsContent>
              {(["soon1","soon2","soon3","soon4"] as const).map((tab) => (
                <TabsContent value={tab} key={tab} className="mt-6">
                  <div className="neon-surface p-12 grid place-items-center">
                    <p className="text-5xl font-extrabold">?</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/80">
          <p>© {new Date().getFullYear()} Mondana. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {/* обновлённые ссылки */}
            <a href="https://x.com/mondanabaddies" target="_blank" rel="noopener noreferrer" className="neon-link rainbow-snake">Twitter</a>
            <a href="https://discord.gg/mondanahq" target="_blank" rel="noopener noreferrer" className="neon-link rainbow-snake">Discord</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

// ---------------- Small UI helpers ----------------
function StepCard({ title, text }: { title: string; text: string }) {
  return (
    <motion.div whileHover={{ y: -3, scale: 1.01 }} transition={{ type: "spring", stiffness: 220, damping: 20 }} className="neon-surface step-card">
      <Card className="bg-transparent border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3 title-brown"><span className="text-white font-semibold">{title}</span></div>
        </CardHeader>
        <CardContent className="text-white/80">{text}</CardContent>
      </Card>
    </motion.div>
  );
}

function EventCard({ e }: { e: Event }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: "spring", stiffness: 250, damping: 18 }} className="neon-surface step-card">
      <Card className="bg-transparent border-0">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-white">{e.title}</CardTitle>
          </div>
          <div className="text-sm text-white/70 mt-1">{new Date(e.date).toLocaleDateString()}</div>
        </CardHeader>
        <CardContent className="text-white/85 whitespace-pre-line">{e.description}</CardContent>
        <CardFooter className="gap-2">
          {e.detailsUrl && (
            <a href={e.detailsUrl} target="_blank" rel="noopener noreferrer">
              <button className="bg-red-600 hover:bg-red-500 text-white rounded-2xl px-4 py-2 text-sm">Details</button>
            </a>
          )}
          {e.resultsUrl && (
            <a href={e.resultsUrl} target="_blank" rel="noopener noreferrer">
              <button className="border border-white/15 hover:bg-white/10 rounded-2xl px-4 py-2 text-sm">Results</button>
            </a>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

const FAQ_ITEMS = [
  { q: "How do I get WL?", a: "Just be active and join the events we post on our social media — Discord and Twitter." },
  { q: "Where do you announce events?", a: "Discord (Announcements channel) and our Twitter. Turn on notifications." },
  { q: "Do I need to buy anything to join?", a: "No. Participation is free unless a specific event says otherwise." },
  { q: "What if I miss an event?", a: "We publish recaps; more events are coming regularly." },
  { q: "Security tips", a: "Never share seed phrases or private keys. Only trust links from our official socials." }
];
