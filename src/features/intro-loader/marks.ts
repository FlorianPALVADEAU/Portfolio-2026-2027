/** Geometry of `public/brand/fpl-logo.svg`: the three letters, then the four marks on the right. */
export const LOGO_WIDTH = 117;
export const LOGO_HEIGHT = 33;
/** Centre of the four marks, which is where they sit alone before the letters reach them. */
export const MARKS_CENTER = { x: 100.25, y: 16.25 };

export const MARKS = [
  { id: "bl", d: "M99.5 32.001H84.5C84.5 22.001 92 17.001 99.5 17.001V32.001Z" },
  {
    id: "br",
    d: "M116 17.001V32.001H107.094C105.5 32.001 101 30.5947 101 24.9697C101 19.3447 105.5 17.001 107.094 17.001H116Z",
  },
  { id: "tr", d: "M101 0.500977L116 0.500979C116 10.501 108.5 15.501 101 15.501V0.500977Z" },
  {
    id: "tl",
    d: "M84.5938 15.501V0.500977H93.5C95 0.500973 99.5938 1.90723 99.5938 7.53223C99.5938 13.1572 95 15.501 93.5 15.501L84.5938 15.501Z",
  },
] as const;

export type MarkId = (typeof MARKS)[number]["id"];

export const LETTERS = [
  { id: "l", d: "M56 32.3317V0.500977L64 0.501544V25.5015H76.6597V32.3317H56Z" },
  {
    id: "p",
    d: "M26.4984 32.0014L26.2344 0.50138L34.4984 0.501953V7.12028V16.1966C34.4984 16.1966 43.3784 17.502 43.3784 11.5014C43.3784 6.06911 36.098 6.88238 34.7215 7.08469V0.501935L41.4984 0.501386C42.9984 0.44166 51.9984 2.28432 51.9984 11.5018C51.9984 25.0012 34.4984 22.5014 34.4984 22.5014V32.0014H26.4984Z",
  },
  { id: "f", d: "M0.5 32V0.5H22.5V7H8.5V13.1697H21.1936V19.5H8.5V32H0.5Z" },
] as const;
