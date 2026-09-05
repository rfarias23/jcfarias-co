import { ImageResponse } from "next/og";
import { ogFonts } from "@/lib/og/fonts";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: serif "JC" wordmark on ink. */
export default async function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0E0E0E",
        color: "#FFFFFF",
        fontFamily: "Newsreader",
        fontWeight: 300,
        fontSize: 19,
        letterSpacing: "0.04em",
      }}
    >
      JC
    </div>,
    { ...size, fonts: await ogFonts() },
  );
}
