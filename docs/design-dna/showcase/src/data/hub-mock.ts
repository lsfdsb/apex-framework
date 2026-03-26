/**
 * APEX OPS — Empty Fallback Data
 * No fake data. When no live session is active, the board is empty.
 * Real data flows from .apex/state/tasks.json via hook scripts.
 */

import type { TaskBoardState } from "./hub-types";

export const MOCK_TASK_BOARD: TaskBoardState = {
  projectName: "No active session",
  tasks: [],
  meta: {
    p0Count: 0,
    p1Count: 0,
    p2Count: 0,
    completedCount: 0,
    velocity: 0,
  },
};
