type Client = {
  id: string;
  name: string;
  /** Size of the logo as drawn, in px. */
  width: number;
  height: number;
  /** The logo is drawn dark on an opaque white background, so it must be inverted to read on black. */
  onWhite?: true;
  /** The company's site, when it has been checked; the card is a plain tile otherwise. */
  url: string | null;
};

/** Companies the owner worked with; the logo files live in `public/brand/companies`. */
export const clients: readonly Client[] = [
  { id: "jcdecaux", name: "JCDecaux", width: 121, height: 20, url: "https://www.jcdecaux.com" },
  { id: "kering", name: "Kering", width: 147, height: 16, url: "https://www.kering.com" },
  { id: "lvmh", name: "LVMH", width: 73, height: 17, onWhite: true, url: "https://www.lvmh.com" },
  {
    id: "bnp-paribas",
    name: "BNP Paribas",
    width: 168,
    height: 17,
    url: "https://group.bnpparibas",
  },
  { id: "cea", name: "CEA", width: 40, height: 30, url: "https://www.cea.fr" },
  { id: "amalgame", name: "Amalgame", width: 118, height: 22, url: "https://amalgame.io/" },
  {
    id: "neuronesit",
    name: "Neurones IT",
    width: 138,
    height: 18,
    url: "https://neurones-it.com/",
  },
  {
    id: "overbound",
    name: "Overbound",
    width: 109,
    height: 19,
    url: "https://overbound-race.com/",
  },
];
