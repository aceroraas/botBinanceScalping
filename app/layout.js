import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BOT BINANCE SCALPING",
  description: "Un bot trade simple para la comunidad SCALPING",
};

export default function RootLayout({ children }) {

  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
