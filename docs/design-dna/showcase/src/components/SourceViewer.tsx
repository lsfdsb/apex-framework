import { useState } from "react";

interface SourceViewerProps {
  source: string;
  filename: string;
}

export function SourceViewer({ source, filename }: SourceViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--bg)" }}>
      <div className="flex items-center justify-between px-4 py-2" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <span className="text-sm font-mono" style={{ color: "var(--text-muted)" }}>{filename}</span>
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1 rounded-md font-medium transition-colors"
          style={{
            background: copied ? "var(--success)" : "var(--accent)",
            color: copied ? "white" : "var(--bg)",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <code>{source}</code>
      </pre>
    </div>
  );
}
