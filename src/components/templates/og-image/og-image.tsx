type OgImageProps = {
  name: string;
  role: string;
  badge: string;
};

/** Share card markup. Satori renders it, so it uses inline styles and its own palette. */
export function OgImage({ name, role, badge }: OgImageProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#0a0a0a",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa" }}>{badge}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700 }}>{name}</div>
        <div style={{ display: "flex", fontSize: 44, color: "#a1a1aa" }}>{role}</div>
      </div>
    </div>
  );
}
