import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

// Inter is the most widely used font in modern e-commerce
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Roboto as a reliable fallback (used by many major e-commerce sites)
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Xrow ",
  description: "Afghanistan first E-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${roboto.variable} bg-white text-black  h-full antialiased`}
    >
      <body className=" flex flex-col font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
