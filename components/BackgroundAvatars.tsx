"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";

type Spec = { left:number; top:number; size:number; delay:number; dur:number; rotate:number; opacity:number; src:string };

function rnd(a:number,b:number){ return Math.random()*(b-a)+a }

// build jittered grid cells to avoid overlaps
function buildCells(cols:number, rows:number){
  const cells: {x:number,y:number}[] = [];
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      cells.push({x:(c+0.5)*(100/cols), y:(r+0.5)*(100/rows)});
    }
  }
  return cells;
}

export default function BackgroundAvatars({count=28}:{count?:number}){
  const specs = useMemo<Spec[]>(()=>{
    const cols = 8, rows = 5; // 40 cells
    const cells = buildCells(cols, rows);
    const take = (arr: any[]) => arr.splice(Math.floor(Math.random()*arr.length),1)[0];
    const s: Spec[] = [];
    for(let i=0;i<count && cells.length>0;i++){
      const cell = take(cells);
      // weights: 70% hero, 10% newchog, remaining hero (20%)
      const r = Math.random();
      const src = r < 0.7 ? "/images/hero.jpg" : (r < 0.8 ? "/images/newchog.png" : "/images/hero.jpg");
      s.push({
        left: cell.x + rnd(-3,3),   // small jitter
        top:  cell.y + rnd(-3,3),
        size: rnd(60,100),          // smaller tiles
        delay: rnd(0,5),
        dur: rnd(10,18),
        rotate: rnd(-5,5),
        opacity: rnd(.12,.20),
        src
      });
    }
    return s;
  }, [count]);

  return (
    <div className="bg-avatars-container" aria-hidden>
      {specs.map((s,i)=> (
        <motion.img
          key={i}
          src={s.src}
          alt=""
          className="bg-avatar white-violet-neon"
          drag
          dragElastic={0.2}
          dragMomentum={false}
          whileTap={{ scale: 1.03 }}
          style={{
            left: `${s.left}vw`,
            top: `${s.top}vh`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            opacity: s.opacity,
            transform: `rotate(${s.rotate}deg)`
          }}
        />
      ))}
    </div>
  )
}
