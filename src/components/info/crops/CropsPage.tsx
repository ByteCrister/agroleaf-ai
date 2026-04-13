"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
    CheckCircle, AlertCircle, Database, Sprout,
    ExternalLink, ChevronRight, Camera, Search, X,
    TrendingUp, Shield, Zap, Leaf
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table";

// ─── Design Tokens (unchanged) ─────────────────────────────────────────────────
const T = {
    primary:    "#0A7B4A",
    secondary:  "#2C5F2D",
    textPrimary:"#1A2E1A",
    textSecond: "#3A4D3A",
    glass:      "rgba(255,255,255,0.72)",
    glassElev:  "rgba(255,255,255,0.88)",
    glassBg:    "rgba(245,250,240,0.6)",
    border:     "rgba(10,123,74,0.2)",
    borderMed:  "rgba(10,123,74,0.35)",
    shadow:     "0 8px 24px rgba(10,123,74,0.09)",
    shadowHov:  "0 14px 32px rgba(10,123,74,0.14)",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type DiseaseType = "Fungal" | "Bacterial" | "Viral" | "Pest" | "Healthy" | "Oomycete" | "Rotten" | "Nutrient";
type Severity    = "Low" | "Medium" | "High" | "Critical";

interface Disease {
    name: string;
    type: DiseaseType;
    pathogen: string;
    symptoms: string;
    treatment: string;
    severity: Severity;
    imageCount: number;
    healthy?: boolean;
}

interface Crop {
    name: string;
    scientificName: string;
    totalImages: number;
    diseases: Disease[];
}

// ─── Full Dataset (30 crops, 56,384 files, 134 classes) ───────────────────────
const cropsData: Crop[] = [
    {
        name: "Apple", scientificName: "Malus domestica", totalImages: 3166,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 1204, healthy: true, severity: "Low", symptoms: "Uniform green leaf, no spots.", treatment: "Proper irrigation, regular scouting." },
            { name: "Rotten", type: "Rotten", pathogen: "Post-harvest pathogens", imageCount: 614, severity: "High", symptoms: "Soft decay lesions on fruit.", treatment: "Storage control, post-harvest fungicides." },
            { name: "Black Rot", type: "Fungal", pathogen: "Botryosphaeria obtusa", imageCount: 489, severity: "Medium", symptoms: "Purple spots to brown circles.", treatment: "Prune, remove mummified fruit, captan." },
            { name: "Rust", type: "Fungal", pathogen: "Gymnosporangium spp.", imageCount: 357, severity: "Medium", symptoms: "Bright orange spots on leaves.", treatment: "Remove cedars, apply myclobutanil." },
            { name: "Scab", type: "Fungal", pathogen: "Venturia inaequalis", imageCount: 502, severity: "High", symptoms: "Dark velvety spots on leaves/fruit.", treatment: "Captan, myclobutanil at green tip." },
        ],
    },
    {
        name: "Banana", scientificName: "Musa acuminata", totalImages: 1226,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 601, healthy: true, severity: "Low", symptoms: "Smooth, vibrant green leaves.", treatment: "Proper drainage, remove dead leaves." },
            { name: "Rotten", type: "Rotten", pathogen: "Post-harvest pathogens", imageCount: 625, severity: "High", symptoms: "Blackened mushy tissue.", treatment: "Cool-chain management, ethylene control." },
        ],
    },
    {
        name: "Bellpepper", scientificName: "Capsicum annuum", totalImages: 960,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 478, healthy: true, severity: "Low", symptoms: "Vigorous green leaves.", treatment: "Stake plants, apply balanced NPK." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis / Phytophthora", imageCount: 482, severity: "High", symptoms: "Soft water-soaked fruit rot.", treatment: "Improve air circulation, harvest hygiene." },
        ],
    },
    {
        name: "Carrot", scientificName: "Daucus carota", totalImages: 934,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 484, healthy: true, severity: "Low", symptoms: "Bright green feathery tops.", treatment: "Loose soil, adequate phosphorus." },
            { name: "Rotten", type: "Rotten", pathogen: "Sclerotinia / Erwinia", imageCount: 450, severity: "High", symptoms: "Soft rot starting at crown.", treatment: "Crop rotation, avoid over-irrigation." },
        ],
    },
    {
        name: "Cassava", scientificName: "Manihot esculenta", totalImages: 2277,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 492, healthy: true, severity: "Low", symptoms: "Dark green, deeply lobed leaves.", treatment: "Certified cuttings, balanced nutrition." },
            { name: "Bacterial Blight", type: "Bacterial", pathogen: "Xanthomonas axonopodis", imageCount: 445, severity: "High", symptoms: "Angular spots, wilting, exudate.", treatment: "Resistant varieties, copper bactericides." },
            { name: "Brown Streak Disease", type: "Viral", pathogen: "Cassava brown streak virus", imageCount: 475, severity: "Critical", symptoms: "Yellow-brown streaks, corky roots.", treatment: "Virus-free cuttings, vector control." },
            { name: "Green Mottle", type: "Viral", pathogen: "Cassava green mottle virus", imageCount: 435, severity: "Medium", symptoms: "Pale green mottling, mild stunting.", treatment: "Rogue infected plants, aphid control." },
            { name: "Mosaic Disease", type: "Viral", pathogen: "African cassava mosaic virus", imageCount: 430, severity: "High", symptoms: "Chlorotic mosaic, severe distortion.", treatment: "Resistant lines, whitefly control." },
        ],
    },
    {
        name: "Cherry", scientificName: "Prunus avium", totalImages: 1088,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 534, healthy: true, severity: "Low", symptoms: "Bright green smooth leaves.", treatment: "Dormant oil, standard pest scouting." },
            { name: "Powdery Mildew", type: "Fungal", pathogen: "Podosphaera clandestina", imageCount: 554, severity: "Medium", symptoms: "White powdery growth, leaf curl.", treatment: "Sulfur or potassium bicarbonate sprays." },
        ],
    },
    {
        name: "Chili", scientificName: "Capsicum frutescens", totalImages: 479,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 100, healthy: true, severity: "Low", symptoms: "Glossy green leaves.", treatment: "Balanced fertilization." },
            { name: "Leaf Curl", type: "Viral", pathogen: "Chili leaf curl virus", imageCount: 98, severity: "High", symptoms: "Upward leaf curl, stunted growth.", treatment: "Whitefly control, reflective mulch." },
            { name: "Leaf Spot", type: "Fungal", pathogen: "Cercospora capsici", imageCount: 100, severity: "Medium", symptoms: "Circular spots, pale center.", treatment: "Mancozeb, avoid overhead irrigation." },
            { name: "Whitefly", type: "Pest", pathogen: "Bemisia tabaci", imageCount: 99, severity: "Medium", symptoms: "Sooty mold, honeydew, insects visible.", treatment: "Sticky traps, neem oil, imidacloprid." },
            { name: "Yellowish", type: "Nutrient", pathogen: "Nutritional deficiency", imageCount: 82, severity: "Low", symptoms: "General yellowing.", treatment: "Soil correction, micronutrient spray." },
        ],
    },
    {
        name: "Coffee", scientificName: "Coffea arabica", totalImages: 1046,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 414, healthy: true, severity: "Low", symptoms: "Waxy, dark green leaves.", treatment: "Shade management." },
            { name: "Cercospora Leaf Spot", type: "Fungal", pathogen: "Cercospora coffeicola", imageCount: 55, severity: "Medium", symptoms: "Brown spots with yellow halos.", treatment: "Copper fungicides." },
            { name: "Red Spider Mite", type: "Pest", pathogen: "Oligonychus coffeae", imageCount: 166, severity: "Medium", symptoms: "Bronze discoloration, fine webbing.", treatment: "Miticides, increase humidity." },
            { name: "Rust", type: "Fungal", pathogen: "Hemileia vastatrix", imageCount: 411, severity: "Critical", symptoms: "Orange-yellow powdery pustules.", treatment: "Triazole fungicides, resistant varieties." },
        ],
    },
    {
        name: "Corn", scientificName: "Zea mays", totalImages: 3743,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 990, healthy: true, severity: "Low", symptoms: "Uniform green leaves.", treatment: "Optimal density and nitrogen." },
            { name: "Common Rust", type: "Fungal", pathogen: "Puccinia sorghi", imageCount: 1011, severity: "Medium", symptoms: "Brown pustules releasing orange spores.", treatment: "Foliar fungicides, resistant hybrids." },
            { name: "Gray Leaf Spot", type: "Fungal", pathogen: "Cercospora zeae-maydis", imageCount: 762, severity: "High", symptoms: "Rectangular gray-tan lesions.", treatment: "Crop rotation, strobilurin at tasseling." },
            { name: "Northern Leaf Blight", type: "Fungal", pathogen: "Exserohilum turcicum", imageCount: 980, severity: "High", symptoms: "Large cigar-shaped grey lesions.", treatment: "Resistant hybrids with Ht genes." },
        ],
    },
    {
        name: "Cucumber", scientificName: "Cucumis sativus", totalImages: 1647,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 821, healthy: true, severity: "Low", symptoms: "Broad deep green leaves.", treatment: "Trellising, consistent watering." },
            { name: "Diseased", type: "Fungal", pathogen: "Pseudoperonospora spp.", imageCount: 335, severity: "High", symptoms: "Powdery coating, yellowing vine.", treatment: "Chlorothalonil, improved airflow." },
            { name: "Rotten", type: "Rotten", pathogen: "Pythium / Botrytis", imageCount: 491, severity: "High", symptoms: "Soft water-soaked fruit rot.", treatment: "Avoid over-watering, crop rotation." },
        ],
    },
    {
        name: "Gauva", scientificName: "Psidium guajava", totalImages: 419,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 277, healthy: true, severity: "Low", symptoms: "Firm green leaves.", treatment: "Balanced fertilization." },
            { name: "Diseased", type: "Fungal", pathogen: "Colletotrichum spp.", imageCount: 142, severity: "Medium", symptoms: "Anthracnose leaf spots and fruit blotches.", treatment: "Copper sprays, remove infected fruit." },
        ],
    },
    {
        name: "Grape", scientificName: "Vitis vinifera", totalImages: 2585,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 637, healthy: true, severity: "Low", symptoms: "Deep green broad leaves, firm berries.", treatment: "Prune for canopy light, proper trellising." },
            { name: "Black Measles", type: "Fungal", pathogen: "Phaeomoniella chlamydospora", imageCount: 576, severity: "High", symptoms: "Tiger-stripe leaf discoloration, berry spotting.", treatment: "Prune infected wood, prevent trunk wound." },
            { name: "Black Rot", type: "Fungal", pathogen: "Guignardia bidwellii", imageCount: 644, severity: "High", symptoms: "Brown leaf spots, berries shrivel to black mummies.", treatment: "Mancozeb, remove mummies, canopy prep." },
            { name: "Isariopsis Leaf Spot", type: "Fungal", pathogen: "Pseudocercospora vitis", imageCount: 528, severity: "Medium", symptoms: "Irregular reddish-brown spots.", treatment: "Fungicides, rake fallen leaves." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis cinerea", imageCount: 200, severity: "High", symptoms: "Gray mold on berries.", treatment: "Canopy microclimate control, fungicides." },
        ],
    },
    {
        name: "Guava", scientificName: "Psidium guajava", totalImages: 400,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 200, healthy: true, severity: "Low", symptoms: "Glossy dark leaves.", treatment: "Pruning for light penetration." },
            { name: "Rotten", type: "Rotten", pathogen: "Post-harvest fungi", imageCount: 200, severity: "High", symptoms: "Soft spots, mold on fruit.", treatment: "Cool storage, wax coating." },
        ],
    },
    {
        name: "Jamun", scientificName: "Syzygium cumini", totalImages: 624,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 279, healthy: true, severity: "Low", symptoms: "Glossy dark leaves.", treatment: "Pruning for light penetration." },
            { name: "Diseased", type: "Fungal", pathogen: "Pestalotiopsis spp.", imageCount: 345, severity: "Medium", symptoms: "Leaf spots, twig dieback.", treatment: "Copper fungicides, remove cankers." },
        ],
    },
    {
        name: "Jujube", scientificName: "Ziziphus jujuba", totalImages: 400,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 200, healthy: true, severity: "Low", symptoms: "Bright green ovate leaves.", treatment: "Zinc/Boron management." },
            { name: "Rotten", type: "Rotten", pathogen: "Post-harvest pathogens", imageCount: 200, severity: "High", symptoms: "Shriveling, discoloration.", treatment: "Low-temp storage, coatings." },
        ],
    },
    {
        name: "Lemon", scientificName: "Citrus limon", totalImages: 236,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 159, healthy: true, severity: "Low", symptoms: "Glossy leaves, normal fruit.", treatment: "Citrus-balanced fertilizer." },
            { name: "Diseased", type: "Bacterial", pathogen: "Xanthomonas / HLB", imageCount: 77, severity: "High", symptoms: "Canker lesions, blotchy mottle.", treatment: "Control psyllids, copper sprays." },
        ],
    },
    {
        name: "Mango", scientificName: "Mangifera indica", totalImages: 1588,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 739, healthy: true, severity: "Low", symptoms: "Clear lanceolate leaves.", treatment: "Micronutrient balance." },
            { name: "Diseased", type: "Fungal", pathogen: "Colletotrichum / Oidium", imageCount: 265, severity: "High", symptoms: "Anthracnose dark lesions, powdery mildew.", treatment: "Carbendazim, prune for airflow." },
            { name: "Rotten", type: "Rotten", pathogen: "Aspergillus / Fusarium", imageCount: 584, severity: "High", symptoms: "Stem-end rot, spongy flesh.", treatment: "Hot water treatment (52°C)." },
        ],
    },
    {
        name: "Orange", scientificName: "Citrus sinensis", totalImages: 1199,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 598, healthy: true, severity: "Low", symptoms: "Glossy dark green leaves.", treatment: "Drip irrigation, scale monitoring." },
            { name: "Rotten", type: "Rotten", pathogen: "Penicillium spp.", imageCount: 601, severity: "High", symptoms: "Blue/green mold, fruit decay.", treatment: "Fungicide dips post-harvest." },
        ],
    },
    {
        name: "Peach", scientificName: "Prunus persica", totalImages: 971,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 363, healthy: true, severity: "Low", symptoms: "Clean lanceolate leaves.", treatment: "Dormant oil, calcium sprays." },
            { name: "Bacterial Spot", type: "Bacterial", pathogen: "Xanthomonas arboricola", imageCount: 608, severity: "High", symptoms: "Shot-hole appearance, fruit cracking.", treatment: "Copper-based bactericides, mancozeb." },
        ],
    },
    {
        name: "Pepper", scientificName: "Capsicum annuum", totalImages: 1151,
        diseases: [
            { name: "Bacterial Spot", type: "Bacterial", pathogen: "Xanthomonas campestris", imageCount: 557, severity: "High", symptoms: "Water-soaked lesions, yellow halos.", treatment: "Copper sprays, disease-free seed." },
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 594, healthy: true, severity: "Low", symptoms: "Vigorous green leaves.", treatment: "Stake plants, apply balanced NPK." },
        ],
    },
    {
        name: "Pepper Bell", scientificName: "Capsicum annuum", totalImages: 865,
        diseases: [
            { name: "Bacterial Spot", type: "Bacterial", pathogen: "Xanthomonas campestris", imageCount: 409, severity: "High", symptoms: "Water-soaked lesions, yellow halos.", treatment: "Copper sprays, disease-free seed." },
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 456, healthy: true, severity: "Low", symptoms: "Vigorous green leaves.", treatment: "Stake plants, apply balanced NPK." },
        ],
    },
    {
        name: "Pomegranate", scientificName: "Punica granatum", totalImages: 959,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 487, healthy: true, severity: "Low", symptoms: "Glossy leaves, vibrant fruit.", treatment: "Drip irrigation." },
            { name: "Diseased", type: "Fungal", pathogen: "Cercospora / Alternaria", imageCount: 272, severity: "Medium", symptoms: "Leaf spots, fruit blotch.", treatment: "Copper sprays, pruning." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis / Aspergillus", imageCount: 200, severity: "High", symptoms: "Soft brown patches, fermented odor.", treatment: "Early harvest, cool storage." },
        ],
    },
    {
        name: "Potato", scientificName: "Solanum tuberosum", totalImages: 3432,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 642, healthy: true, severity: "Low", symptoms: "Vigorous green foliage.", treatment: "Proper hilling, consistent moisture." },
            { name: "Early Blight", type: "Fungal", pathogen: "Alternaria solani", imageCount: 1166, severity: "Medium", symptoms: "Target-like concentric rings.", treatment: "Chlorothalonil, crop rotation." },
            { name: "Late Blight", type: "Oomycete", pathogen: "Phytophthora infestans", imageCount: 1158, severity: "Critical", symptoms: "Large water-soaked lesions, rapid death.", treatment: "Metalaxyl, destroy infected plants." },
            { name: "Rotten", type: "Rotten", pathogen: "Erwinia spp.", imageCount: 466, severity: "High", symptoms: "Slimy decay, foul odor, black leg.", treatment: "Certified seed, avoid wounding." },
        ],
    },
    {
        name: "Rice", scientificName: "Oryza sativa", totalImages: 4184,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 1039, healthy: true, severity: "Low", symptoms: "Erect, green tillers.", treatment: "Balanced N-P-K, water management." },
            { name: "Brown Spot", type: "Fungal", pathogen: "Bipolaris oryzae", imageCount: 807, severity: "Medium", symptoms: "Oval brown spots with grey centers.", treatment: "Tricyclazole, balanced potassium." },
            { name: "Leaf Blast", type: "Fungal", pathogen: "Magnaporthe oryzae", imageCount: 929, severity: "High", symptoms: "Diamond-shaped grey lesions.", treatment: "Tricyclazole, avoid excess N." },
            { name: "Neck Blast", type: "Fungal", pathogen: "Magnaporthe oryzae", imageCount: 938, severity: "Critical", symptoms: "Brown lesion at neck, whiteheads.", treatment: "Spray tricyclazole at heading." },
            { name: "Hispa", type: "Pest", pathogen: "Dicladispa armigera", imageCount: 471, severity: "Medium", symptoms: "White parallel leaf streaks (mining).", treatment: "Chlorpyrifos, monitor early." },
        ],
    },
    {
        name: "Soybean", scientificName: "Glycine max", totalImages: 2180,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 632, healthy: true, severity: "Low", symptoms: "Uniform trifoliate leaves.", treatment: "Rotation, seed treatment." },
            { name: "Bacterial Blight", type: "Bacterial", pathogen: "Pseudomonas savastanoi", imageCount: 56, severity: "Medium", symptoms: "Angular water-soaked spots.", treatment: "Resistant varieties, copper." },
            { name: "Caterpillar", type: "Pest", pathogen: "Anticarsia gemmatalis", imageCount: 613, severity: "High", symptoms: "Ragged leaf edges, defoliation.", treatment: "Bt sprays, pyrethroids." },
            { name: "Diabrotica", type: "Pest", pathogen: "Diabrotica speciosa", imageCount: 603, severity: "High", symptoms: "Round holes in leaves, larval feeding.", treatment: "Crop rotation, soil insecticides." },
            { name: "Downy Mildew", type: "Oomycete", pathogen: "Peronospora manshurica", imageCount: 50, severity: "Medium", symptoms: "Pale spots, downy growth below.", treatment: "Metalaxyl seed treatment." },
            { name: "Mosaic Virus", type: "Viral", pathogen: "Soybean mosaic virus", imageCount: 22, severity: "Medium", symptoms: "Mosaic mottling, dwarfing.", treatment: "Virus-free seed, vector control." },
            { name: "Powdery Mildew", type: "Fungal", pathogen: "Microsphaera diffusa", imageCount: 77, severity: "Low", symptoms: "White powdery growth.", treatment: "Sulfur, increase spacing." },
            { name: "Rust", type: "Fungal", pathogen: "Phakopsora pachyrhizi", imageCount: 65, severity: "High", symptoms: "Tan pustules on lower leaf.", treatment: "Triazoles at early flowering." },
            { name: "Southern Blight", type: "Fungal", pathogen: "Sclerotium rolfsii", imageCount: 62, severity: "High", symptoms: "White mycelium at base, sudden wilt.", treatment: "Deep tillage, PCNB soil treatment." },
        ],
    },
    {
        name: "Strawberry", scientificName: "Fragaria × ananassa", totalImages: 2115,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 988, healthy: true, severity: "Low", symptoms: "Vibrant trifoliate leaves.", treatment: "Straw mulch, balanced fertilizer." },
            { name: "Leaf Scorch", type: "Fungal", pathogen: "Diplocarpon earlianum", imageCount: 563, severity: "Medium", symptoms: "Dark purple spots enlarging to tan.", treatment: "Captan/thiram, use drip irrigation." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis cinerea", imageCount: 564, severity: "High", symptoms: "Gray mold on fruit.", treatment: "Cyprodinil, remove infected fruit." },
        ],
    },
    {
        name: "Sugarcane", scientificName: "Saccharum officinarum", totalImages: 596,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 180, healthy: true, severity: "Low", symptoms: "Tall erect canes, clean blades.", treatment: "Balanced NPK, clean ratoons." },
            { name: "Bacterial Blight", type: "Bacterial", pathogen: "Xanthomonas albilineans", imageCount: 100, severity: "High", symptoms: "White leaf stripes, scalding.", treatment: "Hot-water sett treatment." },
            { name: "Red Rot", type: "Fungal", pathogen: "Colletotrichum falcatum", imageCount: 171, severity: "Critical", symptoms: "Red internal tissue, sour smell.", treatment: "Resistant varieties, crop rotation." },
            { name: "Red Stripe", type: "Bacterial", pathogen: "Acidovorax avenae", imageCount: 53, severity: "Medium", symptoms: "Water-soaked red leaf stripes.", treatment: "Copper bactericides." },
            { name: "Rust", type: "Fungal", pathogen: "Puccinia melanocephala", imageCount: 92, severity: "Medium", symptoms: "Orange-brown leaf pustules.", treatment: "Triazole fungicides." },
        ],
    },
    {
        name: "Tea", scientificName: "Camellia sinensis", totalImages: 1917,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 222, healthy: true, severity: "Low", symptoms: "Glossy shoots.", treatment: "Shade, regular plucking." },
            { name: "Algal Leaf Spot", type: "Fungal", pathogen: "Cephaleuros virescens", imageCount: 339, severity: "Low", symptoms: "Orange-red powdery spots.", treatment: "Copper, prune for light." },
            { name: "Anthracnose", type: "Fungal", pathogen: "Colletotrichum camelliae", imageCount: 300, severity: "Medium", symptoms: "Irregular lesions, blister blight.", treatment: "Copper oxychloride." },
            { name: "Bird Eye Spot", type: "Fungal", pathogen: "Cercospora theae", imageCount: 297, severity: "Medium", symptoms: "Circular spots, light center.", treatment: "Copper sprays, manage N." },
            { name: "Brown Blight", type: "Fungal", pathogen: "Colletotrichum gloeosporioides", imageCount: 339, severity: "Medium", symptoms: "Water-soaked shoot blight.", treatment: "Thiophanate-methyl, remove blight." },
            { name: "Red Leaf Spot", type: "Fungal", pathogen: "Didymella theae", imageCount: 420, severity: "High", symptoms: "Reddish-brown blotches.", treatment: "Carbendazim, balanced nutrition." },
        ],
    },
    {
        name: "Tomato", scientificName: "Solanum lycopersicum", totalImages: 10983,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 1539, healthy: true, severity: "Low", symptoms: "Uniform green leaves.", treatment: "Regular staking, consistent watering." },
            { name: "Bacterial Spot", type: "Bacterial", pathogen: "Xanthomonas perforans", imageCount: 1124, severity: "High", symptoms: "Dark oily spots, yellow halos.", treatment: "Copper + mancozeb rotation." },
            { name: "Early Blight", type: "Fungal", pathogen: "Alternaria solani", imageCount: 967, severity: "Medium", symptoms: "Concentric bullseye leaf spots.", treatment: "Chlorothalonil, mulch base." },
            { name: "Late Blight", type: "Oomycete", pathogen: "Phytophthora infestans", imageCount: 1105, severity: "Critical", symptoms: "Water-soaked greasy lesions, rapid wilt.", treatment: "Metalaxyl, destroy plants immediately." },
            { name: "Leaf Mold", type: "Fungal", pathogen: "Passalora fulva", imageCount: 949, severity: "Medium", symptoms: "Yellow upper spots, brown mold below.", treatment: "Improve airflow, chlorothalonil." },
            { name: "Mosaic Virus", type: "Viral", pathogen: "Tomato mosaic virus", imageCount: 547, severity: "Medium", symptoms: "Mottled light/dark patches, fern-like.", treatment: "Virus-free seed, sanitize tools." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis / Fusarium", imageCount: 488, severity: "High", symptoms: "Gray mold or blossom-end rot.", treatment: "Calcium sprays, control humidity." },
            { name: "Septoria Leaf Spot", type: "Fungal", pathogen: "Septoria lycopersici", imageCount: 1094, severity: "High", symptoms: "Small spots, dark margins, grey centers.", treatment: "Mancozeb, stake plants." },
            { name: "Spider Mites", type: "Pest", pathogen: "Tetranychus urticae", imageCount: 1078, severity: "Medium", symptoms: "Stippling, fine webbing, bronzing.", treatment: "Abamectin, predatory mites." },
            { name: "Target Spot", type: "Fungal", pathogen: "Corynespora cassiicola", imageCount: 909, severity: "High", symptoms: "Dark concentric rings, defoliation.", treatment: "Boscalid, reduce wetness." },
            { name: "Yellow Leaf Curl", type: "Viral", pathogen: "Tomato yellow leaf curl virus", imageCount: 1183, severity: "High", symptoms: "Severe stunting, yellow margins, upward curl.", treatment: "Whitefly control, resistant Ty genes." },
        ],
    },
    {
        name: "Wheat", scientificName: "Triticum aestivum", totalImages: 3014,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 985, healthy: true, severity: "Low", symptoms: "Erect blue-green leaves.", treatment: "Balanced nitrogen, scout early." },
            { name: "Brown Rust", type: "Fungal", pathogen: "Puccinia triticina", imageCount: 941, severity: "High", symptoms: "Orange-brown scattered pustules.", treatment: "Triazole fungicides." },
            { name: "Yellow Rust", type: "Fungal", pathogen: "Puccinia striiformis", imageCount: 991, severity: "Critical", symptoms: "Yellow-orange pustules in stripes.", treatment: "Propiconazole, track forecasts." },
            { name: "Septoria", type: "Fungal", pathogen: "Zymoseptoria tritici", imageCount: 97, severity: "High", symptoms: "Pale lesions with black pycnidia.", treatment: "Strobilurins at flag leaf stage." },
        ],
    },
];

