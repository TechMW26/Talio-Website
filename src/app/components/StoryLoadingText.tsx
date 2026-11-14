import { useEffect, useRef, useState } from 'react';
import type { AsciiRevealController } from 'ascii-reveal/core';
import '@/styles/story-loading-text.css';

export default function StoryLoadingText({ children, animate }: { children: string; animate: boolean }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!animate || failed) return;
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let controller: AsciiRevealController | undefined;

    async function reveal(element: HTMLSpanElement) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (document.hidden || reduceMotion.matches) return;

      try {
        const { createAsciiReveal } = await import('ascii-reveal/core');
        if (cancelled || document.hidden || reduceMotion.matches) return;

        // Use the same terminal reveal and speed as Talio's loading coordinator.
        controller = createAsciiReveal(element, {
          preset: 'terminal', duration: 'fast', speed: 1.6,
          selector: '[data-story-reveal-text]', lazy: false, fallback: true,
        });
        await controller.reveal();
      } catch {
        // Replace any partially initialized canvas target with plain text.
        if (!cancelled) setFailed(true);
      } finally {
        controller?.destroy();
      }
    }

    void reveal(root);
    return () => {
      cancelled = true;
      controller?.destroy();
      controller = undefined;
    };
  }, [animate, children, failed]);

  if (failed) return <>{children}</>;

  return (
    <span className="story-loading-text" ref={rootRef}>
      <span data-story-reveal-text>{children}</span>
    </span>
  );
}
