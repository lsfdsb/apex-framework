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

/**
 * Parses query parameters from the hash URL.
 * Example: #/tasks?project=visual-hub → { project: "visual-hub" }
 */
export function useHashParams(): Record<string, string> {
  const hash = useHash();

  const queryStart = hash.indexOf("?");
  if (queryStart === -1) return {};

  const queryString = hash.slice(queryStart + 1);
  const params: Record<string, string> = {};
  for (const part of queryString.split("&")) {
    const eqIdx = part.indexOf("=");
    if (eqIdx === -1) continue;
    const key = decodeURIComponent(part.slice(0, eqIdx));
    const value = decodeURIComponent(part.slice(eqIdx + 1));
    params[key] = value;
  }
  return params;
}

export function Link({
  to,
  children,
  className,
  style,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <a href={`#${to}`} className={className} style={style}>
      {children}
    </a>
  );
}
