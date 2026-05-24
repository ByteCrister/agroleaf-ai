// src/data/home-data.ts
import {
    Leaf,
    Apple,
    Wheat,
    Grape,
    Camera,
    Sprout,
    Zap,
    FlaskConical,
    Microscope,
    ScanLine,
    BrainCircuit,
    Star,
} from "lucide-react";

// ──────────────────────────────────────────────────────────────────
// Build extended banner slides using Cloudinary images
// ──────────────────────────────────────────────────────────────────

import { ImageUrls } from "./image-urls";

export type BannerSlide = {
    id: number;
    headline: string;
    headlineAccent: string;
    sub: string;
    badge: string;
    cta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    bg: string;
    image: string;
    imageAlt: string;
    tag: string;
};

// Helper to extract crop/theme from URL filename
export function getSlideContent(
    url: string,
    index: number,
): Partial<BannerSlide> {
    const filename = url.split("/").pop()?.split(".")[0] || "";
    const lower = filename.toLowerCase();

    // Crop mapping
    if (lower.includes("rice")) {
        return {
            headline: "Protect Your",
            headlineAccent: "Rice Harvest",
            sub: "Detect blast, brown spot, sheath blight and more with our specialized rice disease model.",
            badge: "5 Rice Diseases",
            tag: "Rice · 6 Diseases",
            imageAlt: "Rice crop field",
        };
    }
    if (lower.includes("wheat")) {
        return {
            headline: "Secure Your",
            headlineAccent: "Wheat Fields",
            sub: "Identify stripe rust, septoria, and fusarium head blight in seconds.",
            badge: "5 Wheat Diseases",
            tag: "Wheat · 5 Diseases",
            imageAlt: "Wheat field",
        };
    }
    if (
        lower.includes("tomato") ||
        lower.includes("farmers") ||
        lower.includes("farming")
    ) {
        return {
            headline: "Empower Your",
            headlineAccent: "Farm with AI",
            sub: "From tomato to potato — get expert-level diagnosis for all your crops.",
            badge: "10+ Crops",
            tag: "Multi-Crop Support",
            imageAlt: "Farming scene",
        };
    }
    if (lower.includes("classification") || lower.includes("terms")) {
        return {
            headline: "Comprehensive",
            headlineAccent: "Disease Library",
            sub: "Over 38 disease classes covering every major crop and fruit.",
            badge: "38 Classes",
            tag: "Complete Database",
            imageAlt: "Crop classification",
        };
    }
    if (
        lower.includes("landscape") ||
        lower.includes("morning") ||
        lower.includes("scenic")
    ) {
        return {
            headline: "Beautiful Fields,",
            headlineAccent: "Healthy Crops",
            sub: "Early detection saves your harvest — try our AI scanner today.",
            badge: "Free Trial",
            tag: "Sustainable Farming",
            imageAlt: "Agricultural landscape",
        };
    }

    // Default fallback
    const themes = [
        {
            head: "Instant Diagnosis,",
            accent: "AI Precision",
            badge: "< 2s Response",
            tag: "Vision Transformer",
        },
        {
            head: "Seven Crops,",
            accent: "One Platform",
            badge: "7 Crops",
            tag: "Multi-Crop",
        },
        {
            head: "Detect Disease",
            accent: "Before It Spreads",
            badge: "98% Accuracy",
            tag: "Early Warning",
        },
    ];
    const theme = themes[index % themes.length];
    return {
        headline: theme.head,
        headlineAccent: theme.accent,
        badge: theme.badge,
        tag: theme.tag,
        imageAlt: "Crop field",
    };
}

// Gradient backgrounds to cycle through
export const GRADIENTS = [
    "from-[#0A7B4A] via-[#2C5F2D] to-[#0d3b1a]",
    "from-[#2C5F2D] via-[#0D9488] to-[#0a3d2a]",
    "from-[#1a4d1b] via-[#0A7B4A] to-[#10B981]/80",
    "from-[#0A7B4A] via-[#0D9488] to-[#064e3b]",
    "from-[#2C5F2D] via-[#0A7B4A] to-[#1a4d1b]",
    "from-[#0D9488] via-[#0A7B4A] to-[#2C5F2D]",
];

