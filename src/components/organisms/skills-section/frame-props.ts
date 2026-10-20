import type { Messages } from "@/lib/i18n";

export type GroupFrameProps = {
  /** Position of the frame, from 1, and the number of frames. */
  order: number;
  total: number;
  messages: Messages["home"]["skills"];
};
