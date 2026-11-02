import { ImageResponse } from "next/og";

export const alt = "Study Help: Dive Into a World of Possibilities.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, color: "#fff", background: "linear-gradient(160deg, #087BBF 0%, #092B4C 45%, #061426 100%)" }}>
      <div style={{ fontSize: 30, color: "#72E5F2", letterSpacing: 2 }}>Study Help</div>
      <div style={{ fontSize: 76, fontWeight: 700, marginTop: 20, maxWidth: 900 }}>Dive Into a World of Possibilities.</div>
    </div>,
    size,
  );
}
