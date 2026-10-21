import { LETTERS, LOGO_HEIGHT, LOGO_WIDTH, MARKS } from "@/lib/brand";

/** The logo sitting on the cover; its four marks, grouped as `data-spin`, are what turns. */
export function TransitionLogo() {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}
      className="absolute top-1/2 left-1/2 w-44 -translate-x-1/2 -translate-y-1/2 fill-accent-foreground md:w-60"
    >
      {LETTERS.map(({ id, d }) => (
        <path key={id} d={d} />
      ))}
      <g data-spin>
        {MARKS.map(({ id, d }) => (
          <path key={id} d={d} />
        ))}
      </g>
    </svg>
  );
}
