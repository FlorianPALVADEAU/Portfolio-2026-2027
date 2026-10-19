type Client = {
  id: string;
  name: string;
  /** Size of the logo as drawn, in px. */
  width: number;
  height: number;
  /** The logo is drawn dark on an opaque white background, so it must be inverted to read on black. */
  onWhite?: true;
};

/** Companies the owner worked with; the logo files live in `public/brand/companies`. */
export const clients: readonly Client[] = [
  { id: "jcdecaux", name: "JCDecaux", width: 121, height: 20 },
  { id: "kering", name: "Kering", width: 147, height: 16 },
  { id: "lvmh", name: "LVMH", width: 73, height: 17, onWhite: true },
  { id: "bnp-paribas", name: "BNP Paribas", width: 168, height: 17 },
  { id: "cea", name: "CEA", width: 40, height: 23 },
  { id: "amalgame", name: "Amalgame", width: 118, height: 22 },
  { id: "neuronesit", name: "Neurones IT", width: 138, height: 18 },
  { id: "overbound", name: "Overbound", width: 109, height: 19 },
];
