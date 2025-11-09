import type { Metadata } from "next";
import "./globals.css";
import { Press_Start_2P } from "next/font/google";
import BackgroundAvatars from "../components/BackgroundAvatars";
import AudioPlaque from "@/components/AudioPlaque";

const pixelFont = Press_Start_2P({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mondana",
  description: "Your fast track into the Mondana community.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={pixelFont.className}>
        <BackgroundAvatars count={28} />
        {children}

        {/* Плеер: правый нижний угол; отступы можно менять */}
        <AudioPlaque
          src="/plaque/assets/music.mp3"   // положи файл сюда: public/plaque/assets/music.mp3
          corner="bottom-right"
          offsetX={20}
          offsetY={20}
        />
      </body>
    </html>
  );
}
