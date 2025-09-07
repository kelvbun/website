import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Home | kelvin.social',
  description: 'a boy who is passionate about programming',
  openGraph: {
    title: 'Home | kelvin.social',
    url: 'https://kelvin.social',
    images: {
      url: 'https://images.unsplash.com/photo-1583425583779-27e82172cf05?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      width: 200,
      height:200
    }
  },
  twitter: {
    card: 'summary',
    title: 'Home | kelvin.social',
    description: 'a boy who is passionate about programming',
    site: 'https://kelvin.social', 
    creator: '@kelvnzh',
    images: ['https://images.unsplash.com/photo-1583425583779-27e82172cf05?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
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
