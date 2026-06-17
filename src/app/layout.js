import { Inter, PT_Sans, Open_Sans, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ptSans = PT_Sans({
  weight: ['400', '700'],
  variable: "--font-pt-sans",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: "--font-poppins",
  subsets: ["latin"],
});

import prisma from "@/lib/prisma";

export async function generateMetadata() {
  // Default fallback metadata
  let meta = {
    websiteTitle: 'Advanced Materials Congress - Official Scientific Assembly Series of IAAM',
    websiteDescription: 'Official Scientific Assembly Series of IAAM. Join the global community of researchers and professionals.',
    keywords: 'IAAM, Advanced Materials, Congress, Scientific Assembly, Research, Materials Science',
    faviconImage: '/favicon.ico',
    ogImage: '/LOGO.jpg'
  };

  try {
    const siteIdentitySection = await prisma.section.findUnique({
      where: { pageId_id: { pageId: 'global', id: 'site-identity' } }
    });

    if (siteIdentitySection && siteIdentitySection.content) {
      const parsed = JSON.parse(siteIdentitySection.content);
      meta = { ...meta, ...parsed };
    }
  } catch (error) {
    console.error("Error fetching site-identity metadata:", error);
  }

  const keywordsArray = meta.keywords ? meta.keywords.split(',').map(k => k.trim()) : [];

  return {
    metadataBase: new URL('https://advancedmaterialscongress.org'),
    title: {
      template: '%s | Advanced Materials Congress',
      default: meta.websiteTitle,
    },
    description: meta.websiteDescription,
    keywords: keywordsArray,
    authors: [{ name: 'IAAM' }],
    creator: 'IAAM',
    icons: {
      icon: meta.faviconImage,
      shortcut: meta.faviconImage,
      apple: meta.faviconImage,
    },
    openGraph: {
      title: meta.websiteTitle,
      description: meta.websiteDescription,
      url: 'https://advancedmaterialscongress.org',
      siteName: 'Advanced Materials Congress',
      images: [
        {
          url: meta.ogImage,
          width: 800,
          height: 600,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ptSans.variable} ${openSans.variable} ${poppins.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
