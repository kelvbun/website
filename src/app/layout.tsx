import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Home | kelvin.social',
  description: 'a boy who is passionate about programming',
  openGraph: {
    title: 'Home | kelvin.social',
    url: 'https://kelvin.social',
  },
  twitter: {
    card: 'summary',
    title: 'Home | kelvin.social',
    description: 'a boy who is passionate about programming',
    site: 'https://kelvin.social', 
    creator: '@kelvnzh',
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head></head>
      <body>
        {children}
      </body>
    </html>
  );
}
