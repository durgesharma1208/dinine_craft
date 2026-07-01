import { useState, useEffect, useRef } from 'react';

export default function CountUp({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || started.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const isDecimal = end % 1 !== 0;

          const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = isDecimal
              ? Number((end * easeOut).toFixed(1))
              : Math.floor(end * easeOut);

            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(tick);
          observer.unobserve(element);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}
