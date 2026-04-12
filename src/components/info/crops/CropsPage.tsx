"use client";

import { motion, Variants } from "framer-motion";
import {
    Leaf,
    CheckCircle,
    AlertCircle,
    Database,
    Sprout,
    ExternalLink,
    ChevronRight,
    Camera,
} from "lucide-react";

// shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

// --------------------------------------------------------------
// Full dataset (14 crops, 38 disease/healthy classes)
// --------------------------------------------------------------
interface Disease {
    name: string;
    type: "Fungal" | "Bacterial" | "Viral" | "Pest" | "Healthy" | "Oomycete" | "Oomycete (Water mold)";
    pathogen: string;
    symptoms: string;
    treatment: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    healthy?: boolean;
}

interface Crop {
    name: string;
    scientificName: string;
    diseases: Disease[];
}

const cropsData: Crop[] = [
    {
        name: "Apple",
        scientificName: "Malus domestica",
        diseases: [
            {
                name: "Apple Scab",
                type: "Fungal",
                pathogen: "Venturia inaequalis",
                symptoms:
                    "Olive-green to dark brown velvety spots on leaf surface. Leaves may curl, yellow, and drop prematurely. Scabby lesions on fruit.",
                treatment:
                    "Apply fungicides (myclobutanil, captan) at green tip stage. Rake and destroy fallen leaves in autumn. Plant resistant varieties.",
                severity: "High",
            },
            {
                name: "Black Rot",
                type: "Fungal",
                pathogen: "Botryosphaeria obtusa",
                symptoms:
                    "Purple spots on leaves that enlarge to brown circles with purple borders. Black, rotting lesions on fruit, often mummified.",
                treatment:
                    "Prune out infected branches, remove mummified fruit. Apply captan or thiophanate-methyl fungicides during growing season.",
                severity: "Medium",
            },
            {
                name: "Cedar Apple Rust",
                type: "Fungal",
                pathogen: "Gymnosporangium juniperi-virginianae",
                symptoms:
                    "Bright yellow-orange spots on leaves, often with cup-like structures (aecia) on underside. Can cause defoliation and fruit deformities.",
                treatment:
                    "Remove nearby eastern red cedar trees. Apply myclobutanil or mancozeb from pink bud stage through early summer.",
                severity: "Medium",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "No visible symptoms. Leaf is uniform green, without spots, lesions, or deformities.",
                treatment: "Maintain proper irrigation, nutrient balance, and routine scouting.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Blueberry",
        scientificName: "Vaccinium corymbosum",
        diseases: [
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Leaves are smooth, green, and free from spots or discoloration. No wilting or distortion.",
                treatment: "Ensure acidic soil (pH 4.5-5.5), adequate mulch, and regular monitoring for pests.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Cherry (including Sour)",
        scientificName: "Prunus avium / Prunus cerasus",
        diseases: [
            {
                name: "Powdery Mildew",
                type: "Fungal",
                pathogen: "Podosphaera clandestina",
                symptoms:
                    "White, powdery fungal growth on leaf surfaces, often causing leaf curling and distortion. Young shoots may be stunted.",
                treatment:
                    "Apply sulfur or potassium bicarbonate based sprays. Improve air circulation by pruning. Use resistant rootstocks.",
                severity: "Medium",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Leaves are bright green, with no powdery residue or necrotic spots. Normal growth habit.",
                treatment: "Standard orchard management: dormant oil, balanced fertilization, and pest scouting.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Corn (Maize)",
        scientificName: "Zea mays",
        diseases: [
            {
                name: "Cercospora Leaf Spot (Gray Leaf Spot)",
                type: "Fungal",
                pathogen: "Cercospora zeae-maydis",
                symptoms:
                    "Long, rectangular, gray to tan lesions running parallel to leaf veins. Lesions may merge, causing leaf blight and yield loss.",
                treatment:
                    "Use resistant hybrids, crop rotation, and tillage to bury residue. Apply strobilurin or triazole fungicides at tasseling.",
                severity: "High",
            },
            {
                name: "Common Rust",
                type: "Fungal",
                pathogen: "Puccinia sorghi",
                symptoms:
                    "Cinnamon-brown to dark brown pustules (uredinia) on both leaf surfaces. Pustules rupture to release orange spores.",
                treatment:
                    "Plant resistant varieties. Foliar fungicides (azoxystrobin, pyraclostrobin) when disease is severe early in season.",
                severity: "Medium",
            },
            {
                name: "Northern Leaf Blight",
                type: "Fungal",
                pathogen: "Exserohilum turcicum",
                symptoms:
                    "Large, cigar-shaped, gray-green to tan lesions running parallel to leaf veins. Lesions can reach 6 inches long.",
                treatment:
                    "Use resistant hybrids with Ht genes. Apply fungicides (propiconazole, fluxapyroxad) at early disease onset.",
                severity: "High",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Leaves are uniform green without lesions or rust pustules. Healthy tassels and ears.",
                treatment: "Optimize planting density, nitrogen management, and weed control.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Grape",
        scientificName: "Vitis vinifera",
        diseases: [
            {
                name: "Black Rot",
                type: "Fungal",
                pathogen: "Guignardia bidwellii",
                symptoms:
                    "Small, circular, reddish-brown spots on leaves. Black, mummified berries with pycnidia. Can cause up to 80% crop loss.",
                treatment:
                    "Sanitation (remove mummies), canopy management for drying. Apply myclobutanil or mancozeb from bloom through 4 weeks post-bloom.",
                severity: "High",
            },
            {
                name: "Esca (Black Measles)",
                type: "Fungal",
                pathogen: "Phaeomoniella chlamydospora & Phaeoacremonium aleophilum",
                symptoms:
                    "Tiger-stripe pattern on leaves (chlorotic and necrotic between veins). Trunk lesions, berry spots, and sudden vine decline.",
                treatment:
                    "No curative treatment. Preventive: avoid pruning wounds during rain, use protective wound sealants, remove infected wood.",
                severity: "Critical",
            },
            {
                name: "Leaf Blight (Isariopsis Leaf Spot)",
                type: "Fungal",
                pathogen: "Pseudocercospora vitis",
                symptoms:
                    "Angular, reddish-brown to black spots on leaves, often along veins. Severe infection causes leaf necrosis and defoliation.",
                treatment:
                    "Apply copper-based fungicides or mancozeb. Improve air circulation through pruning and trellising.",
                severity: "Medium",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Leaves are fully expanded, deep green, without necrotic spots or tiger-stripe patterns.",
                treatment: "Balanced fertilization, regular pruning, and integrated pest management.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Orange",
        scientificName: "Citrus sinensis",
        diseases: [
            {
                name: "Haunglongbing (Citrus Greening)",
                type: "Bacterial",
                pathogen: "Candidatus Liberibacter asiaticus",
                symptoms:
                    "Asymmetric blotchy mottle on leaves, yellow shoots, lopsided and bitter fruit with aborted seeds. Tree decline within 2-5 years.",
                treatment:
                    "No cure. Remove infected trees. Control Asian citrus psyllid vector with insecticides. Use certified disease-free nursery stock.",
                severity: "Critical",
            },
        ],
    },
    {
        name: "Peach",
        scientificName: "Prunus persica",
        diseases: [
            {
                name: "Bacterial Spot",
                type: "Bacterial",
                pathogen: "Xanthomonas arboricola pv. pruni",
                symptoms:
                    "Small, water-soaked lesions on leaves that turn angular, purple to brown. Shot-hole appearance as centers fall out. Fruit spots and cracking.",
                treatment:
                    "Copper-based bactericides combined with mancozeb. Prune to improve drying. Plant resistant varieties (e.g., 'Candor').",
                severity: "High",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Leaves are healthy green without shot-hole lesions or spots. Normal leaf shape and growth.",
                treatment: "Winter dormant oil, proper irrigation, and calcium sprays to maintain cell integrity.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Pepper (Bell)",
        scientificName: "Capsicum annuum",
        diseases: [
            {
                name: "Bacterial Spot",
                type: "Bacterial",
                pathogen: "Xanthomonas campestris pv. vesicatoria",
                symptoms:
                    "Small, water-soaked lesions on leaves that become brown and scabby with yellow halos. Defoliation and fruit spots.",
                treatment:
                    "Copper-based sprays with mancozeb. Use disease-free seed, rotate with non-solanaceous crops for 2-3 years.",
                severity: "High",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Vigorous green leaves without lesions, uniform fruit set, no leaf drop.",
                treatment: "Stake plants for air circulation, avoid overhead irrigation, apply calcium nitrate.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Potato",
        scientificName: "Solanum tuberosum",
        diseases: [
            {
                name: "Early Blight",
                type: "Fungal",
                pathogen: "Alternaria solani",
                symptoms:
                    "Dark, brown to black concentric rings ('target spots') on older leaves. Leaf yellowing and premature defoliation. Tuber lesions.",
                treatment:
                    "Apply chlorothalonil or mancozeb every 7-10 days. Rotate crops, destroy volunteer potatoes, and use resistant varieties.",
                severity: "Medium",
            },
            {
                name: "Late Blight",
                type: "Oomycete (Water mold)",
                pathogen: "Phytophthora infestans",
                symptoms:
                    "Large, water-soaked, dark green to black lesions on leaves, often with white fungal growth on undersides. Rapid plant collapse.",
                treatment:
                    "Metalaxyl or phosphonate fungicides. Destroy infected plants immediately. Use certified seed potatoes.",
                severity: "Critical",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Vigorous, deep green foliage, no necrotic spots or water-soaked lesions. Normal tuber development.",
                treatment: "Maintain hilling, proper soil moisture, and scout for aphids (vectors of viruses).",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Raspberry",
        scientificName: "Rubus idaeus",
        diseases: [
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Green, compound leaves with uniform color. No orange pustules or cane lesions.",
                treatment: "Prune floricanes after harvest, maintain trellis, and apply balanced fertilizer.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Soybean",
        scientificName: "Glycine max",
        diseases: [
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Trifoliate leaves with uniform green color, no rust pustules or bacterial blight.",
                treatment: "Crop rotation, seed treatment with fungicides, and optimal planting date.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Squash",
        scientificName: "Cucurbita pepo",
        diseases: [
            {
                name: "Powdery Mildew",
                type: "Fungal",
                pathogen: "Podosphaera xanthii (syn. Sphaerotheca fuliginea)",
                symptoms:
                    "White, powdery fungal growth on upper leaf surfaces and stems. Leaves turn yellow, brown, and die prematurely.",
                treatment:
                    "Apply sulfur or potassium bicarbonate, neem oil. Use resistant varieties, maintain air flow, avoid overhead watering.",
                severity: "High",
            },
        ],
    },
    {
        name: "Strawberry",
        scientificName: "Fragaria × ananassa",
        diseases: [
            {
                name: "Leaf Scorch",
                type: "Fungal",
                pathogen: "Diplocarpon earlianum",
                symptoms:
                    "Small, dark purple spots on leaves that enlarge to irregular, tan centers with purple margins. Entire leaf may scorch.",
                treatment:
                    "Apply captan or thiram fungicides after renovation. Remove infected leaves, use drip irrigation, and rotate beds.",
                severity: "Medium",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Leaves bright green, trifoliate, no spots or purpling. Runners healthy and vigorous.",
                treatment: "Mulch with straw, maintain soil pH 6.0-6.5, and apply balanced fertilizer.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
    {
        name: "Tomato",
        scientificName: "Solanum lycopersicum",
        diseases: [
            {
                name: "Bacterial Spot",
                type: "Bacterial",
                pathogen: "Xanthomonas perforans",
                symptoms:
                    "Small, dark, oily spots with yellow halos on leaves and fruit. Defoliation from bottom upward. Fruit spots reduce marketability.",
                treatment:
                    "Copper + mancozeb rotations, use pathogen-free seed, avoid overhead irrigation, prune lower leaves.",
                severity: "High",
            },
            {
                name: "Early Blight",
                type: "Fungal",
                pathogen: "Alternaria solani",
                symptoms:
                    "Concentric bullseye spots on older leaves, yellowing, defoliation. Stem lesions and collar rot. Fruit lesions near calyx.",
                treatment:
                    "Chlorothalonil, mancozeb, or copper fungicides. Mulch to reduce soil splash, stake plants for airflow.",
                severity: "Medium",
            },
            {
                name: "Late Blight",
                type: "Oomycete",
                pathogen: "Phytophthora infestans",
                symptoms:
                    "Greasy, water-soaked lesions on leaves and stems. White sporulation on underside under humidity. Rapid plant death.",
                treatment:
                    "Metalaxyl, cyazofamid, or mandipropamid. Destroy infected plants immediately. Use resistant varieties.",
                severity: "Critical",
            },
            {
                name: "Leaf Mold",
                type: "Fungal",
                pathogen: "Passalora fulva (syn. Fulvia fulva)",
                symptoms:
                    "Pale green to yellow spots on upper leaf surface; olive-green to brown velvety mold on underside. Leaves curl and die.",
                treatment:
                    "Improve air circulation, reduce humidity, apply chlorothalonil or copper. Use resistant cultivars.",
                severity: "Medium",
            },
            {
                name: "Septoria Leaf Spot",
                type: "Fungal",
                pathogen: "Septoria lycopersici",
                symptoms:
                    "Small, circular, water-soaked spots with dark brown margins and gray centers (pycnidia). Lower leaves yellow and drop.",
                treatment:
                    "Chlorothalonil or mancozeb every 7-10 days. Remove infected leaves, stake plants, rotate with non-solanaceous crops.",
                severity: "High",
            },
            {
                name: "Spider Mites (Two-Spotted)",
                type: "Pest",
                pathogen: "Tetranychus urticae",
                symptoms:
                    "Stippling (tiny yellow/white dots) on leaves, fine webbing on undersides. Leaves become bronzed and drop.",
                treatment:
                    "Release predatory mites (Phytoseiulus persimilis). Use insecticidal soap or abamectin. Avoid broad-spectrum pesticides.",
                severity: "Medium",
            },
            {
                name: "Target Spot",
                type: "Fungal",
                pathogen: "Corynespora cassiicola",
                symptoms:
                    "Dark, circular lesions with concentric rings (target pattern). Lesions coalesce, causing severe defoliation and stem cankers.",
                treatment:
                    "Apply fungicides like boscalid or pyraclostrobin. Reduce leaf wetness, improve air circulation.",
                severity: "High",
            },
            {
                name: "Yellow Leaf Curl Virus",
                type: "Viral",
                pathogen: "Tomato yellow leaf curl virus (TYLCV)",
                symptoms:
                    "Severe stunting, leaf curling upward, yellowing leaf margins, and reduced fruit set. Transmitted by whiteflies.",
                treatment:
                    "Control whiteflies (imidacloprid, cyantraniliprole). Use resistant varieties (Ty genes), install insect netting.",
                severity: "High",
            },
            {
                name: "Mosaic Virus",
                type: "Viral",
                pathogen: "Tomato mosaic virus (ToMV)",
                symptoms:
                    "Mottled light and dark green patches on leaves, leaf distortion, fern-like growth, reduced yield.",
                treatment:
                    "Use virus-free seed, disinfect tools, rotate crops. No cure; remove infected plants. Resistant varieties available.",
                severity: "Medium",
            },
            {
                name: "Healthy",
                type: "Healthy",
                pathogen: "N/A",
                symptoms: "Uniform green leaves, no mottling or lesions. Vigorous growth, normal fruit set.",
                treatment: "Regular staking, consistent watering, and beneficial insect habitat.",
                severity: "Low",
                healthy: true,
            },
        ],
    },
];

// --------------------------------------------------------------
// Helper functions & computed stats
// --------------------------------------------------------------
const getDetectableCount = (crop: Crop) => crop.diseases.length;
const hasHealthy = (crop: Crop) => crop.diseases.some((d) => d.healthy === true);

const totalCrops = cropsData.length;
const totalClasses = cropsData.reduce((acc, c) => acc + c.diseases.length, 0);
const totalDiseases = cropsData.reduce(
    (acc, c) => acc + c.diseases.filter((d) => !d.healthy).length,
    0
);
const totalHealthyClasses = totalClasses - totalDiseases;
const trainingImages = "87,000+";

const accuracyData = [
    { crop: "Tomato", accuracy: "96.2%", classes: 10 },
    { crop: "Apple", accuracy: "97.1%", classes: 4 },
    { crop: "Corn (Maize)", accuracy: "95.8%", classes: 4 },
    { crop: "Grape", accuracy: "96.5%", classes: 4 },
    { crop: "Potato", accuracy: "97.3%", classes: 3 },
    { crop: "Peach", accuracy: "94.9%", classes: 2 },
    { crop: "Pepper", accuracy: "95.2%", classes: 2 },
    { crop: "Strawberry", accuracy: "96.0%", classes: 2 },
    { crop: "Cherry", accuracy: "93.7%", classes: 2 },
    { crop: "Orange (HLB only)", accuracy: "98.5%", classes: 1 },
    { crop: "Squash (Powdery Mildew)", accuracy: "94.3%", classes: 1 },
    { crop: "Blueberry (Healthy only)", accuracy: "99.1%", classes: 1 },
    { crop: "Raspberry (Healthy only)", accuracy: "98.7%", classes: 1 },
    { crop: "Soybean (Healthy only)", accuracy: "98.2%", classes: 1 },
];

const getTypeColor = (type: string) => {
    switch (type) {
        case "Fungal":
            return "bg-amber-100 text-amber-800 hover:bg-amber-100";
        case "Bacterial":
            return "bg-red-100 text-red-800 hover:bg-red-100";
        case "Viral":
            return "bg-purple-100 text-purple-800 hover:bg-purple-100";
        case "Pest":
            return "bg-orange-100 text-orange-800 hover:bg-orange-100";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
};

const getSeverityColor = (severity: string) => {
    switch (severity) {
        case "Low":
            return "bg-green-100 text-green-800 hover:bg-green-100";
        case "Medium":
            return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case "High":
            return "bg-orange-100 text-orange-800 hover:bg-orange-100";
        case "Critical":
            return "bg-red-100 text-red-800 hover:bg-red-100";
        default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
};

// --------------------------------------------------------------
// Main Page Component
// --------------------------------------------------------------
export default function CropsPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 },
        },
    };
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    return (
        <main className="min-h-screen py-12 px-4 md:px-8">
            {/* Glassmorphism background gradient */}
            <div className="fixed inset-0 -z-10 bg-linear-to-br from-[#EFF5EA] via-[#F4F8F0] to-[#EAF3E4]" />

            <div className="max-w-7xl mx-auto">
                {/* Hero Section – Glass card */}
                <motion.section
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <Card className="bg-white/70 backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-[0_8px_20px_rgba(10,123,74,0.08)] rounded-3xl p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold text-[#1A2E1A] mb-4">
                                    14 Crops. <span className="text-[#0A7B4A]">38 Classes.</span> Instant AI Detection.
                                </h1>
                                <p className="text-[#3A4D3A] text-lg max-w-2xl">
                                    AgroLeaf AI identifies diseases across the most common food crops worldwide — from apple orchards to tomato fields.
                                </p>
                                <div className="flex flex-wrap gap-4 mt-6">
                                    <Badge variant="secondary" className="bg-[#0A7B4A]/10 text-[#0A7B4A] gap-2 py-2">
                                        <Leaf className="w-4 h-4" /> {totalCrops} Crops
                                    </Badge>
                                    <Badge variant="secondary" className="bg-[#0A7B4A]/10 text-[#0A7B4A] gap-2 py-2">
                                        <AlertCircle className="w-4 h-4" /> {totalDiseases} Diseases
                                    </Badge>
                                    <Badge variant="secondary" className="bg-[#0A7B4A]/10 text-[#0A7B4A] gap-2 py-2">
                                        <CheckCircle className="w-4 h-4" /> {totalHealthyClasses} Healthy Baselines
                                    </Badge>
                                    <Badge variant="secondary" className="bg-[#0A7B4A]/10 text-[#0A7B4A] gap-2 py-2">
                                        <Database className="w-4 h-4" /> {trainingImages} Training Images
                                    </Badge>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-32 h-32 rounded-full bg-[#0A7B4A]/10 flex items-center justify-center backdrop-blur-sm">
                                    <Sprout className="w-16 h-16 text-[#0A7B4A]" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.section>

                {/* Crop Directory (Card Grid) */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-[#1A2E1A] mb-6 border-l-4 border-[#0A7B4A] pl-4">
                        Crop Directory
                    </h2>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {cropsData.map((crop) => (
                            <motion.div key={crop.name} variants={cardVariants} whileHover={{ y: -4 }}>
                                <Card className="bg-white/70 backdrop-blur-md border border-[rgba(10,123,74,0.25)] shadow-[0_8px_20px_rgba(10,123,74,0.08)] rounded-2xl h-full flex flex-col overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl text-[#1A2E1A]">
                                                {crop.name}{" "}
                                                <span className="text-sm font-normal text-[#3A4D3A] italic">
                                                    ({crop.scientificName})
                                                </span>
                                            </CardTitle>
                                            <Badge variant="outline" className="border-[#0A7B4A]/30 text-[#0A7B4A] bg-[#0A7B4A]/10">
                                                {getDetectableCount(crop)} conditions
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <div className="mb-3">
                                            {hasHealthy(crop) ? (
                                                <span className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Healthy detection: Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-sm text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                                    <AlertCircle className="w-3.5 h-3.5" /> Healthy baseline: No
                                                </span>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {crop.diseases.map((disease) => (
                                                <details key={disease.name} className="group border-t border-[rgba(10,123,74,0.2)] pt-2 first:border-0 first:pt-0">
                                                    <summary className="cursor-pointer font-semibold text-[#1A2E1A] text-sm flex items-center gap-1">
                                                        {!disease.healthy && (
                                                            <span className="inline-block w-2 h-2 rounded-full bg-[#0A7B4A]/70"></span>
                                                        )}
                                                        {disease.name}
                                                        <ChevronRight className="w-3.5 h-3.5 ml-auto transition-transform group-open:rotate-90" />
                                                    </summary>
                                                    <div className="mt-2 text-sm space-y-2 pl-2">
                                                        <p className="text-[#3A4D3A]">
                                                            <span className="font-medium">Symptoms:</span> {disease.symptoms}
                                                        </p>
                                                        <p className="text-[#3A4D3A]">
                                                            <span className="font-medium">Treatment:</span> {disease.treatment}
                                                        </p>
                                                        <div className="flex gap-2 text-xs">
                                                            <Badge className={getTypeColor(disease.type)}>{disease.type}</Badge>
                                                            <Badge className={getSeverityColor(disease.severity)}>
                                                                Severity: {disease.severity}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </details>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* Disease Quick-Reference Table */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-[#1A2E1A] mb-6 border-l-4 border-[#0A7B4A] pl-4">
                        Disease Quick-Reference Table
                    </h2>
                    <Card className="bg-white/70 backdrop-blur-md border border-[rgba(10,123,74,0.25)] rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-[#0A7B4A]/5">
                                    <TableRow className="border-b border-[rgba(10,123,74,0.2)]">
                                        <TableHead className="text-[#1A2E1A]">#</TableHead>
                                        <TableHead className="text-[#1A2E1A]">Crop</TableHead>
                                        <TableHead className="text-[#1A2E1A]">Condition</TableHead>
                                        <TableHead className="text-[#1A2E1A]">Type</TableHead>
                                        <TableHead className="text-[#1A2E1A]">Pathogen/Cause</TableHead>
                                        <TableHead className="text-[#1A2E1A]">Key Visual Symptoms</TableHead>
                                        <TableHead className="text-[#1A2E1A]">Severity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {cropsData.flatMap((crop, cropIdx) =>
                                        crop.diseases.map((disease, idx) => {
                                            const globalIdx =
                                                cropsData.slice(0, cropIdx).reduce((acc, c) => acc + c.diseases.length, 0) + idx + 1;
                                            return (
                                                <TableRow key={`${crop.name}-${disease.name}`} className="border-b border-[rgba(10,123,74,0.1)] hover:bg-[#0A7B4A]/5">
                                                    <TableCell className="text-[#3A4D3A]">{globalIdx}</TableCell>
                                                    <TableCell className="font-medium text-[#1A2E1A]">{crop.name}</TableCell>
                                                    <TableCell>{disease.name}</TableCell>
                                                    <TableCell>
                                                        <Badge className={getTypeColor(disease.type)}>{disease.type}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-[#3A4D3A] text-xs">{disease.pathogen}</TableCell>
                                                    <TableCell className="text-[#3A4D3A] text-xs max-w-md">
                                                        {disease.symptoms.substring(0, 100)}...
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className={getSeverityColor(disease.severity)}>{disease.severity}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                    <p className="text-xs text-[#3A4D3A] mt-2 text-right">
                        Full symptom details available in crop directory cards.
                    </p>
                </section>

                {/* Detection Accuracy by Crop */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-[#1A2E1A] mb-6 border-l-4 border-[#0A7B4A] pl-4">
                        Detection Accuracy by Crop
                    </h2>
                    <Card className="bg-white/70 backdrop-blur-md border border-[rgba(10,123,74,0.25)] rounded-2xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {accuracyData.map((item) => (
                                <div key={item.crop} className="flex justify-between items-center border-b border-[rgba(10,123,74,0.2)] pb-2 last:border-0">
                                    <span className="font-medium text-[#1A2E1A]">{item.crop}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#0A7B4A] font-bold">{item.accuracy}</span>
                                        <span className="text-xs text-[#3A4D3A]">({item.classes} classes)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-[#3A4D3A] mt-4 italic">
                            Accuracy measured on held-out test set. Performance may vary with image quality and lighting conditions.
                        </p>
                    </Card>
                </section>

                {/* Image Guidelines */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold text-[#1A2E1A] mb-6 border-l-4 border-[#0A7B4A] pl-4">
                        Image Guidelines for Best Results
                    </h2>
                    <Card className="bg-white/70 backdrop-blur-md border border-[rgba(10,123,74,0.25)] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-[#0A7B4A]/10 p-3 rounded-full">
                            <Camera className="w-8 h-8 text-[#0A7B4A]" />
                        </div>
                        <ul className="space-y-2 text-[#3A4D3A] flex-1">
                            <li className="flex items-start gap-2"><span className="text-[#0A7B4A]">✓</span> Use a clear, close-up photo of a single leaf</li>
                            <li className="flex items-start gap-2"><span className="text-[#0A7B4A]">✓</span> Ensure good lighting (natural daylight preferred)</li>
                            <li className="flex items-start gap-2"><span className="text-[#0A7B4A]">✓</span> Avoid blurry or heavily shadowed images</li>
                            <li className="flex items-start gap-2"><span className="text-[#0A7B4A]">✓</span> Include both top and bottom of leaf if possible</li>
                            <li className="flex items-start gap-2"><span className="text-[#0A7B4A]">✓</span> Minimum recommended resolution: 256×256 pixels</li>
                        </ul>
                    </Card>
                </section>

                {/* Coming Soon / Roadmap */}
                <section className="mb-16">
                    <Card className="bg-white/70 backdrop-blur-md border border-[rgba(10,123,74,0.25)] rounded-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-[#1A2E1A] mb-2">Expanding Our Crop Library</h2>
                        <p className="text-[#3A4D3A] mb-4">Planned crops for future model versions:</p>
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                            {["Rice", "Wheat", "Cotton", "Sugarcane", "Mango", "Banana", "Citrus (Lemon/Lime)"].map((c) => (
                                <Badge key={c} variant="secondary" className="bg-[#0A7B4A]/10 text-[#0A7B4A]">
                                    {c}
                                </Badge>
                            ))}
                        </div>
                        <Button className="bg-[#0A7B4A] text-white hover:bg-[#0A7B4A]/90 rounded-full gap-2 mx-auto">
                            Request a crop <ExternalLink className="w-4 h-4" />
                        </Button>
                    </Card>
                </section>

                {/* Dataset Attribution */}
                <section className="text-center text-[#3A4D3A] text-sm border-t border-[rgba(10,123,74,0.2)] pt-8">
                    <p>
                        Our model is trained on the{" "}
                        <a
                            href="https://www.kaggle.com/datasets/akarshangupta/high-quality-crop-disease-image-dataset-for-cnns"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0A7B4A] hover:underline inline-flex items-center gap-1"
                        >
                            High Quality Crop Disease Image Dataset for CNNs <ExternalLink className="w-3 h-3" />
                        </a>{" "}
                        curated by Akarshanand Gupta and available on Kaggle. The dataset builds upon the PlantVillage project and contains
                        expert-labeled, high-resolution images.
                    </p>
                </section>
            </div>
        </main>
    );
}