import type { TaskItem } from "../../data/hub-types";

interface TaskDetailProps {
  task: TaskItem;
}

function CheckIcon({ met }: { met: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={met ? "var(--success)" : "var(--border-hover)"}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {met ? <polyline points="20 6 9 17 4 12" /> : <circle cx="12" cy="12" r="9" />}
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/** Expanded task detail panel — acceptance criteria, files, and dependencies. */
export function TaskDetail({ task }: TaskDetailProps) {
  const metCount = task.acceptanceCriteria.filter((c) => c.met).length;
  const total = task.acceptanceCriteria.length;

  return (
    <div
      style={{
        padding: "12px 16px 16px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Description */}
      {task.description && (
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--text-secondary)",
            margin: 0,
          }}
        >
          {task.description}
        </p>
      )}

      {/* Acceptance Criteria */}
      {total > 0 && (
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            Acceptance Criteria ({metCount}/{total})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {task.acceptanceCriteria.map((criterion, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <CheckIcon met={criterion.met} />
                <span
                  style={{
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: criterion.met ? "var(--text-secondary)" : "var(--text)",
                    textDecoration: criterion.met ? "line-through" : "none",
                    opacity: criterion.met ? 0.7 : 1,
                  }}
                >
                  {criterion.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {task.files.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            Files ({task.files.length})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {task.files.map((file) => (
              <div
                key={file}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "var(--text-muted)",
                }}
              >
                <FileIcon />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-mono, monospace)",
                    color: "var(--accent)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {file}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dependencies */}
      {(task.blockedBy.length > 0 || task.blocks.length > 0) && (
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            Dependencies
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {task.blockedBy.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <LinkIcon />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Blocked by:{" "}
                  {task.blockedBy.map((id, i) => (
                    <span key={id}>
                      <span style={{ color: "var(--destructive)", fontWeight: 600 }}>{id}</span>
                      {i < task.blockedBy.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>
            )}
            {task.blocks.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <LinkIcon />
                <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Blocks:{" "}
                  {task.blocks.map((id, i) => (
                    <span key={id}>
                      <span style={{ color: "var(--warning)", fontWeight: 600 }}>{id}</span>
                      {i < task.blocks.length - 1 && ", "}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
