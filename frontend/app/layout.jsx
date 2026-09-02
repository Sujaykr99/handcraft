import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Navbar from "@/components/layout/Navbar";
import { Toaster } from "@/components/ui/Toaster";

export const metadata = {
  title: "HandArt Marketplace",
  description: "Discover handcrafted products from artisans worldwide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Plus+Jakarta+Sans:wght@300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AppProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}