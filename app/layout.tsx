import { Inter, Be_Vietnam_Pro, Playfair_Display, Merriweather } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const beVietnam = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${beVietnam.className}`}>{children}</body>
    </html>
  );
}
