export default {
  slug: "overbound",
  year: 2026,
  stack: ["Next.js", "Supabase", "Stripe", "Sanity"],
  cover: {
    src: "/projects/overbound/cover.webp",
    depth: "/projects/overbound/depth.webp",
    width: 1920,
    height: 1280,
  },
  teaser: {
    poster: { src: "/projects/overbound/teaser-poster.webp", width: 1280, height: 720 },
    video: "/projects/overbound/teaser.mp4",
  },
  blocks: [
    {
      id: "links",
      type: "links",
      items: [
        { id: "site", href: "https://www.overbound-race.com" },
        { id: "code", href: "https://github.com/FlorianPALVADEAU/Overbound" },
      ],
    },
    { id: "context", type: "text" },
    { id: "problem", type: "text" },
    { id: "role", type: "text" },
    { id: "stack", type: "stack", items: ["Next.js", "Supabase", "Stripe", "Sanity"] },
    { id: "platform", type: "text" },
    { id: "decisions", type: "challenges" },
    { id: "outcome", type: "text" },
    { id: "results", type: "results" },
    { id: "lessons", type: "challenges" },
    {
      id: "tire-flip",
      type: "media",
      image: { src: "/projects/overbound/tire-flip.avif", width: 1920, height: 1280 },
    },
    {
      id: "tire-drag",
      type: "media",
      image: { src: "/projects/overbound/tire-drag.avif", width: 1920, height: 1280 },
    },
    {
      id: "log-carry",
      type: "media",
      image: { src: "/projects/overbound/log-carry2.webp", width: 1920, height: 2880 },
    },
    {
      id: "log-lift",
      type: "media",
      image: { src: "/projects/overbound/log-carry-end.avif", width: 1920, height: 2880 },
    },
    {
      id: "chain-carry",
      type: "media",
      image: { src: "/projects/overbound/chain-carry4.webp", width: 1920, height: 2880 },
    },
    {
      id: "monkey-bars",
      type: "media",
      image: { src: "/projects/overbound/monkey-bars.webp", width: 1920, height: 2880 },
    },
    {
      id: "wall-under",
      type: "media",
      image: { src: "/projects/overbound/wall-under.avif", width: 1920, height: 1280 },
    },
    {
      id: "barbed-wire",
      type: "media",
      image: { src: "/projects/overbound/barbels.avif", width: 1920, height: 1280 },
    },
    {
      id: "podium",
      type: "media",
      image: { src: "/projects/overbound/P1102412.avif", width: 1920, height: 1280 },
    },
    {
      id: "finishers",
      type: "media",
      image: { src: "/projects/overbound/P1102314.avif", width: 1920, height: 1280 },
    },
    {
      id: "crowd",
      type: "media",
      image: { src: "/projects/overbound/P1102323.webp", width: 1920, height: 1280 },
    },
    {
      id: "finish-hug",
      type: "media",
      image: { src: "/projects/overbound/benevoles-47.avif", width: 1920, height: 1280 },
    },
    {
      id: "medals",
      type: "media",
      image: { src: "/projects/overbound/P1091283.webp", width: 1920, height: 2880 },
    },
  ],
};
