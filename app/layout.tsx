import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mondana",
  description: "Your fast track into the Mondana community."
};

import BackgroundAvatars from "../components/BackgroundAvatars";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={pixelFont.className}>
        <BackgroundAvatars count={28} />
        {children}
      </body>
    </html>
  );
}
