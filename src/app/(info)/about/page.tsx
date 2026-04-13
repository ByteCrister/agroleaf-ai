import { Metadata } from "next";
import AboutPage from "@/components/info/about/AboutPage";

export const metadata: Metadata = {
  title: "About – AgroLeaf AI Project & Dataset",
  description:
    "Learn about the AgroLeaf AI crop disease detection system – 30 crops, 134 disease classes, 56k+ images. Built with CNNs, FastAPI, and Next.js by Sadiqul Islam Shakib.",
  keywords: [
    "AgroLeaf AI about",
    "crop disease dataset",
    "plant disease detection project",
    "deep learning agriculture",
    "Kaggle crop dataset",
    "Sadiqul Islam Shakib",
  ],
  openGraph: {
    title: "About AgroLeaf AI – Deep Learning for Crop Health",
    description:
      "Explore the dataset, model architecture, and the developer behind AgroLeaf AI. 30 crops · 134 disease classes · 56k+ training images.",
    url: "https://agroleaf-ai.vercel.app/about",
    type: "website",
    images: [
      {
        url: "/og-about.png",
        width: 1200,
        height: 630,
        alt: "AgroLeaf AI about page – crop disease detection project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About AgroLeaf AI – Crop Disease Detection Project",
    description:
      "30 crops, 134 diseases, 56k images. CNN + FastAPI + Next.js. Built by Sadiqul Islam Shakib.",
    images: ["/og-about.png"],
  },
  alternates: {
    canonical: "https://agroleaf-ai.vercel.app/about",
  },
};

export default function Page() {
  return <AboutPage />;
}