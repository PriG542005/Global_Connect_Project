import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {StoreProvider} from "./context/store"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Global Connect",
  description: "Connect to peoples and share your thoughts and ideas worldwide. and more...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <StoreProvider>
        <body
          className={`antialiased hide-scrollbar`}
        >
          {children}
        </body>
      </StoreProvider>
    </html>
  );
}
