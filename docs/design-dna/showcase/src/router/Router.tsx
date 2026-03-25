import { useState, useEffect, type ReactNode } from "react";

export function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash.slice(1) || "/");

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return hash;
}

export function Link({ to, children, className, style }: { to: string; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <a href={`#${to}`} className={className} style={style}>
      {children}
    </a>
  );
}
