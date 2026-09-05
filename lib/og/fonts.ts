import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Static TTF instances (SIL Open Font License) for satori, which cannot read the
 * woff2 files next/font emits and must not fetch at build time. Same two faces and
 * weights the site renders: Newsreader 300 and Instrument Sans 500.
 */
async function load(file: string): Promise<ArrayBuffer> {
  const buf = await readFile(path.join(process.cwd(), "lib", "og", "fonts", file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

export async function ogFonts() {
  const [newsreader, instrument] = await Promise.all([
    load("Newsreader-Light.ttf"),
    load("InstrumentSans-Medium.ttf"),
  ]);
  return [
    { name: "Newsreader", data: newsreader, weight: 300 as const, style: "normal" as const },
    { name: "Instrument Sans", data: instrument, weight: 500 as const, style: "normal" as const },
  ];
}
