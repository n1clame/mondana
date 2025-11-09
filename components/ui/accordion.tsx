"use client";
import * as React from "react";
export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={className}>{children}</div>; }
export function AccordionItem({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={className}>{children}</div>; }
export function AccordionTrigger({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const [open, setOpen] = React.useState(false);
  return <button onClick={() => { setOpen(!open); onClick?.(); }} className={`w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 transition ${className || ""}`} aria-expanded={open} data-open={open}><span>{children}</span></button>;
}
export function AccordionContent({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={`bg-transparent px-4 pb-4 ${className || ""}`}>{children}</div>; }
