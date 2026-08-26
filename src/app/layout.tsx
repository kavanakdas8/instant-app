import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import MobileContainer from "@/components/MobileContainer";
import Navigation from "@/components/Navigation";
import { Poppins, JetBrains_Mono } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'], 
  variable: '--font-poppins' 
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono' 
});

export const metadata: Metadata = {
  title: "Instants - Travel Captures & Groups",
  description: "Live photos, vertical travel video feeds, and request-based adventure community groups.",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white antialiased font-sans">
        <AppProvider>
          <MobileContainer>
            {children}
            <Navigation />
          </MobileContainer>
        </AppProvider>
      </body>
    </html>
  );
}
