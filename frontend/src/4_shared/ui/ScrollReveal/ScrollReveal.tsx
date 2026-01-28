import type { ReactNode } from 'react';
import { useInView } from '@shared/lib/hooks';

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  once?: boolean;
  rootMargin?: string;
  threshold?: number | number[];
};

export function ScrollReveal({
  children,
  className,
  delayMs,
  once = true,
  rootMargin,
  threshold,
}: ScrollRevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    once,
    rootMargin,
    threshold,
  });

  return (
    <div
      ref={ref}
      data-revealed={inView}
      className={['scroll-reveal', className].filter(Boolean).join(' ')}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
