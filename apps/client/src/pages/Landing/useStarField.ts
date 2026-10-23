import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  opacityDelta: number;
  depth: number;
  tinted: boolean;
}

export function useStarField(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const STAR_COUNT = 200;
    const ACCENT_RGB = '56, 189, 248';

    starsRef.current = Array.from({ length: STAR_COUNT }, () => {
      const depth = Math.random();
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7,
        opacityDelta: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        depth,
        tinted: Math.random() < 0.15,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of starsRef.current) {
        star.opacity += star.opacityDelta;
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.opacityDelta = -Math.abs(star.opacityDelta);
        } else if (star.opacity <= 0.1) {
          star.opacity = 0.1;
          star.opacityDelta = Math.abs(star.opacityDelta);
        }

        const parallaxStrength = star.depth * 14;
        const px = star.x + mouseRef.current.x * parallaxStrength;
        const py = star.y + mouseRef.current.y * parallaxStrength;

        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.tinted
          ? `rgba(${ACCENT_RGB}, ${star.opacity})`
          : `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasRef]);
}
