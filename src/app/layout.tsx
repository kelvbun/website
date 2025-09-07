import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'kelvin.social',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
      <meta property="og:title" content='kelvin.social' />
      <meta property="og:description" content="kelvin's personal website" />
      <meta property="og:url" content='https://kelvin.social' />
      <meta property="og:image" content='https://images.unsplash.com/photo-1583425583779-27e82172cf05?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' />
      <meta name="twitter:card" content="summary_large_image" />
    </head>

      <body>
        {children}
      </body>
    </html>
  );
}
