import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Roommate NG - Find Your Ideal Roommate',
  description: 'Looking for a roommate to beat high rent together? Roommate NG connects compatible flatmates across Nigeria.',
  keywords: ['Roommate', 'Roommate NG', 'Nigeria', 'Lagos', 'NYSC', 'Flatshare', 'Rent'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="bg-warm-gray text-slate-light font-body antialiased selection:bg-bright-cyan/20 selection:text-dark-slate min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
