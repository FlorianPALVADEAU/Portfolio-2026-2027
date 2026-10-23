/** Open-licence pictures used on the landing page; the footer must credit every one of them. */
export const pictureCredits = [
  {
    id: "lavaux-terraces",
    title: "Lavaux Switzerland",
    author: "Lorenz Poffet",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lavaux_Switzerland.jpg",
  },
  {
    id: "lavaux-church",
    title: "Église réformée Saint-Symphorien",
    author: "JoachimKohler-HB",
    licence: "CC BY-SA 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%C3%89glise_r%C3%A9form%C3%A9e_Saint-Symphorien,_Lac_Leman_et_les_vignobles_en_terrasses_de_Lavaux_(2013).jpg",
  },
] as const;

/** Fonts, logos and icons the site ships; each id is also the key of its description in the messages. */
export const assetCredits = [
  {
    id: "geist",
    name: "Geist",
    author: "Vercel",
    licence: "SIL OFL 1.1",
    licenceUrl: "https://openfontlicense.org/open-font-license-official-text/",
    sourceUrl: "https://github.com/vercel/geist-font",
  },
  {
    id: "simpleIcons",
    name: "Simple Icons",
    author: "Simple Icons contributors",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://simpleicons.org",
  },
  {
    id: "lucide",
    name: "Lucide",
    author: "Lucide contributors",
    licence: "ISC",
    licenceUrl: "https://lucide.dev/license",
    sourceUrl: "https://lucide.dev",
  },
  {
    id: "mdi",
    name: "Material Design Icons",
    author: "Pictogrammers",
    licence: "Apache-2.0",
    licenceUrl: "https://www.apache.org/licenses/LICENSE-2.0",
    sourceUrl: "https://pictogrammers.com/library/mdi/",
  },
  {
    id: "duckPlush",
    name: "Duck Plush",
    author: "SunnyBuns",
    licence: "CC BY 4.0",
    licenceUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://skfb.ly/oCRHr",
  },
] as const;
