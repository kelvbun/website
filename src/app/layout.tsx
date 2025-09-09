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
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>

        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet"/>
      </head>

      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
