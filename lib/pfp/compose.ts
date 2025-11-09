import type { ComposeImages, ComposeOpts, LayerKey } from "@/lib/pfp/types";

/** Рисуем изображение вокруг якорной точки с учётом pivot/scale/rotation/offset */
export function drawAnchored(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  anchor: { x: number; y: number },
  opts: {
    offset?: { dx: number; dy: number };
    pivot?: { x: number; y: number };
    scale?: number;
    rotation?: number; // в градусах
  },
  size: number
) {
  const ax = anchor.x * size;
  const ay = anchor.y * size;
  const dx = (opts.offset?.dx ?? 0) * size;
  const dy = (opts.offset?.dy ?? 0) * size;
  const scale = opts.scale ?? 1;
  const rot = ((opts.rotation ?? 0) * Math.PI) / 180;

  // Если источник больше 1024 — ужимаем по длинной стороне до size
  const maxSide = Math.max(img.width, img.height);
  const down = Math.min(1, size / maxSide);

  const w = img.width * down * scale;
  const h = img.height * down * scale;
  const px = opts.pivot?.x ?? 0.5;
  const py = opts.pivot?.y ?? 0.5;

  ctx.save();
  ctx.translate(ax + dx, ay + dy);
  ctx.rotate(rot);
  ctx.drawImage(img, -w * px, -h * py, w, h);
  ctx.restore();
}

/** Композиция: bg → base → glasses → headwear */
export function composeToCanvas(
  ctx: CanvasRenderingContext2D,
  images: ComposeImages,
  params: ComposeOpts
) {
  const { size, selection, anchors, transparentBg, ui } = params;

  ctx.clearRect(0, 0, size, size);

  // BG во весь кадр, если фон не прозрачный
  if (!transparentBg && images.bg) {
    ctx.drawImage(images.bg, 0, 0, size, size);
  }

  // База всегда 1:1
  if (images.base) ctx.drawImage(images.base, 0, 0, size, size);

  const baseAnchors = anchors.base;
  const order: LayerKey[] = ["glasses", "headwear"];

  for (const key of order) {
    const item = selection[key];
    const img = images[key];
    if (!item || !img) continue;

    const attach = item.attachTo || (key === "glasses" ? "EYE_LINE" : "HEAD_TOP");
    const anchor = baseAnchors[attach] || baseAnchors.EYE_LINE;

    // --- ФОЛБЭКИ: компактнее и ниже, чтобы всё влезало в 1024×1024 ---
    const baseScale =
      item.transform?.scale ??
      (key === "glasses" ? 0.70 : key === "headwear" ? 0.74 : 1);

    const baseRot = item.transform?.rotation ?? 0;

    const baseOffset = {
      dx: item.offset?.dx ?? 0,
      dy:
        item.offset?.dy ??
        (key === "glasses" ? 0.010 : key === "headwear" ? 0.20 : 0),
    };

    // Ручные правки из UI
    const u = ui[key] || {};
    const scale = (u.scale ?? 1) * baseScale;
    const rotation = (u.rotation ?? 0) + baseRot;
    const offset = {
      dx: (u.dx ?? 0) + baseOffset.dx,
      dy: (u.dy ?? 0) + baseOffset.dy,
    };

    // У шляп пивот ближе к нижнему краю — «опираются» на голову
    const defPivotY = key === "headwear" ? 0.96 : 0.5;
    const pivot = item.pivot ?? { x: 0.5, y: defPivotY };

    drawAnchored(ctx, img, anchor, { offset, pivot, scale, rotation }, size);
  }
}
