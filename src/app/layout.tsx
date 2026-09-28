import type { Metadata } from "next";
import Script from "next/script";
import { NavbarComponent } from "@/components/navbar";
import { FooterComponent } from "@/components/footer";
import { footerConfig } from "@/constants/footer";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Notifier",
  description: "Track your payments with Notifier",
  icons: { icon: "/assets/images/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        <NavbarComponent />
        <main className="app-main">{children}</main>
        <FooterComponent {...footerConfig} />
        <Script
          src="https://accounts.google.com/gsi/client?hl=en"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
