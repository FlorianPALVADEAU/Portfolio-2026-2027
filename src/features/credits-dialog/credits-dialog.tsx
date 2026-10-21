"use client";

import { X } from "lucide-react";
import { type ReactNode, useRef } from "react";
import { Icon } from "@/components/atoms/icon";

type CreditsDialogProps = {
  triggerLabel: string;
  title: string;
  closeLabel: string;
  /** Classes of the trigger, which is set as a text link. */
  triggerClassName?: string;
  /** The credits themselves, rendered by the server so this component stays a shell. */
  children: ReactNode;
};

/** A text link that opens every credit of the site in a native modal, which traps focus and closes on Escape. */
export function CreditsDialog({
  triggerLabel,
  title,
  closeLabel,
  triggerClassName,
  children,
}: CreditsDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        data-sound="open"
        onClick={() => dialog.current?.showModal()}
        className={triggerClassName}
      >
        {triggerLabel}
      </button>
      <dialog
        ref={dialog}
        aria-label={title}
        onPointerDown={(event) => {
          if (event.target === dialog.current) dialog.current?.close();
        }}
        className="dialog-in m-auto max-h-[min(40rem,calc(100svh-2rem))] w-[min(36rem,calc(100%-2rem))] rounded-2xl border border-border bg-background p-0 text-foreground backdrop:bg-black/60"
      >
        <div data-lenis-prevent="" className="max-h-[inherit] overflow-y-auto p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => dialog.current?.close()}
              className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border outline-offset-2 hover:bg-muted"
            >
              <Icon icon={X} size="sm" />
            </button>
          </div>
          {children}
        </div>
      </dialog>
    </>
  );
}
