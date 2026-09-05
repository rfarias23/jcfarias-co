import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { ogFonts } from "@/lib/og/fonts";

export const alt = site.name + " — " + site.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card: serif wordmark on ink, tagline as an eyebrow. Palette tokens only. */
export default async function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "96px 104px",
        background: "#0E0E0E",
        color: "#FFFFFF",
      }}
    >
      <div
        style={{ display: "flex", width: 44, height: 1, background: "#FFFFFF", marginBottom: 40 }}
      />
      <div
        style={{
          display: "flex",
          fontFamily: "Newsreader",
          fontWeight: 300,
          fontSize: 84,
          letterSpacing: "0.13em",
          textTransform: "uppercase",
          lineHeight: 1,
        }}
      >
        {site.name}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 36,
          fontFamily: "Instrument Sans",
          fontWeight: 500,
          fontSize: 22,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#8A8A8A",
        }}
      >
        {site.tagline}
      </div>
    </div>,
    { ...size, fonts: await ogFonts() },
  );
}
