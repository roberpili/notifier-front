import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { NavbarComponent } from "@/components/navbar";
import { FooterComponent } from "@/components/footer";
import { footerConfig } from "@/constants/footer";

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
    <html lang="en">
      <body>
        <div>
          <NavbarComponent />
          {children}
          <FooterComponent {...footerConfig} />
        </div>
        <Script
          src="https://accounts.google.com/gsi/client?hl=en"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
