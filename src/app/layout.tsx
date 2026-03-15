import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import Layout from '@/components/Layout';

export const metadata: Metadata = {
  title: 'resortss.in | Discover & Book Premium Resorts Anywhere',
  description: 'Find your next luxury getaway on resortss.in. Choose from handpicked resorts, villa rentals, and unique stays around the world.',
  keywords: 'resorts, resort booking, luxury travel, vacation rentals, hotels, resortss.in',
  openGraph: {
    title: 'resortss.in | Discover & Book Premium Resorts Anywhere',
    description: 'Find your next luxury getaway on resortss.in. Premium resorts and unique stays.',
    images: ['/og-image.jpg'], // Should be added to public/ later
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
