import { Fragment } from "react";

/** Glyph copies per letter: the strip falls past two of them before it lands, so it rolls twice. */
const COPIES = 3;

const copies = Array.from({ length: COPIES }, (_, copy) => copy);

/**
 * A label whose letters roll like a drum when the nearest `flip-host` ancestor is hovered. Pure
 * CSS (see globals.css), so it costs no script. Screen readers get the plain text; the rolling
 * copy is hidden from them.
 */
export function FlipText({ children }: { children: string }) {
  let position = 0;
  const words = children.split(" ").map((word) => ({
    // Letters before this word make it unique even when the same word repeats.
    start: position,
    letters: [...word].map((character) => {
      position += 1;
      return { character, index: position };
    }),
  }));

  return (
    <>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">
        {words.map(({ start, letters }, order) => (
          <Fragment key={start}>
            <span className="inline-block whitespace-nowrap">
              {letters.map(({ character, index }) => (
                <span
                  key={index}
                  className="-mb-[0.15em] inline-block h-[calc(1lh+0.15em)] overflow-hidden align-top"
                >
                  <span
                    className="flip-strip block"
                    style={{ "--i": index } as React.CSSProperties}
                  >
                    {copies.map((copy) => (
                      <span key={copy} className="block pb-[0.15em]">
                        {character}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
            {order < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </>
  );
}
