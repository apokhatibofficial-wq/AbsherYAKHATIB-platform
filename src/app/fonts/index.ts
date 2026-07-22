import localFont from "next/font/local";

export const tahrir = localFont({
  src: [
    { path: "./Tahrir_Book.woff2", weight: "350", style: "normal" },
    { path: "./Tahrir_Regular.woff2", weight: "400", style: "normal" },
    { path: "./Tahrir_Medium.woff2", weight: "500", style: "normal" },
    { path: "./Tahrir_Bold.woff2", weight: "700", style: "normal" },
    { path: "./Tahrir_ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "./Tahrir_Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-tahrir",
  display: "swap",
});