// ─── Computed Stats (now accurate) ─────────────────────────────────────────────
const TOTAL_CROPS    = cropsData.length;
const TOTAL_IMAGES   = cropsData.reduce((a, c) => a + c.totalImages, 0);
const TOTAL_CLASSES  = cropsData.reduce((a, c) => a + c.diseases.length, 0);
const TOTAL_DISEASES = cropsData.reduce((a, c) => a + c.diseases.filter(d => !d.healthy).length, 0);
const TOTAL_HEALTHY  = TOTAL_CLASSES - TOTAL_DISEASES;

// ─── Style Helpers (unchanged) ────────────────────────────────────────────────
const TYPE_STYLES: Record<string, { badge: string; dot: string; label: string }> = {
    Fungal:             { badge: "bg-amber-100 text-amber-800",   dot: "bg-amber-500",  label: "Fungal" },
    Bacterial:          { badge: "bg-red-100 text-red-800",       dot: "bg-red-500",    label: "Bacterial" },
    Viral:              { badge: "bg-purple-100 text-purple-800", dot: "bg-purple-500", label: "Viral" },
    Pest:               { badge: "bg-orange-100 text-orange-800", dot: "bg-orange-400", label: "Pest" },
    Oomycete:           { badge: "bg-blue-100 text-blue-800",     dot: "bg-blue-500",   label: "Oomycete" },
    Rotten:             { badge: "bg-stone-100 text-stone-700",   dot: "bg-stone-400",  label: "Rotten" },
    Nutrient:           { badge: "bg-yellow-100 text-yellow-800", dot: "bg-yellow-400", label: "Nutrient" },
    Healthy:            { badge: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", label: "Healthy" },
};

const SEV_STYLES: Record<string, string> = {
    Low:      "bg-green-100 text-green-800",
    Medium:   "bg-yellow-100 text-yellow-800",
    High:     "bg-orange-100 text-orange-800",
    Critical: "bg-red-100 text-red-800",
};

function TypeBadge({ type }: { type: string }) {
    const s = TYPE_STYLES[type] ?? TYPE_STYLES.Fungal;
    return <Badge className={`${s.badge} border-0 text-xs font-medium hover:${s.badge} drop-shadow-sm`}>{s.label}</Badge>;
}
function SevBadge({ severity }: { severity: string }) {
    return <Badge className={`${SEV_STYLES[severity]} border-0 text-xs font-medium drop-shadow-sm`}>{severity}</Badge>;
}

// ─── Sub-components (unchanged except they use updated data) ───────────────────
function CropCard({ crop }: { crop: Crop }) {
    const [open, setOpen] = useState<string | null>(null);
    const healthyCount  = crop.diseases.filter(d => d.healthy).length;
    const diseaseCount  = crop.diseases.filter(d => !d.healthy).length;
    const hasHealthy    = healthyCount > 0;

    return (
        <motion.div
            whileHover={{ y: -4, boxShadow: T.shadowHov }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="flex flex-col h-full rounded-2xl overflow-hidden"
            style={{ background: T.glassElev, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)", boxShadow: T.shadow }}
        >
            {/* Card Header */}
            <div className="pb-3 pt-5 px-5 select-none" style={{ background: "linear-gradient(to bottom, rgba(10,123,74,0.08), transparent)" }}>
                <div className="flex justify-between items-start gap-2">
                    <div>
                        <h3 className="text-lg font-bold leading-tight" style={{ color: T.textPrimary }}>
                            {crop.name}
                        </h3>
                        <p className="text-xs italic mt-0.5" style={{ color: T.textSecond }}>{crop.scientificName}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: "rgba(10,123,74,0.1)", color: T.primary }}>
                        {crop.diseases.length} classes
                    </span>
                </div>

                {/* Progress bar and image count */}
                <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1 font-medium" style={{ color: T.textSecond }}>
                        <span>{crop.totalImages.toLocaleString()} images</span>
                        <span>{diseaseCount} disease{diseaseCount !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(10,123,74,0.12)" }}>
                        <div
                            className="h-full transition-all"
                            style={{
                                width: `${Math.min(100, (crop.totalImages / 11000) * 100)}%`,
                                background: `linear-gradient(90deg, ${T.primary}, #10B981)`,
                            }}
                        />
                    </div>
                </div>

                <div className="mt-3">
                    {hasHealthy ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ background: "rgba(16,185,129,0.12)", color: "#065f46", borderColor: "rgba(16,185,129,0.3)" }}>
                            <CheckCircle className="w-3.5 h-3.5" /> Normal baseline available
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border" style={{ background: "rgba(245,158,11,0.12)", color: "#92400e", borderColor: "rgba(245,158,11,0.3)" }}>
                            <AlertCircle className="w-3.5 h-3.5" /> No normal baseline
                        </span>
                    )}
                </div>
            </div>

            {/* Disease list */}
            <div className="flex-1 px-5 pb-5 pt-2 space-y-2">
                {crop.diseases.map((disease) => {
                    const isOpen = open === disease.name;
                    const s = TYPE_STYLES[disease.type] ?? TYPE_STYLES.Fungal;
                    return (
                        <div key={disease.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: "rgba(255,255,255,0.6)" }}>
                            <button
                                onClick={() => setOpen(isOpen ? null : disease.name)}
                                className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#0A7B4A]/50"
                            >
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${s.dot}`} />
                                <span className="flex-1 text-sm font-semibold truncate" style={{ color: T.textPrimary }}>{disease.name}</span>
                                <span className="text-xs font-medium" style={{ color: T.textSecond }}>{disease.imageCount.toLocaleString()}</span>
                                <ChevronRight
                                    className="w-4 h-4 shrink-0 transition-transform"
                                    style={{ color: T.primary, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
                                />
                            </button>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4 pt-1 space-y-3" style={{ background: "rgba(245,250,240,0.8)" }}>
                                            {!disease.healthy && (
                                                <p className="text-xs leading-relaxed" style={{ color: T.textSecond }}>
                                                    <span className="font-bold tracking-wide uppercase text-[10px]" style={{ color: T.primary }}>Symptoms</span><br/>
                                                    {disease.symptoms}
                                                </p>
                                            )}
                                            <p className="text-xs leading-relaxed" style={{ color: T.textSecond }}>
                                                <span className="font-bold tracking-wide uppercase text-[10px]" style={{ color: T.primary }}>Treatment</span><br/>
                                                {disease.treatment}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t" style={{ borderColor: 'rgba(10,123,74,0.1)' }}>
                                                <div className="pt-2 flex flex-wrap gap-1.5 w-full">
                                                    <TypeBadge type={disease.type} />
                                                    <SevBadge severity={disease.severity} />
                                                    {disease.pathogen !== "N/A" && (
                                                        <span className="text-xs italic bg-white/50 px-2 py-0.5 rounded text-[#3A4D3A] border" style={{ borderColor: 'rgba(10,123,74,0.15)' }}>
                                                            {disease.pathogen}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

// ─── Main Page (unchanged except data and stats are now accurate) ───────────────
export default function CropsPage() {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState<string>("All");

    const FILTERS = ["All", "Fungal", "Bacterial", "Viral", "Pest", "Oomycete", "Rotten", "Healthy"];

    const filtered = useMemo(() => {
        return cropsData.filter(crop => {
            const matchSearch = !search ||
                crop.name.toLowerCase().includes(search.toLowerCase()) ||
                crop.diseases.some(d => d.name.toLowerCase().includes(search.toLowerCase()));
            const matchFilter = activeFilter === "All" ||
                crop.diseases.some(d => d.type === activeFilter || (activeFilter === "Healthy" && d.healthy));
            return matchSearch && matchFilter;
        });
    }, [search, activeFilter]);

    const containerVariants: Variants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
    };
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    };

    // All diseases flattened for table
    const allDiseases = cropsData.flatMap(crop =>
        crop.diseases.map(d => ({ ...d, cropName: crop.name }))
    );

    return (
        <main
            className="min-h-screen pb-12"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            {/* Background elements */}
            <div className="fixed inset-0 -z-10" style={{
                background: "linear-gradient(135deg, #EFF5EA 0%, #F4F8F0 45%, #E8F3E0 100%)",
            }} />
            <div className="fixed top-[-10%] right-[-5%] -z-10 w-[600px] h-[600px] rounded-full opacity-[0.15]"
                style={{ background: `radial-gradient(circle, ${T.primary} 0%, transparent 70%)`, filter: "blur(100px)" }} />
            <div className="fixed bottom-0 left-[-10%] -z-10 w-[500px] h-[500px] rounded-full opacity-[0.1]"
                style={{ background: `radial-gradient(circle, #10B981 0%, transparent 70%)`, filter: "blur(90px)" }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 my-4">

                {/* ── Hero ─────────────────────────────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-14"
                >
                    <div className="rounded-[32px] p-8 md:p-12 relative overflow-hidden"
                        style={{ background: T.glassElev, border: `1px solid ${T.borderMed}`, backdropFilter: "blur(20px)", boxShadow: "0 24px 64px rgba(10,123,74,0.08)" }}>

                        {/* Decorative leaf */}
                        <div className="absolute right-0 top-0 opacity-[0.04] pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                            <Leaf className="w-96 h-96" style={{ color: T.primary }} />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start gap-10 relative z-10">
                            <div className="flex-1 max-w-3xl">
                                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6"
                                    style={{ background: "rgba(10,123,74,0.1)", color: T.primary, border: `1px solid rgba(10,123,74,0.2)` }}>
                                    <Sprout className="w-3.5 h-3.5" />
                                    AgroLeaf AI · Dataset Intelligence
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 tracking-tight text-[#1A2E1A]">
                                    {TOTAL_CROPS} Supported Crops.{" "}
                                    <span style={{ color: T.primary }}>{TOTAL_CLASSES} Classes.</span>
                                </h1>
                                <p className="text-base md:text-lg leading-relaxed text-[#3A4D3A] font-medium max-w-2xl">
                                    Our computer vision model is trained on deeply-curated dataset encompassing
                                    <strong className="text-[#0A7B4A] mx-1">{TOTAL_IMAGES.toLocaleString()}+ images</strong> covering 
                                    <strong className="text-[#0A7B4A] mx-1">{TOTAL_DISEASES} disease variants</strong> and 
                                    <strong className="text-[#0A7B4A] mx-1">{TOTAL_HEALTHY} healthy crop baselines</strong>.
                                </p>
                            </div>

                            {/* Big circular stat */}
                            <div className="shrink-0 flex flex-col items-center justify-center w-40 h-40 md:w-48 md:h-48 rounded-[2rem] shadow-sm transform rotate-3"
                                style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(245,250,240,0.8))`, border: `2px solid rgba(10,123,74,0.25)` }}>
                                <Database className="w-8 h-8 md:w-10 md:h-10 mb-2" style={{ color: T.primary }} />
                                <p className="text-3xl md:text-4xl font-black text-[#0A7B4A] tracking-tighter">{TOTAL_IMAGES.toLocaleString()}</p>
                                <p className="text-xs md:text-sm font-bold mt-1 text-center text-[#3A4D3A] uppercase tracking-wider">Images</p>
                            </div>
                        </div>

                        {/* Stat row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                            {[
                                { icon: <Leaf className="w-6 h-6" />, v: TOTAL_CROPS, l: "Crop Varieties" },
                                { icon: <AlertCircle className="w-6 h-6" />, v: TOTAL_DISEASES, l: "Disease Types" },
                                { icon: <CheckCircle className="w-6 h-6" />, v: TOTAL_HEALTHY, l: "Healthy Controls" },
                                { icon: <Database className="w-6 h-6" />, v: TOTAL_CLASSES, l: "Total Classes" },
                            ].map(s => (
                                <div key={s.l} className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-transform hover:-translate-y-1"
                                    style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${T.border}`, boxShadow: "0 4px 12px rgba(10,123,74,0.05)" }}>
                                    <div className="p-2.5 rounded-xl bg-[#0A7B4A]/10 text-[#0A7B4A]">
                                        {s.icon}
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-[#1A2E1A] leading-none">{s.v}</p>
                                        <p className="text-xs font-bold text-[#3A4D3A]/70 uppercase tracking-wider mt-1">{s.l}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ── Crop Directory ────────────────────────────────────────────── */}
                <section className="mb-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-extrabold text-[#1A2E1A] tracking-tight mb-2">Crop Directory</h2>
                            <p className="text-sm font-medium text-[#3A4D3A]/80">Explore conditions by specific crop type</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative group">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0A7B4A]/60 group-focus-within:text-[#0A7B4A] transition-colors" />
                                <Input
                                    placeholder="Search crops or diseases…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-10 pr-9 rounded-xl text-sm h-11 border transition-all focus-visible:ring-2 focus-visible:ring-[#0A7B4A]/50 focus-visible:border-[#0A7B4A]"
                                    style={{
                                        background: "rgba(255,255,255,0.8)",
                                        borderColor: T.border,
                                        color: T.textPrimary,
                                        boxShadow: "0 2px 10px rgba(10,123,74,0.03)"
                                    }}
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                        <X className="w-3.5 h-3.5 text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filter chips */}
                    <div className="flex flex-wrap items-center gap-2 mb-8 bg-white/40 p-2 rounded-2xl border border-[#0A7B4A]/10 backdrop-blur-md inline-flex max-w-full overflow-x-auto">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#3A4D3A]/60 pl-2 pr-1 hidden sm:block">Filter:</span>
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === f ? 'shadow-md scale-105' : 'hover:bg-white/60 hover:scale-105'}`}
                                style={activeFilter === f
                                    ? { background: T.primary, color: "#fff", border: `1px solid ${T.primary}` }
                                    : { background: "rgba(255,255,255,0.5)", color: T.textSecond, border: `1px solid ${T.border}` }
                                }
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    
                    <div className="mb-4 text-sm font-semibold text-[#0A7B4A]">
                        Showing {filtered.length} of {TOTAL_CROPS} crops
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map(crop => (
                            <motion.div key={crop.name} variants={cardVariants}>
                                <CropCard crop={crop} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {filtered.length === 0 && (
                        <div className="text-center py-24 bg-white/30 rounded-3xl border border-[#0A7B4A]/10 backdrop-blur-sm mt-6">
                            <Sprout className="w-16 h-16 mx-auto mb-4 text-[#0A7B4A]/20" />
                            <h3 className="text-xl font-bold text-[#1A2E1A] mb-2">No matching crops</h3>
                            <p className="font-medium text-[#3A4D3A]/70 mb-4">Try adjusting your search or filters.</p>
                            <Button onClick={() => { setSearch(""); setActiveFilter("All"); }} variant="outline" className="border-[#0A7B4A]/30 text-[#0A7B4A] hover:bg-[#0A7B4A]/10 rounded-xl">
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </section>

                {/* ── Dataset Composition ──────────────────────────────────────── */}
                <section className="mb-20">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-[#1A2E1A] tracking-tight mb-2">Dataset Composition</h2>
                        <p className="text-sm font-medium text-[#3A4D3A]/80">Comprehensive breakdown of all supported crops</p>
                    </div>
                    <div className="rounded-[24px] overflow-hidden" 
                         style={{ background: T.glassElev, border: `1px solid ${T.borderMed}`, backdropFilter: "blur(16px)", boxShadow: "0 12px 32px rgba(10,123,74,0.06)" }}>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow style={{ borderBottom: `2px solid ${T.border}`, background: "rgba(10,123,74,0.06)" }}>
                                        {["Crop", "Scientific Name", "Total Images", "Classes", "Healthy Control", "Major Disease"].map(h => (
                                            <TableHead key={h} className="text-xs font-bold uppercase tracking-wider h-12" style={{ color: T.primary }}>{h}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {[...cropsData].sort((a, b) => b.totalImages - a.totalImages).map((crop, i) => {
                                        const topDisease = crop.diseases.filter(d => !d.healthy).sort((a, b) => b.imageCount - a.imageCount)[0];
                                        const hasHealthy = crop.diseases.some(d => d.healthy);
                                        return (
                                            <TableRow
                                                key={crop.name}
                                                style={{ borderBottom: `1px solid rgba(10,123,74,0.08)` }}
                                                className="transition-colors hover:bg-white/60 cursor-default"
                                            >
                                                <TableCell className="font-bold text-sm whitespace-nowrap" style={{ color: T.textPrimary }}>
                                                    <span className="inline-block w-6 text-xs text-[#0A7B4A]/50 font-bold">{i + 1}.</span>
                                                    {crop.name}
                                                </TableCell>
                                                <TableCell className="text-xs italic whitespace-nowrap font-medium" style={{ color: T.textSecond }}>{crop.scientificName}</TableCell>
                                                <TableCell className="font-black text-sm whitespace-nowrap" style={{ color: T.primary }}>{crop.totalImages.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm font-bold text-center w-16" style={{ color: T.textSecond }}>
                                                    <span className="bg-[#0A7B4A]/10 text-[#0A7B4A] px-2.5 py-1 rounded-lg">{crop.diseases.length}</span>
                                                </TableCell>
                                                <TableCell>
                                                    {hasHealthy
                                                        ? <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: "rgba(16,185,129,0.15)", color: "#065f46" }}><CheckCircle className="w-3.5 h-3.5" /> Present</span>
                                                        : <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: "rgba(245,158,11,0.15)", color: "#92400e" }}><AlertCircle className="w-3.5 h-3.5" /> Absent</span>
                                                    }
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap min-w-[200px]">
                                                    {topDisease ? (
                                                        <div className="flex items-center gap-2">
                                                            <TypeBadge type={topDisease.type} />
                                                            <span className="text-xs font-semibold truncate" style={{ color: T.textPrimary }}>{topDisease.name}</span>
                                                        </div>
                                                    ) : <span className="text-xs font-medium" style={{ color: T.textSecond }}>—</span>}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </section>

                {/* ── Image Guidelines (unchanged) ─────────────────────────────── */}
                <section className="mb-20">
                    <div className="mb-8 text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center p-3 bg-[#0A7B4A]/10 text-[#0A7B4A] rounded-2xl mb-4">
                            <Camera className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-[#1A2E1A] tracking-tight mb-3">Optimal Image Capture</h2>
                        <p className="text-base font-medium text-[#3A4D3A]/80">For accurate AI diagnosis, follow these guidelines when capturing and uploading diagnostic images.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                        {[
                            { icon: <Leaf className="w-6 h-6" />, title: "Single Leaf Focus", desc: "Photograph exactly one leaf per image. Avoid bunches. Let the leaf fill 70-80% of the frame." },
                            { icon: <Zap className="w-6 h-6" />, title: "Natural Diffused Light", desc: "Shoot outdoors or near a window. Avoid harsh shadows, flash glare, and artificial color casts." },
                            { icon: <Shield className="w-6 h-6" />, title: "Clear Resolution", desc: "Ensure focus is crisp. Our model processes images up to 4K, but requires a minimum of 256x256px." },
                            { icon: <TrendingUp className="w-6 h-6" />, title: "Multiple Angles", desc: "If unsure, take shots of both the upper surface and the underside, as pathogens present differently." },
                        ].map(g => (
                            <motion.div
                                key={g.title}
                                whileHover={{ y: -3, scale: 1.02 }}
                                transition={{ ease: "easeOut", duration: 0.2 }}
                                className="flex gap-5 items-start rounded-[24px] p-6"
                                style={{ background: T.glassElev, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)", boxShadow: T.shadow }}
                            >
                                <div className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0 shadow-sm" style={{ background: "linear-gradient(135deg, rgba(10,123,74,0.1), rgba(10,123,74,0.05))" }}>
                                    <span style={{ color: T.primary }}>{g.icon}</span>
                                </div>
                                <div className="pt-1">
                                    <p className="font-extrabold text-[#1A2E1A] text-lg mb-1.5">{g.title}</p>
                                    <p className="text-sm font-medium leading-relaxed text-[#3A4D3A]/80">{g.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── Footer / Attribution ─────────────────────────────────────── */}
                <footer className="text-center pt-8 pb-4" style={{ borderTop: `2px solid rgba(10,123,74,0.1)` }}>
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <Sprout className="w-5 h-5 text-[#0A7B4A]" />
                        <span className="font-bold text-[#1A2E1A] tracking-tight">AgroLeaf<span className="text-[#0A7B4A]">AI</span></span>
                    </div>
                    <p className="max-w-xl mx-auto text-sm font-medium leading-relaxed text-[#3A4D3A]/70">
                        Dataset sourced from the{" "}
                        <a
                            href="https://www.kaggle.com/datasets/akarshangupta/high-quality-crop-disease-image-dataset-for-cnns"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#0A7B4A] hover:text-[#2C5F2D] hover:underline underline-offset-4 decoration-2 decoration-[#0A7B4A]/30 transition-all font-bold"
                        >
                            High Quality Crop Disease Image Dataset <ExternalLink className="w-3 h-3" />
                        </a>{" "}
                        based on PlantVillage. Over <span className="font-bold text-[#0A7B4A]">{TOTAL_IMAGES.toLocaleString()}</span> images annotated.
                    </p>
                </footer>
            </div>
        </main>
    );
}