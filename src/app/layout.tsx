import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { jetbrainsMono, plusJakarta } from "@/fonts/google-fonts";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { AgroToaster } from "@/components/global/AgroToaster";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

// ---------- Metadata ----------
export const metadata: Metadata = {
  metadataBase: new URL('https://agroleaf-ai.vercel.app'),
  title: {
    default: 'AgroLeaf AI – Crop Disease Detection & AI Suggestions',
    template: '%s | AgroLeaf AI'
  },
  description: 'Upload a crop leaf image – our CNN model detects diseases and OpenAI provides treatment suggestions. Fast, accurate, and farmer‑friendly.',
  keywords: [
    'crop disease detection',
    'plant disease AI',
    'agriculture',
    'deep learning',
    'FastAPI',
    'OpenAI suggestions',
    'AgroLeaf AI'
  ],
  authors: [{ name: 'Sadiqul Islam Shakib', url: 'https://sadiqul-islam-shakib.vercel.app' }],
  creator: 'Sadiqul Islam Shakib',
  publisher: 'AgroLeaf AI',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://agroleaf-ai.vercel.app', 
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://agroleaf-ai.vercel.app',
    siteName: 'AgroLeaf AI',
    title: 'AgroLeaf AI – Diagnose Crop Diseases with AI',
    description: 'Upload a leaf photo, get instant disease prediction + OpenAI treatment recommendations.',
    images: [
      {
        url: '/og-image.png', // 1200x630px, place in public/
        width: 1200,
        height: 630,
        alt: 'AgroLeaf AI preview – crop disease detection'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@AgroLeafAI',      // optional – replace with your handle
    creator: '@SadiqulShakib', // optional – replace with your Twitter handle
    title: 'AgroLeaf AI – AI for Healthy Crops',
    description: 'CNN + OpenAI: detect crop diseases and get actionable advice.',
    images: ['/twitter-image.jpg']
  },
  verification: {
    google: 'YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE', // 🔁 Replace with actual code
  },
  category: 'technology',
}

// ---------- Viewport (mobile & theme color) ----------
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#15803d', // agricultural green
}

// ---------- JSON-LD structured data (Person + Dataset) ----------
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Sadiqul Islam Shakib',
  url: 'https://sadiqul-islam-shakib.vercel.app',
  sameAs: [
    'https://github.com/ByteCrister',     
    'https://www.linkedin.com/in/sadiqul-islam-shakib',
    'https://www.instagram.com/_sadiqul_islam_shakib_',
    'https://www.facebook.com/sadiqulislam.shakib.33'
  ],
  jobTitle: 'AI Engineer / Full Stack Developer',
  knowsAbout: ['Deep Learning', 'Computer Vision', 'FastAPI', 'Next.js', 'Precision Agriculture'],
  // Reference to the Kaggle dataset used for training
  subjectOf: {
    '@type': 'Dataset',
    name: 'High Quality Crop Disease Image Dataset for CNNs',
    url: 'https://www.kaggle.com/datasets/akarshangupta/high-quality-crop-disease-image-dataset-for-cnns',
    creator: {
      '@type': 'Person',
      name: 'Akarshan Gupta'
    },
    description: 'Curated dataset of healthy and diseased crop leaves – used to train AgroLeaf AI’s CNN model.'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", plusJakarta.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <head>
        {/* Favicons – place these files in /public */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#15803d" />
        <meta name="msapplication-TileColor" content="#15803d" />

        {/* JSON-LD for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
        <AgroToaster />
        <Toaster />
      </body>
    </html>
  );
}