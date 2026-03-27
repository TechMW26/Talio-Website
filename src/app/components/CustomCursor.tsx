import { useEffect, useRef, useCallback } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const hovering = useRef(false);
  const clicking = useRef(false);
  const visible = useRef(false);
  const rafId = useRef(0);
  const mounted = useRef(true);

  // Detect touch/mobile devices
  const isTouch = typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches;

  // Smooth interpolation loop — ring lags behind dot
  const loop = useCallback(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring || !mounted.current) return;

    // Lerp ring position toward target
    pos.current.x += (targetPos.current.x - pos.current.x) * 0.15;
    pos.current.y += (targetPos.current.y - pos.current.y) * 0.15;

    const isHov = hovering.current;
    const isClick = clicking.current;
    const vis = visible.current ? 1 : 0;

    // Dot — snaps immediately to mouse position
    dot.style.transform = `translate3d(${targetPos.current.x - 3}px, ${targetPos.current.y - 3}px, 0) scale(${isClick ? 0.6 : 1})`;
    dot.style.opacity = String(vis);

    // Ring — smooth follow with lerp
    const ringSize = isHov ? 48 : 20;
    const ringOffset = ringSize / 2;
    ring.style.transform = `translate3d(${pos.current.x - ringOffset}px, ${pos.current.y - ringOffset}px, 0)`;
    ring.style.width = `${ringSize}px`;
    ring.style.height = `${ringSize}px`;
    ring.style.opacity = String(vis);
    ring.style.borderColor = isHov ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)';

    rafId.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    // Skip on touch-only devices
    if (isTouch) return;

    mounted.current = true;
    rafId.current = requestAnimationFrame(loop);

    const onMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!visible.current) visible.current = true;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = t.tagName === 'BUTTON' || t.tagName === 'A' ||
        !!t.closest('button') || !!t.closest('a') ||
        t.classList.contains('cursor-pointer');
      const isInput = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || !!t.closest('input');
      hovering.current = isInteractive && !isInput;
    };

    const onDown = () => { clicking.current = true; };
    const onUp = () => { clicking.current = false; };
    const onLeave = () => { visible.current = false; };
    const onEnter = () => { visible.current = true; };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      mounted.current = false;
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
    };
  }, [loop, isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] w-1.5 h-1.5 rounded-full bg-white will-change-transform"
        style={{ opacity: 0, transition: 'opacity 0.15s, transform 0.06s linear' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full border-[1.5px] will-change-transform"
        style={{ opacity: 0, width: 20, height: 20, borderColor: 'rgba(255,255,255,0.5)', transition: 'width 0.2s, height 0.2s, border-color 0.2s, opacity 0.15s' }}
      />
    </>
  );
}