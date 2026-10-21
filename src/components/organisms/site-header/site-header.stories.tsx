import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteHeader } from "./site-header";

const meta = {
  title: "Organisms/SiteHeader",
  component: SiteHeader,
  args: {
    locale: "en",
    palette: {
      trigger: "Commands",
      title: "Command palette",
      placeholder: "Type a command",
      empty: "No matching command",
      home: "Go to home",
      theme: "Theme",
      language: "Language",
      soundOn: "Turn sound on",
      soundOff: "Turn sound off",
    },
    messages: {
      language: "Language",
      skip: "Skip to content",
      cta: "Let's talk",
      cv: "My CV",
      menu: { open: "Menu", close: "Close" },
      nav: {
        label: "Sections",
        works: "Work",
        skills: "Skills",
        about: "About",
        contact: "Contact",
      },
      sound: { on: "Sound: on", off: "Sound: off", hint: "Turn the sound on" },
      theme: { label: "Theme", names: { dark: "Dark", light: "Light", swiss: "Swiss" } },
    },
  },
  parameters: { layout: "fullscreen", nextjs: { navigation: { pathname: "/en" } } },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