export const BANNER_SLIDES: BannerSlide[] = ImageUrls.map(
    (url, idx) => {
        const content = getSlideContent(url, idx);
        return {
            id: idx + 1,
            headline: content.headline ?? "AI-Powered",
            headlineAccent: content.headlineAccent ?? "Crop Health",
            sub:
                content.sub ??
                "Upload a leaf photo and our Vision Transformer AI pinpoints disease, severity, and treatment — in under 2 seconds.",
            badge: content.badge ?? "98% Model Accuracy",
            cta: { label: "Start Free Diagnosis", href: "/diagnose" },
            secondaryCta: { label: "Watch Demo", href: "#demo" },
            bg: GRADIENTS[idx % GRADIENTS.length],
            image: url,
            imageAlt: content.imageAlt ?? "Crop field",
            tag: content.tag ?? "Rice · 6 Diseases",
        };
    },
);

// ──────────────────────────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────────────────────────

export const CROPS_FRUITS = [
    {
        name: "Rice",
        scientific: "Oryza sativa",
        image: ImageUrls[3],
        diseasesCount: 6,
        description:
            "Blast, brown spot, sheath blight, tungro, bacterial leaf streak",
    },
    {
        name: "Apple",
        scientific: "Malus domestica",
        image: ImageUrls[1],
        diseasesCount: 4,
        description: "Scab, black rot, cedar rust, powdery mildew",
    },
    {
        name: "Tomato",
        scientific: "Solanum lycopersicum",
        image: ImageUrls[6],
        diseasesCount: 10,
        description: "Early blight, late blight, leaf mold, septoria, etc.",
    },
    {
        name: "Grape",
        scientific: "Vitis vinifera",
        image: ImageUrls[7],
        diseasesCount: 4,
        description: "Black rot, leaf blight, powdery mildew, downy mildew",
    },
    {
        name: "Wheat",
        scientific: "Triticum aestivum",
        image: ImageUrls[4],
        diseasesCount: 5,
        description: "Septoria, stripe rust, leaf rust, stem rust, powdery mildew",
    },
    {
        name: "Corn (Maize)",
        scientific: "Zea mays",
        image: ImageUrls[10],
        diseasesCount: 4,
        description: "Cercospora, common rust, northern leaf blight, smut",
    },
    {
        name: "Potato",
        scientific: "Solanum tuberosum",
        image: ImageUrls[11],
        diseasesCount: 3,
        description: "Early blight, late blight, healthy",
    },
];

