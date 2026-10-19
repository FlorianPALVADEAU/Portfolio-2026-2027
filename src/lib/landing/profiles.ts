/** Public profiles the owner approved for the contact section; names are brands, not translated. */
export const profiles = [
  { id: "github", label: "GitHub", href: "https://github.com/FlorianPALVADEAU" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/florianpalvadeau" },
] as const;

/** GitHub account name, read from the approved profile link. */
export const githubLogin =
  profiles
    .find(({ id }) => id === "github")
    ?.href.split("/")
    .pop() ?? "";
