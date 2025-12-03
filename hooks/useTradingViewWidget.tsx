'use client'
import { useEffect, useRef } from 'react';

const useTradingViewWidget = (
  scriptUrl: string,
  config: Record<string, unknown>,
  height = 600
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const loadWidget = () => {
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
      script.text = JSON.stringify(config);
      container.appendChild(script);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadWidget();
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' } // Load when within 200px of viewport
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
      container.innerHTML = '';
    };
  }, [scriptUrl, height, JSON.stringify(config)]);

  return containerRef;
};

export default useTradingViewWidget;
