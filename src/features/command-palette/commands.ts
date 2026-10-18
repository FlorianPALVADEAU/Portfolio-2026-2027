export type Command = {
  id: string;
  label: string;
  run: () => void;
};

/** Case- and accent-insensitive substring match on every word of the query. */
export function filterCommands(commands: readonly Command[], query: string): Command[] {
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  const words = normalize(query).split(/\s+/).filter(Boolean);
  return commands.filter((command) => {
    const label = normalize(command.label);
    return words.every((word) => label.includes(word));
  });
}
