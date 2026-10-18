type JsonLdProps = {
  data: Record<string, unknown>;
};

/** Renders structured data. `<` is escaped so the payload can never close the script tag. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized, escaped JSON from our own typed data
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
