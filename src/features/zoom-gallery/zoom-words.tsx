type ZoomWordsProps = {
  text: string;
};

/**
 * The words of a text, each behind its own mask so the gallery can lift them into view one by
 * one. The split copy is hidden from assistive technology, which reads the whole text once;
 * without the gallery's scripts every word simply shows.
 */
export function ZoomWords({ text }: ZoomWordsProps) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, index, words) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: the words never reorder
          <span key={index}>
            <span className="mb-[-0.15em] inline-block overflow-hidden pb-[0.15em] align-top">
              <span data-zoom-word className="inline-block will-change-transform">
                {word}
              </span>
            </span>
            {index < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}
