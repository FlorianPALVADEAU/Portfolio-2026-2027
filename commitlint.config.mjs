const ATTRIBUTION = [
  /^co-authored-by:/im,
  /^signed-off-by:.*(claude|copilot|codex|openai|anthropic)/im,
  /generated (with|by)\b/i,
  /🤖/u,
  /@(anthropic|openai)\.com/i,
];

/** @type {import("@commitlint/types").UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  plugins: [
    {
      rules: {
        "no-ai-attribution": ({ raw }) => {
          const hit = ATTRIBUTION.find((pattern) => pattern.test(raw));
          return [!hit, "commit message must not carry co-author trailers or tool attribution"];
        },
      },
    },
  ],
  rules: {
    "no-ai-attribution": [2, "always"],
    "header-max-length": [2, "always", 72],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
  },
};

export default config;
