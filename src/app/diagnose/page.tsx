// app/diagnose/page.tsx
import { Metadata } from "next";
import DiagnosePage from "@/components/diagnose/DiagnosePage";

export const metadata: Metadata = {
    title: "AI Crop Disease Diagnosis – Upload Leaf Photo | AgroLeaf AI",
    description:
        "Upload a crop leaf image – our CNN model (trained on 38 disease classes across 7 crops) instantly detects the disease, and OpenAI provides organic & chemical treatment plans. Free for farmers.",
    keywords: [
        "crop disease diagnosis",
        "plant disease identifier",
        "AI agriculture",
        "leaf disease detection",
        "FastAPI diagnosis",
        "OpenAI treatment suggestions",
        "rice disease",
        "tomato blight",
        "apple scab",
        "wheat rust",
        "corn leaf disease",
        "potato early blight",
        "grape black rot",
    ],
    openGraph: {
        title: "AgroLeaf AI – Instant Crop Disease Diagnosis & Treatment",
        description:
            "Upload a leaf photo, get disease ID + AI‑powered agronomic advice. Supports 7 crops, 38 disease classes. Under 2 seconds.",
        url: "https://agroleaf-ai.vercel.app/diagnose",
        siteName: "AgroLeaf AI",
        images: [
            {
                url: "/og-diagnose.jpeg", // optional: specific OG image for diagnose page
                width: 1200,
                height: 630,
                alt: "AgroLeaf AI diagnosis tool – upload leaf image",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        site: "@AgroLeafAI",
        creator: "@SadiqulShakib",
        title: "Free AI Crop Disease Diagnosis | AgroLeaf AI",
        description:
            "Upload a leaf photo – CNN model detects disease, OpenAI suggests treatment. 98% accuracy, <2s response.",
        images: ["/twitter-diagnose.png"],
    },
    alternates: {
        canonical: "https://agroleaf-ai.vercel.app/diagnose",
    },
    robots: {
        index: true,
        follow: true,
    },
};

// Optional: JSON‑LD for the diagnosis tool as a WebApplication
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "AgroLeaf AI Crop Disease Diagnosis",
    description:
        "Upload a crop leaf image to get AI‑based disease identification and treatment recommendations.",
    url: "https://agroleaf-ai.vercel.app/diagnose",
    applicationCategory: "Agriculture",
    operatingSystem: "All",
    creator: {
        "@type": "Person",
        name: "Sadiqul Islam Shakib",
        url: "https://sadiqul-islam-shakib.vercel.app",
    },
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
    },
    featureList: [
        "Upload leaf image (JPG, PNG, BMP)",
        "CNN model – 38 disease classes, 7 crops",
        "Confidence score & top 3 predictions",
        "OpenAI‑generated treatment plans (organic & chemical)",
        "Sub‑2 second response time",
    ],
    citation: {
        "@type": "Dataset",
        name: "High Quality Crop Disease Image Dataset for CNNs",
        url: "https://www.kaggle.com/datasets/akarshangupta/high-quality-crop-disease-image-dataset-for-cnns",
    },
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <DiagnosePage />
        </>
    );
}