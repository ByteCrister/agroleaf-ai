import { Metadata } from "next";
import { ApiDocsClient } from "@/components/info/api-docs-client/ApiDocsClient";

export const metadata: Metadata = {
  title: "API Reference – AgroLeaf AI Diagnosis Endpoint",
  description:
    "Complete documentation for AgroLeaf AI's crop disease diagnosis API. POST /api/v1/diagnose – upload leaf images, get ViT-based predictions + Gemini AI treatment advice.",
  openGraph: {
    title: "AgroLeaf AI API Docs – Diagnose Crop Diseases Programmatically",
    description:
      "REST API for crop disease detection. Supports 30 crops, 134 disease classes. Returns confidence scores and AI-generated agronomic feedback.",
    url: "https://agroleaf-ai.vercel.app/api-docs-client",
    type: "website",
    images: [
      {
        url: "/og-api-doc.png", 
        width: 1200,
        height: 630,
        alt: "AgroLeaf AI API documentation preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgroLeaf AI API – Crop Disease Detection",
    description: "ViT + Gemini: programmatic leaf disease diagnosis and treatment suggestions.",
    images: ["/og-api-doc.png"],
  },
  keywords: [
    "AgroLeaf API",
    "crop disease detection API",
    "plant disease REST API",
    "ViT inference",
    "Gemini agronomic advice",
  ],
  alternates: {
    canonical: "https://agroleaf-ai.vercel.app/api-docs-client",
  },
};

const Page = () => {
  return <ApiDocsClient />;
};

export default Page;