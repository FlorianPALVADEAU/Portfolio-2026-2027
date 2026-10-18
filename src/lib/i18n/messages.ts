import type en from "../../../messages/en.json";
import type { Locale } from "./config";

export type Messages = typeof en;

const loaders: Record<Locale, () => Promise<{ default: Messages }>> = {
  fr: () => import("../../../messages/fr.json"),
  en: () => import("../../../messages/en.json"),
  de: () => import("../../../messages/de.json"),
};

export async function getMessages(locale: Locale): Promise<Messages> {
  return (await loaders[locale]()).default;
}
