import { useRef, useState, useCallback, useEffect } from 'react';
import { usePageMeta } from '@/app/hooks/usePageMeta';

export function MiraComingSoon() {
  usePageMeta('MIRA AI', 'Experience MIRA — Talio\'s AI-powered workforce assistant. Smart insights, automated decisions, and intelligent management at your fingertips.');

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Snap iframe container to fill viewport when scrolling up and it's partially visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let snapping = false;
    let prevScrollY = window.scrollY;

    const onScroll = () => {
      if (snapping) return;

      const currentY = window.scrollY;
      const scrollingUp = currentY < prevScrollY - 2; // small threshold to avoid jitter
      prevScrollY = currentY;

      if (!scrollingUp) return;

      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;

      // Container top is above viewport (partially scrolled past) but bottom is still visible
      // i.e. more than 40% of the container is showing
      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const visibleRatio = visibleHeight / rect.height;

      if (rect.top < 0 && rect.bottom > vh * 0.4 && visibleRatio > 0.4 && visibleRatio < 0.95) {
        snapping = true;
        // Scroll so the container top aligns with viewport top
        const targetY = currentY + rect.top;
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        setTimeout(() => { snapping = false; }, 1000);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setLoaded(true);
    try {
      const iframeDoc = iframeRef.current?.contentDocument || iframeRef.current?.contentWindow?.document;
      if (iframeDoc) {
        // Hide old site header, footer, contact form; hide scrollbar but keep scrolling
        const style = iframeDoc.createElement('style');
        style.textContent = `
          #header-placeholder { display: none !important; }
          #footer-placeholder { display: none !important; }
          #contact { display: none !important; }
          .scroll-progress { display: none !important; }
          html { scrollbar-width: none !important; -ms-overflow-style: none !important; }
          html::-webkit-scrollbar { display: none !important; width: 0 !important; }
          body { scrollbar-width: none !important; -ms-overflow-style: none !important; }
          body::-webkit-scrollbar { display: none !important; width: 0 !important; }
        `;
        iframeDoc.head.appendChild(style);

        // Forward mouse events from iframe to parent so CustomCursor keeps working
        const iframe = iframeRef.current;
        if (iframe) {
          const rect = () => iframe.getBoundingClientRect();
          iframeDoc.addEventListener('mousemove', (e: MouseEvent) => {
            const r = rect();
            window.dispatchEvent(new MouseEvent('mousemove', {
              clientX: e.clientX + r.left,
              clientY: e.clientY + r.top,
              bubbles: true,
            }));
          });
          iframeDoc.addEventListener('mousedown', () => {
            window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          });
          iframeDoc.addEventListener('mouseup', () => {
            window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
          });
        }

        // Intercept navigation links to route to the new site
        iframeDoc.addEventListener('click', (e: MouseEvent) => {
          const anchor = (e.target as HTMLElement).closest('a');
          if (!anchor) return;
          const href = anchor.getAttribute('href');
          if (!href) return;

          const routeMap: Record<string, string> = {
            '#hero': '/',
            '#features': '/features',
            '#mira': '/mira-ai',
            '#pricing': '/pricing',
            '#contact': '/contact',
            '#faq': '/help',
            'index.html': '/',
            'about/': '/about',
            'features/': '/features',
            'pricing/': '/pricing',
            'contact/': '/contact',
          };

          const mapped = routeMap[href] || routeMap[href.replace(/^\.?\/?/, '')];
          if (mapped) {
            e.preventDefault();
            window.location.href = mapped;
          }
        });
      }
    } catch {
      // Cross-origin restrictions - iframe will work but without link interception
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-gray-950" style={{ height: '100vh' }}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/old-site/index.html"
        title="Talio - MIRA AI Experience"
        onLoad={handleIframeLoad}
        className="w-full h-full border-0"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
}
