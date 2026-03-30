/* PageReveal — CSS-only reveal animation wrapper.
   Uses CSS animation (not IntersectionObserver) so content is
   NEVER invisible. The old JS approach caused blank pages when
   the observer didn't fire. CSS animations always complete. */

interface PageRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function PageReveal({ children, delay = 0, className = '' }: PageRevealProps) {
  return (
    <div
      className={`reveal ${delay > 0 ? `reveal-delay-${Math.min(Math.ceil(delay / 100), 4)}` : ''} ${className}`}
    >
      {children}
    </div>
  );
}
