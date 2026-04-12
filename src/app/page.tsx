// app/page.tsx
import { Metadata } from "next";
import HomePage from "@/components/home/HomePage";

export const metadata: Metadata = {
  title: "AgroLeaf AI – AI-Powered Crop Disease Detection & Treatment",
  description:
    "Upload a crop leaf photo – our CNN model (trained on 38 disease classes) detects the disease and OpenAI provides organic & chemical treatment plans. Free for farmers.",
  openGraph: {
    title: "AgroLeaf AI – Diagnose Crop Diseases with AI in Seconds",
    description:
      "Instant crop disease identification + actionable treatment suggestions from OpenAI. Supports rice, tomato, wheat, apple, grape, corn & potato.",
    url: "https://agroleaf-ai.vercel.app",
    images: [
      {
        url: "/og-image.png", // optional: specific home page OG image (1200x630)
        width: 1200,
        height: 630,
        alt: "AgroLeaf AI – Crop Disease Detection Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgroLeaf AI – Free AI Crop Disease Diagnosis",
    description:
      "Upload a leaf photo, get disease ID + treatment suggestions. 98% accuracy, <2s response.",
    images: ["/twitter-home.png"], // optional: specific Twitter card for home
  },
  alternates: {
    canonical: "https://agroleaf-ai.vercel.app",
  },
};

export default function Page() {
  return <HomePage />;
}