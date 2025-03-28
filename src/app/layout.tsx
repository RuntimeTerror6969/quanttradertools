'use client';

import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

const mokoto = localFont({
  src: '../../public/fonts/Mokoto.ttf',
  variable: '--font-mokoto',
  preload: true,
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mokoto.variable} suppressHydrationWarning>
      <body className={`${inter.className} font-mokoto transition-colors duration-200`} suppressHydrationWarning>
        <ThemeProvider>
          <Toaster 
            position="top-center"
            toastOptions={{
              className: 'dark:bg-gray-800 dark:text-white',
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
