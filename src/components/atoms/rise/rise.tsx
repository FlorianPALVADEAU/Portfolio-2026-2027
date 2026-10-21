import type { ComponentPropsWithoutRef } from "react";

/**
 * A block that a feature can slide up from below its own edge: the outer element becomes the
 * mask, the inner one moves. Both are plain wrappers until the script runs, so nothing is clipped
 * or hidden without it.
 */
export function Rise({ children, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div data-rise-mask="" {...props}>
      <div data-rise-word="">{children}</div>
    </div>
  );
}
