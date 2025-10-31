import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";

export const sfPro = localFont({
    src: [{ path: "../public/fonts/SFPRODISPLAYMEDIUM.woff2", weight: "500", style: "normal" }],
    variable: "--font-sf-pro",
});

export const instrumentSans = Instrument_Sans({
    variable: "--font-instrument-sans",
});
