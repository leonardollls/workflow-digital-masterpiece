import { useState, useEffect, useRef, type ReactNode } from 'react';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  className?: string;
}

const LazySection = ({
  children,
  fallback,
  rootMargin = '300px',
  minHeight = '200px',
  className = '',
}: LazySectionProps) => {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  const defaultFallback = (
    <div style={{ minHeight }} aria-hidden="true" />
  );

  return (
    <div ref={sectionRef} className={className}>
      {isInView ? children : (fallback ?? defaultFallback)}
    </div>
  );
};

export default LazySection;
