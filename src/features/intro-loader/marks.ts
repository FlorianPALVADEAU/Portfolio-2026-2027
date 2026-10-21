/** The four marks of the FPL logo, in the 33 x 33 box of `public/brand/fpl-logo-icons.svg`. */
export const MARK_SIZE = 33;

export const MARKS = [
  { id: "bl", d: "M15.5 32H0.5C0.5 22 8 17 15.5 17V32Z" },
  {
    id: "br",
    d: "M32 17V32H23.0938C21.5 32 17 30.5938 17 24.9688C17 19.3438 21.5 17 23.0938 17H32Z",
  },
  { id: "tr", d: "M17 0.5L32 0.500002C32 10.5 24.5 15.5 17 15.5V0.5Z" },
  {
    id: "tl",
    d: "M0.59375 15.5V0.5H9.5C11 0.499996 15.5938 1.90625 15.5938 7.53125C15.5938 13.1562 11 15.5 9.5 15.5L0.59375 15.5Z",
  },
] as const;

export type MarkId = (typeof MARKS)[number]["id"];