export const DISEASE_TREE = [
    {
        crop: "Apple",
        icon: Apple,
        accentLight: "bg-rose-500",
        accentDark: "from-rose-500 to-red-500",
        tagColor:
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/40",
        diseases: [
            {
                name: "Apple Scab",
                severity: "High",
                treatment: "Fungicide + pruning",
                symptoms: "Olive-green spots on leaves and fruit",
                prevention: "Plant resistant varieties, remove fallen leaves",
            },
            {
                name: "Black Rot",
                severity: "Medium",
                treatment: "Remove infected branches",
                symptoms: "Purple spots on leaves, fruit rot",
                prevention: "Prune for air circulation, sanitize tools",
            },
            {
                name: "Cedar Rust",
                severity: "Medium",
                treatment: "Fungicide spray",
                symptoms: "Bright orange spots on leaves",
                prevention: "Remove nearby cedar trees",
            },
            {
                name: "Powdery Mildew",
                severity: "Low",
                treatment: "Sulfur spray",
                symptoms: "White powdery coating on leaves",
                prevention: "Avoid overhead watering",
            },
        ],
    },
    {
        crop: "Tomato",
        icon: Leaf,
        accentLight: "bg-[#0A7B4A]",
        accentDark: "from-[#0A7B4A] to-[#2C5F2D]",
        tagColor:
            "bg-[rgba(10,123,74,0.08)] text-[#0A7B4A] border-[rgba(10,123,74,0.2)] dark:bg-[rgba(10,123,74,0.2)] dark:text-[#4ade80] dark:border-[rgba(10,123,74,0.3)]",
        diseases: [
            {
                name: "Early Blight",
                severity: "High",
                treatment: "Copper fungicide",
                symptoms: "Dark concentric rings on lower leaves",
                prevention: "Mulch, crop rotation",
            },
            {
                name: "Late Blight",
                severity: "Critical",
                treatment: "Remove & destroy plants",
                symptoms: "Water-soaked lesions with white fuzz",
                prevention: "Use resistant varieties",
            },
            {
                name: "Leaf Mold",
                severity: "Low",
                treatment: "Improve air circulation",
                symptoms: "Pale green or yellow spots on leaves",
                prevention: "Space plants properly",
            },
            {
                name: "Septoria Leaf Spot",
                severity: "Medium",
                treatment: "Neem oil",
                symptoms: "Small circular spots with dark borders",
                prevention: "Water at base, remove infected leaves",
            },
            {
                name: "Tomato Mosaic Virus",
                severity: "High",
                treatment: "No cure, remove plants",
                symptoms: "Mottled green/yellow leaves, stunted growth",
                prevention: "Clean tools, use virus-free seeds",
            },
        ],
    },
    {
        crop: "Grape",
        icon: Grape,
        accentLight: "bg-violet-600",
        accentDark: "from-violet-600 to-indigo-500",
        tagColor:
            "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/40",
        diseases: [
            {
                name: "Black Rot",
                severity: "High",
                treatment: "Fungicide + sanitation",
                symptoms: "Brown spots on leaves, mummified berries",
                prevention: "Prune for air flow, remove mummies",
            },
            {
                name: "Powdery Mildew",
                severity: "Medium",
                treatment: "Sulfur spray",
                symptoms: "White powdery growth on all green parts",
                prevention: "Avoid dense foliage",
            },
            {
                name: "Downy Mildew",
                severity: "High",
                treatment: "Copper-based fungicide",
                symptoms: "Yellow oil spots on leaves, white mold underside",
                prevention: "Improve air circulation",
            },
            {
                name: "Anthracnose",
                severity: "Medium",
                treatment: "Fungicide",
                symptoms: "Dark sunken lesions on berries",
                prevention: "Remove infected canes",
            },
        ],
    },
    {
        crop: "Wheat",
        icon: Wheat,
        accentLight: "bg-amber-500",
        accentDark: "from-amber-500 to-yellow-500",
        tagColor:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/40",
        diseases: [
            {
                name: "Stripe Rust",
                severity: "High",
                treatment: "Resistant varieties",
                symptoms: "Yellow-orange stripes on leaves",
                prevention: "Plant resistant cultivars",
            },
            {
                name: "Septoria",
                severity: "Medium",
                treatment: "Fungicide at flag leaf",
                symptoms: "Brown spots with dark centers",
                prevention: "Crop rotation, residue management",
            },
            {
                name: "Powdery Mildew",
                severity: "Low",
                treatment: "Sulfur application",
                symptoms: "White powdery patches",
                prevention: "Avoid excess nitrogen",
            },
            {
                name: "Leaf Rust",
                severity: "High",
                treatment: "Fungicide",
                symptoms: "Orange-brown pustules on leaves",
                prevention: "Early planting, resistant varieties",
            },
            {
                name: "Fusarium Head Blight",
                severity: "Critical",
                treatment: "No effective cure",
                symptoms: "Bleached spikelets, pink mold",
                prevention: "Rotate crops, use clean seed",
            },
        ],
    },
    {
        crop: "Rice",
        icon: Sprout,
        accentLight: "bg-teal-500",
        accentDark: "from-teal-500 to-[#0D9488]",
        tagColor:
            "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800/40",
        diseases: [
            {
                name: "Rice Blast",
                severity: "High",
                treatment: "Fungicide + resistant varieties",
                symptoms: "Diamond-shaped lesions with grey centers",
                prevention: "Balance nitrogen application",
            },
            {
                name: "Brown Spot",
                severity: "Medium",
                treatment: "Seed treatment",
                symptoms: "Small brown circular spots",
                prevention: "Use certified seeds",
            },
            {
                name: "Sheath Blight",
                severity: "High",
                treatment: "Fungicide",
                symptoms: "Greenish-grey lesions on leaf sheaths",
                prevention: "Avoid dense planting",
            },
            {
                name: "Bacterial Leaf Streak",
                severity: "Medium",
                treatment: "Copper compounds",
                symptoms: "Yellowish streaks between veins",
                prevention: "Drain fields periodically",
            },
            {
                name: "Tungro Virus",
                severity: "High",
                treatment: "Vector control",
                symptoms: "Yellow-orange discoloration, stunting",
                prevention: "Control leafhoppers",
            },
        ],
    },
    {
        crop: "Corn (Maize)",
        icon: Leaf,
        accentLight: "bg-yellow-500",
        accentDark: "from-yellow-500 to-amber-500",
        tagColor:
            "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800/40",
        diseases: [
            {
                name: "Common Rust",
                severity: "Medium",
                treatment: "Fungicide",
                symptoms: "Brick-red pustules on leaves",
                prevention: "Plant resistant hybrids",
            },
            {
                name: "Northern Leaf Blight",
                severity: "High",
                treatment: "Fungicide",
                symptoms: "Long cigar-shaped gray-green lesions",
                prevention: "Crop rotation, tillage",
            },
            {
                name: "Southern Corn Rust",
                severity: "High",
                treatment: "Fungicide",
                symptoms: "Small circular orange pustules",
                prevention: "Early planting",
            },
            {
                name: "Gray Leaf Spot",
                severity: "Medium",
                treatment: "Fungicide",
                symptoms: "Rectangular gray lesions",
                prevention: "Residue management",
            },
            {
                name: "Maize Dwarf Mosaic",
                severity: "Medium",
                treatment: "No cure",
                symptoms: "Mosaic pattern on leaves, stunting",
                prevention: "Control aphid vectors",
            },
        ],
    },
    {
        crop: "Potato",
        icon: Sprout,
        accentLight: "bg-stone-500",
        accentDark: "from-stone-500 to-stone-600",
        tagColor:
            "bg-stone-50 text-stone-700 border-stone-200 dark:bg-stone-900/40 dark:text-stone-300 dark:border-stone-700/40",
        diseases: [
            {
                name: "Early Blight",
                severity: "High",
                treatment: "Chlorothalonil",
                symptoms: "Dark concentric spots on older leaves",
                prevention: "Crop rotation, avoid overhead irrigation",
            },
            {
                name: "Late Blight",
                severity: "Critical",
                treatment: "Destroy infected plants",
                symptoms: "Water-soaked lesions, white mold on undersides",
                prevention: "Use certified seed potatoes",
            },
            {
                name: "Potato Virus Y",
                severity: "High",
                treatment: "No cure",
                symptoms: "Mosaic, leaf drop, stunting",
                prevention: "Control aphids, use resistant varieties",
            },
            {
                name: "Blackleg",
                severity: "Medium",
                treatment: "Destroy infected plants",
                symptoms: "Black rotting stems, wilting",
                prevention: "Use disease-free seed",
            },
        ],
    },
];

export const HOW_IT_WORKS = [
    {
        step: "01",
        icon: Camera,
        title: "Upload a Photo",
        desc: "Take a clear photo of the affected leaf, fruit, or stem and upload it to our platform.",
    },
    {
        step: "02",
        icon: ScanLine,
        title: "AI Scans the Image",
        desc: "Our Vision Transformer model analyzes 50+ visual markers across 38 disease classes.",
    },
    {
        step: "03",
        icon: BrainCircuit,
        title: "Disease Identified",
        desc: "Get an instant diagnosis with confidence score, severity level, and full breakdown.",
    },
    {
        step: "04",
        icon: FlaskConical,
        title: "Treatment Plan",
        desc: "Receive organic and chemical treatment options, prevention tips, and follow-up advice.",
    },
];

export const STATS = [
    { numericValue: 38, suffix: "+", label: "Disease Classes", icon: Microscope },
    { numericValue: 7, suffix: "", label: "Crops Supported", icon: Sprout },
    { numericValue: 98, suffix: "%", label: "Model Accuracy", icon: Star },
    {
        numericValue: 2,
        prefix: "< ",
        suffix: "s",
        label: "Diagnosis Time",
        icon: Zap,
    },
];
