import CropsPage from "@/components/info/crops/CropsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crop Disease Encyclopedia – 30+ Crops & 130+ Conditions",
  description:
    "Explore AgroLeaf AI's complete crop disease dataset: 30+ crops, 134 classes, and 56,000+ training images. Symptoms, treatments, and pathogen info for each disease.",
  openGraph: {
    title: "Crop Disease Encyclopedia – AgroLeaf AI",
    description:
      "Browse all crops and diseases supported by our CNN model. Includes apple, tomato, rice, maize, and many more.",
    url: "https://agroleaf-ai.vercel.app/info/crops",
    siteName: "AgroLeaf AI",
    images: [
      {
        url: "/og-crop.png",
        width: 1200,
        height: 630,
        alt: "AgroLeaf AI Crop Disease Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crop Disease Encyclopedia – AgroLeaf AI",
    description:
      "Full dataset of crops and diseases used to train AgroLeaf AI. 56,000+ images, 134 classes.",
    images: ["/og-crop.png"],
  },
  alternates: {
    canonical: "https://agroleaf-ai.vercel.app/info/crops",
  },
};

const Page = () => {
  return <CropsPage />;
};

export default Page;