import { useEffect, useRef } from 'react';

const CELL_SIZE = 55;
const INFLUENCE_RADIUS = 260;
const RIPPLE_DURATION = 840;
const ONE_TURN = Math.PI * 2;

type Point = { x: number; y: number };
type Ripple = Point & { startedAt: number };

export function KineticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0;
    let height = 0;
    let frame = 0;
    let pointer: Point | null = null;
    let target: Point | null = null;
    let ripples: Ripple[] = [];

    const queueDraw = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const draw = (now: number) => {
      frame = 0;
      let moving = false;
      if (pointer && target) {
        const dx = target.x - pointer.x;
        const dy = target.y - pointer.y;
        moving = Math.hypot(dx, dy) > 0.5;
        pointer = moving ? { x: pointer.x + dx * 0.16, y: pointer.y + dy * 0.16 } : target;
      }

      ripples = ripples.filter((ripple) => now - ripple.startedAt < RIPPLE_DURATION);
      const waves = ripples.map((ripple) => {
        const age = Math.max(0, now - ripple.startedAt);
        return { x: ripple.x, y: ripple.y, radius: age * 0.4, opacity: 1 - age / RIPPLE_DURATION };
      });

      const cols = Math.max(2, Math.ceil(width / CELL_SIZE));
      const rows = Math.max(2, Math.ceil(height / CELL_SIZE));
      const nodes = Array.from({ length: rows + 1 }, (_, row) =>
        Array.from({ length: cols + 1 }, (_, col) => {
          const x = col * width / cols;
          const y = row * height / rows;
          // Pin the outer grid lines to the viewport.
          const colPin = Math.min(1, col / 1.5, (cols - col) / 1.5);
          const rowPin = Math.min(1, row / 1.5, (rows - row) / 1.5);
          const edge = (colPin * rowPin) ** 2;
          const dx = pointer ? pointer.x - x : 0;
          const dy = pointer ? pointer.y - y : 0;
          const distance = Math.hypot(dx, dy);
          const influence = pointer ? Math.max(0, 1 - distance / INFLUENCE_RADIUS) ** 2 * edge : 0;
          const pull = influence * 24 / Math.max(60, distance);
          let warpedX = x + dx * pull;
          let warpedY = y + dy * pull;

          for (const wave of waves) {
            const dx = x - wave.x;
            const dy = y - wave.y;
            const distance = Math.hypot(dx, dy);
            const offset = distance - wave.radius;
            const strength = Math.max(0, 1 - Math.abs(offset) / CELL_SIZE) * wave.opacity;
            const push = -Math.sign(offset) * strength * 18 * edge / Math.max(1, distance);
            warpedX += dx * push;
            warpedY += dy * push;
          }

          return { x: warpedX, y: warpedY, radius: 1.4 + influence * 1.6 };
        }),
      );

      ctx.clearRect(0, 0, width, height);
      let glow: CanvasGradient | undefined;
      if (pointer) {
        glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, INFLUENCE_RADIUS);
        glow.addColorStop(0, 'rgb(74 158 255 / 42%)');
        glow.addColorStop(1, 'rgb(74 158 255 / 0%)');
      }

      ctx.beginPath();
      for (let row = 0; row <= rows; row++) {
        for (let col = 0; col <= cols; col++) {
          const node = nodes[row][col];
          if (col < cols) {
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[row][col + 1].x, nodes[row][col + 1].y);
          }
          if (row < rows) {
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[row + 1][col].x, nodes[row + 1][col].y);
          }
        }
      }
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgb(255 255 255 / 9%)';
      ctx.stroke();
      if (glow) {
        ctx.strokeStyle = glow;
        ctx.stroke();
      }

      ctx.beginPath();
      for (const row of nodes) {
        for (const node of row) {
          ctx.moveTo(node.x + node.radius, node.y);
          ctx.arc(node.x, node.y, node.radius, 0, ONE_TURN);
        }
      }
      ctx.fillStyle = 'rgb(255 255 255 / 16%)';
      ctx.fill();
      if (glow) {
        ctx.fillStyle = glow;
        ctx.fill();
      }

      for (const wave of waves) {
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, ONE_TURN);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = `rgb(100 180 255 / ${wave.opacity * 0.28})`;
        ctx.stroke();
      }

      if (moving || waves.length) queueDraw();
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      queueDraw();
    };

    const movePointer = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      target = { x: event.clientX, y: event.clientY };
      pointer ??= target;
      queueDraw();
    };

    const clearPointer = () => {
      pointer = target = null;
      queueDraw();
    };

    const addRipple = (event: MouseEvent) => {
      if (reducedMotion.matches || event.detail === 0) return;
      ripples.push({ x: event.clientX, y: event.clientY, startedAt: performance.now() });
      queueDraw();
    };

    const updateMotionPreference = () => {
      ripples = [];
      clearPointer();
    };

    const root = document.documentElement;
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', movePointer, { passive: true });
    window.addEventListener('blur', clearPointer);
    window.addEventListener('click', addRipple);
    root.addEventListener('pointerleave', clearPointer);
    reducedMotion.addEventListener('change', updateMotionPreference);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', movePointer);
      window.removeEventListener('blur', clearPointer);
      window.removeEventListener('click', addRipple);
      root.removeEventListener('pointerleave', clearPointer);
      reducedMotion.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="kinetic-grid pointer-events-none fixed inset-0 -z-10 block size-full" />;
}
