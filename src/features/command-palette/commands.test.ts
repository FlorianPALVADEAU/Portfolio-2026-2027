import { describe, expect, it } from "vitest";
import { type Command, filterCommands } from "./commands";

const run = () => {};
const commands: Command[] = [
  { id: "home", label: "Go to home", run },
  { id: "theme-swiss", label: "Theme: Swiss", run },
  { id: "lang-fr", label: "Language: Français", run },
];

describe("filterCommands", () => {
  it("returns everything for an empty query", () => {
    expect(filterCommands(commands, "  ")).toHaveLength(3);
  });

  it("matches every word, ignoring case", () => {
    expect(filterCommands(commands, "THEME swi").map((c) => c.id)).toEqual(["theme-swiss"]);
  });

  it("ignores accents", () => {
    expect(filterCommands(commands, "francais").map((c) => c.id)).toEqual(["lang-fr"]);
  });

  it("returns nothing when no command matches", () => {
    expect(filterCommands(commands, "zzz")).toEqual([]);
  });
});
