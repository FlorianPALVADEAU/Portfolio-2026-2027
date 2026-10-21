type RiseTextProps = {
  children: string;
  className?: string;
};

/**
 * Text cut into words, each behind its own mask. A feature finds `data-rise-word` and slides the
 * words up from below the mask; without it the words simply sit in place and read as plain text.
 */
export function RiseText({ children, className }: RiseTextProps) {
  return (
    <span className={className}>
      {children.split(" ").map((word, index) => (
        // The words never reorder, so their position is a stable key.
        // biome-ignore lint/suspicious/noArrayIndexKey: see above
        <span key={index}>
          {index > 0 && " "}
          <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <span data-rise-word="" className="inline-block">
              {word}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}
