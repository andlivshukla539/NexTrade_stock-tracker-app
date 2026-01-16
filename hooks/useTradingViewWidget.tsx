'use client'
import { useEffect, useRef } from 'react';

const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const configString = JSON.stringify(config);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let observer: IntersectionObserver | null = null;

    const loadWidget = () => {
      if (!container) return;
      // Reset container to avoid duplicate widgets or malformed markup
      container.innerHTML = '';

      // TradingView expects a placeholder element inside the container
      const placeholder = document.createElement('div');
      placeholder.className = 'tradingview-widget-container__widget';
      placeholder.style.width = '100%';
      placeholder.style.height = `${height}px`;
      container.appendChild(placeholder);

      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.type = 'text/javascript';
      script.text = JSON.stringify({
        ...config,
        width: '100%',
        height: height,
      });
      container.appendChild(script);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadWidget();
            if (observer) {
              observer.unobserve(entry.target);
              observer.disconnect();
            }
          }
        });
      },
      { rootMargin: '200px', threshold: 0.01 } // Load when within 200px of viewport
    );

    observer.observe(container);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      container.innerHTML = '';
    };
  }, [scriptUrl, height, configString, config]);

  return containerRef;
};

export default useTradingViewWidget;
