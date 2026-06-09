import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";
import { StoreDataProvider } from "@/context/StoreDataContext";

export const metadata: Metadata = {
  title: "Scents by DajaaB · All Premium Scents · Memphis",
  description: "Luxury fragrance reseller in Memphis, TN. Hand-curated Creed, Maison Francis Kurkdjian, Tom Ford, Clive Christian, and house designers — pickup only.",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&family=Pinyon+Script&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StoreDataProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </StoreDataProvider>
      </body>
    </html>
  );
}
