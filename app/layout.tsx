import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "NIDC - Nigeria Innovation Community Foundation",
  description:
    "Identifying, developing, and deploying capable Nigerians into Energy, Manufacturing, and Digital Infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${poppins.variable} bg-surface-primary font-body text-text-primary`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
