import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** @type {import('next').Metadata} */
export const metadata = {
  title: "Coffee Personality Quiz | Basecamp Coffee",
  description: "Discover your coffee personality and find your perfect Basecamp Coffee drink.",
};

/**
 * @param {Readonly<{ children: import('react').ReactNode }>} props
 * @returns {import('react').JSX.Element}
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
