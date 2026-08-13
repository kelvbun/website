import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'baobun.dev',
  description: 'This site has moved to baobun.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>{children}</body>
    </html>
  );
}
