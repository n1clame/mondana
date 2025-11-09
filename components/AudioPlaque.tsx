"use client";

import { useEffect, useRef, useState } from "react";

type Corner = "bottom-right" | "bottom-left" | "top-right" | "top-left";

interface Props {
  /** Путь к аудио-файлу (mp3/wav/ogg) */
  src?: string;
  /** Стартовый угол (если нет сохранённой позиции) */
  corner?: Corner;
  /** Стартовые отступы (если нет сохранённой позиции) */
  offsetX?: number;
  offsetY?: number;
  /** Доп. классы-обёртки */
  className?: string;
}

type SavedPos =
  | { mode: "free"; x: number; y: number }
  | { mode: "corner"; corner: Corner; offsetX: number; offsetY: number };

const LS_KEY = "mondana_audio_plaque_pos_v1";

export default function AudioPlaque({
  src = "/plaque/assets/calm_loop.wav",
  corner = "bottom-right",
  offsetX = 16,
  offsetY = 16,
  className = "",
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const plaqueRef = useRef<HTMLDivElement>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);

  // позиция
  const [freePos, setFreePos] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ dx: number; dy: number } | null>(null);

  // восстановить позицию из localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const saved: SavedPos = JSON.parse(raw);
      if (saved.mode === "free") setFreePos({ x: saved.x, y: saved.y });
      // если corner — используем пропсы (ничего не делаем)
    } catch {}
  }, []);

  // подписки на play/pause и установка громкости
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.volume = volume;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => setPlaying(false);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, [volume]);

  // drag handlers
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // не начинаем перетаскивание, если клик по кнопкам/ползунку
    if ((e.target as HTMLElement).closest(".controls")) return;

    const el = plaqueRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    dragStart.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || !dragStart.current) return;

    const el = plaqueRef.current;
    const w = el?.offsetWidth ?? 560;
    const h = el?.offsetHeight ?? 64;

    const { dx, dy } = dragStart.current;
    const x = Math.max(8, Math.min(window.innerWidth - 8 - w, e.clientX - dx));
    const y = Math.max(8, Math.min(window.innerHeight - 8 - h, e.clientY - dy));

    setFreePos({ x, y });
  };

  const onPointerUp = () => {
    if (!dragging) return;
    setDragging(false);
    dragStart.current = null;

    if (freePos) {
      try {
        const saved: SavedPos = { mode: "free", x: freePos.x, y: freePos.y };
        localStorage.setItem(LS_KEY, JSON.stringify(saved));
      } catch {}
    }
  };

  // вычисляем позиционирование
  const posClass = freePos
    ? "" // свободная позиция — используем left/top
    : corner === "bottom-right"
    ? "plaque-bottom-right"
    : corner === "bottom-left"
    ? "plaque-bottom-left"
    : corner === "top-right"
    ? "plaque-top-right"
    : "plaque-top-left";

  const wrapperStyle: React.CSSProperties = freePos
    ? { left: freePos.x, top: freePos.y }
    : { ["--plaque-x" as any]: `${offsetX}px`, ["--plaque-y" as any]: `${offsetY}px` };

  return (
    <div
      ref={plaqueRef}
      className={`plaque-fixed ${posClass} ${className} ${dragging ? "plaque-dragging" : ""}`}
      style={wrapperStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="audio-card" role="group" aria-label="Mondana music player">
        <div className="left">
          <img className="icon" src="/plaque/assets/logo.jpg" alt="Icon" width={28} height={28} />
          <div className="meta">
            <div className="title">playlist</div>
            <div className="subtitle">baddie music</div>
          </div>
        </div>

        <div className="controls">
          <button
            className="btn"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              const a = audioRef.current;
              if (!a) return;
              playing ? a.pause() : a.play(); // запуск только по клику — так требует браузер
            }}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M6 5h5v14H6zM13 5h5v14h-5z"></path>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M8 5v14l11-7z"></path>
              </svg>
            )}
          </button>

          <button
            className="btn"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => {
              const a = audioRef.current;
              if (!a) return;
              a.muted = !a.muted;
              setMuted(a.muted);
            }}
            style={{ opacity: muted ? 0.6 : 1 }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M5 9v6h4l5 5V4L9 9H5z"></path>
            </svg>
          </button>

          <div className="slider">
            <input
              id="volume"
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              aria-label="Volume"
              onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
            />
          </div>
        </div>

        <audio ref={audioRef} src={src} preload="auto" loop />
      </div>
    </div>
  );
}
