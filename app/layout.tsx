import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Luxury Instagram Automation',
  description: 'Automated daily luxury lifestyle content for Instagram',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
