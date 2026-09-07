import { useEffect, useRef } from "react";

export function SparkField({ intensity }: { intensity: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const bolts: { life: number; pts: { x: number; y: number }[] }[] = [];

    const resize = () => {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2 - h * 0.04;
      const angle = Math.random() * Math.PI * 2;
      const len = (0.12 + Math.random() * 0.28) * Math.min(w, h);
      const pts = [{ x: cx, y: cy }];
      let x = cx;
      let y = cy;
      const steps = 8 + Math.floor(Math.random() * 6);
      for (let i = 0; i < steps; i++) {
        x += Math.cos(angle) * (len / steps) + (Math.random() - 0.5) * 18 * devicePixelRatio;
        y += Math.sin(angle) * (len / steps) + (Math.random() - 0.5) * 18 * devicePixelRatio;
        pts.push({ x, y });
      }
      bolts.push({ life: 1, pts });
    };

    const draw = () => {
      const intensityNow = intensityRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (intensityNow > 0.05 && Math.random() < intensityNow * 0.45) spawn();
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life -= 0.08;
        if (b.life <= 0) {
          bolts.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(b.pts[0].x, b.pts[0].y);
        for (const p of b.pts) ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(240,192,112,${0.85 * b.life * intensityNow})`;
        ctx.lineWidth = 1.4 * devicePixelRatio;
        ctx.shadowColor = "#e8903a";
        ctx.shadowBlur = 12 * devicePixelRatio;
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-[6] h-full w-full"
      style={{ opacity: intensity }}
      aria-hidden
    />
  );
}
