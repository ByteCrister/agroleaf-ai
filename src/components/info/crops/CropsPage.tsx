"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
    Leaf, CheckCircle, AlertCircle, Database, Sprout,
    ExternalLink, ChevronRight, Camera, Search, X,
    TrendingUp, Shield, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table";

// ─── Design Tokens ────────────────────────────────────────────────────────────
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
type DiseaseType = "Fungal" | "Bacterial" | "Viral" | "Pest" | "Healthy" | "Oomycete" | "Rotten";
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

// ─── Full Dataset (30 crops, 56,384 files, 134 classes) ──────────────────────
const cropsData: Crop[] = [
    {
        name: "Apple", scientificName: "Malus domestica", totalImages: 3166,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 1204, healthy: true, severity: "Low", symptoms: "Uniform green leaf, no spots, lesions, or deformities.", treatment: "Maintain proper irrigation, nutrient balance, and routine scouting." },
            { name: "Rotten", type: "Rotten", pathogen: "Post-harvest pathogens", imageCount: 614, severity: "High", symptoms: "Soft, discolored, sunken lesions on fruit surface with visible decay.", treatment: "Improve storage conditions, apply post-harvest fungicides, remove affected fruit." },
            { name: "Black Rot", type: "Fungal", pathogen: "Botryosphaeria obtusa", imageCount: 489, severity: "Medium", symptoms: "Purple spots enlarging to brown circles with purple borders; black rotting lesions on fruit.", treatment: "Prune infected branches, remove mummified fruit, apply captan or thiophanate-methyl fungicides." },
            { name: "Rust", type: "Fungal", pathogen: "Gymnosporangium spp.", imageCount: 357, severity: "Medium", symptoms: "Bright yellow-orange spots on leaves, cup-like structures on undersides, fruit deformities.", treatment: "Remove nearby cedar trees. Apply myclobutanil or mancozeb from pink bud stage through early summer." },
            { name: "Scab", type: "Fungal", pathogen: "Venturia inaequalis", imageCount: 502, severity: "High", symptoms: "Olive-green to dark brown velvety spots on leaves; scabby lesions on fruit.", treatment: "Apply fungicides (myclobutanil, captan) at green tip. Rake and destroy fallen leaves." },
        ],
    },
    {
        name: "Banana", scientificName: "Musa acuminata", totalImages: 1226,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 601, healthy: true, severity: "Low", symptoms: "Smooth, vibrant green leaves with no spots or wilting.", treatment: "Adequate potassium, proper drainage, regular removal of dead leaves." },
            { name: "Rotten", type: "Rotten", pathogen: "Post-harvest pathogens", imageCount: 625, severity: "High", symptoms: "Blackened, mushy tissue, strong fermentation odor, collapsed cell structure.", treatment: "Proper harvest timing, cool-chain management, ethylene control." },
        ],
    },
    {
        name: "Bell Pepper", scientificName: "Capsicum annuum", totalImages: 1816,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 1050, healthy: true, severity: "Low", symptoms: "Vigorous green leaves without lesions, uniform fruit set, no leaf drop.", treatment: "Stake plants for air circulation, avoid overhead irrigation, apply calcium nitrate." },
            { name: "Bacterial Spot", type: "Bacterial", pathogen: "Xanthomonas campestris pv. vesicatoria", imageCount: 966, severity: "High", symptoms: "Small water-soaked lesions that become brown and scabby with yellow halos; defoliation.", treatment: "Copper-based sprays with mancozeb. Use disease-free seed, rotate with non-solanaceous crops 2-3 years." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis / Phytophthora spp.", imageCount: 482, severity: "High", symptoms: "Soft, water-soaked lesions on fruit, often covered with gray mold.", treatment: "Improve air circulation, reduce humidity, fungicide applications at harvest." },
        ],
    },
    {
        name: "Carrot", scientificName: "Daucus carota", totalImages: 934,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 484, healthy: true, severity: "Low", symptoms: "Feathery, bright green tops; firm, smooth orange taproots.", treatment: "Loose, well-drained soil; adequate phosphorus; control carrot fly." },
            { name: "Rotten", type: "Rotten", pathogen: "Sclerotinia / Erwinia spp.", imageCount: 450, severity: "High", symptoms: "Soft rot starting at crown, with cottony mycelium and musty odor.", treatment: "Crop rotation, avoid over-irrigation, fungicide seed treatments." },
        ],
    },
    {
        name: "Cassava", scientificName: "Manihot esculenta", totalImages: 2277,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 492, healthy: true, severity: "Low", symptoms: "Dark green, deeply lobed leaves with no spots or mosaic patterns.", treatment: "Use certified cuttings, balanced fertilization, and scout regularly." },
            { name: "Bacterial Blight", type: "Bacterial", pathogen: "Xanthomonas axonopodis pv. manihotis", imageCount: 445, severity: "High", symptoms: "Angular leaf spots, wilting, dieback, and gummy exudate on stems.", treatment: "Use clean planting material, copper bactericides, and resistant varieties." },
            { name: "Brown Streak Disease", type: "Viral", pathogen: "Cassava brown streak virus (CBSV)", imageCount: 475, severity: "Critical", symptoms: "Yellow-brown streaks on leaves; brown, corky necrosis inside roots.", treatment: "Plant virus-free certified cuttings. Control whitefly vectors. No cure available." },
            { name: "Green Mottle", type: "Viral", pathogen: "Cassava green mottle virus", imageCount: 435, severity: "Medium", symptoms: "Pale green mottling and mosaic patterns on leaves, mild stunting.", treatment: "Use resistant varieties, control aphid vectors, rogue infected plants." },
            { name: "Mosaic Disease", type: "Viral", pathogen: "African cassava mosaic virus (ACMV)", imageCount: 430, severity: "High", symptoms: "Chlorotic mosaic, leaf distortion, stunted growth, and poor root yield.", treatment: "Use virus-free cuttings, control whitefly with insecticides, plant resistant varieties." },
        ],
    },
    {
        name: "Cherry", scientificName: "Prunus avium / cerasus", totalImages: 1088,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 534, healthy: true, severity: "Low", symptoms: "Bright green leaves with no powdery residue or necrotic spots. Normal growth.", treatment: "Dormant oil, balanced fertilization, and regular pest scouting." },
            { name: "Powdery Mildew", type: "Fungal", pathogen: "Podosphaera clandestina", imageCount: 554, severity: "Medium", symptoms: "White powdery fungal growth on leaf surfaces; leaf curling and distortion; stunted shoots.", treatment: "Apply sulfur or potassium bicarbonate sprays. Improve air circulation by pruning. Use resistant rootstocks." },
        ],
    },
    {
        name: "Chili", scientificName: "Capsicum frutescens", totalImages: 479,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 100, healthy: true, severity: "Low", symptoms: "Dark green, glossy leaves without spots or curling. Good fruit set.", treatment: "Balanced NPK, drip irrigation, and regular scouting for thrips and mites." },
            { name: "Leaf Curl", type: "Viral", pathogen: "Chili leaf curl virus (ChLCV)", imageCount: 98, severity: "High", symptoms: "Upward leaf curling, reduced leaf size, stunted growth, yellowing margins.", treatment: "Control whitefly vectors with imidacloprid. Use reflective mulch. Remove infected plants early." },
            { name: "Leaf Spot", type: "Fungal", pathogen: "Cercospora capsici", imageCount: 100, severity: "Medium", symptoms: "Circular spots with pale centers and dark margins; premature defoliation.", treatment: "Apply mancozeb or carbendazim. Avoid overhead irrigation. Rotate crops." },
            { name: "Whitefly Infestation", type: "Pest", pathogen: "Bemisia tabaci", imageCount: 99, severity: "Medium", symptoms: "Yellowing leaves, honeydew deposits, sooty mold, and whitefly adults on undersides.", treatment: "Yellow sticky traps, neem oil sprays, imidacloprid, or spiromesifen." },
            { name: "Yellowish (Nutrient Stress)", type: "Pest", pathogen: "Physiological / Mite stress", imageCount: 82, severity: "Low", symptoms: "General yellowing from leaf margins inward; no distinct lesion pattern.", treatment: "Soil test and correct nutrient deficiencies; check for mite infestations." },
        ],
    },
    {
        name: "Coffee", scientificName: "Coffea arabica", totalImages: 1046,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 414, healthy: true, severity: "Low", symptoms: "Waxy, dark green leaves with no rust pustules or spots. Vigorous growth.", treatment: "Shade management, balanced fertilization, and regular pruning for air flow." },
            { name: "Cercospora Leaf Spot", type: "Fungal", pathogen: "Cercospora coffeicola", imageCount: 55, severity: "Medium", symptoms: "Circular spots with brown centers and yellow halos; premature leaf drop.", treatment: "Apply copper-based fungicides. Improve canopy management and avoid water stress." },
            { name: "Red Spider Mite", type: "Pest", pathogen: "Oligonychus coffeae", imageCount: 166, severity: "Medium", symptoms: "Bronze discoloration on upper leaf surface; fine webbing and stippling.", treatment: "Miticides (abamectin, hexythiazox), predatory mites, and irrigation to reduce dust." },
            { name: "Rust", type: "Fungal", pathogen: "Hemileia vastatrix", imageCount: 411, severity: "Critical", symptoms: "Orange-yellow powdery pustules on leaf undersides; severe defoliation and yield loss.", treatment: "Systemic fungicides (triadimefon, propiconazole). Use resistant varieties. Apply at first sign." },
        ],
    },
    {
        name: "Corn (Maize)", scientificName: "Zea mays", totalImages: 3743,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 990, healthy: true, severity: "Low", symptoms: "Uniform green leaves without lesions or rust pustules. Healthy tassels and ears.", treatment: "Optimize planting density, nitrogen management, and weed control." },
            { name: "Common Rust", type: "Fungal", pathogen: "Puccinia sorghi", imageCount: 1011, severity: "Medium", symptoms: "Cinnamon-brown to dark brown pustules on both leaf surfaces releasing orange spores.", treatment: "Plant resistant varieties. Foliar fungicides (azoxystrobin, pyraclostrobin) at early onset." },
            { name: "Gray Leaf Spot", type: "Fungal", pathogen: "Cercospora zeae-maydis", imageCount: 762, severity: "High", symptoms: "Long rectangular gray-tan lesions parallel to leaf veins; merging causes leaf blight.", treatment: "Resistant hybrids, crop rotation, tillage to bury residue. Apply strobilurin fungicides at tasseling." },
            { name: "Northern Leaf Blight", type: "Fungal", pathogen: "Exserohilum turcicum", imageCount: 980, severity: "High", symptoms: "Large cigar-shaped gray-green to tan lesions parallel to veins, up to 6 inches long.", treatment: "Resistant hybrids with Ht genes. Apply propiconazole or fluxapyroxad at early disease onset." },
        ],
    },
    {
        name: "Cucumber", scientificName: "Cucumis sativus", totalImages: 1647,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 821, healthy: true, severity: "Low", symptoms: "Broad, deep green leaves; firm, uniformly colored fruit with no lesions.", treatment: "Trellising for air circulation, consistent watering, and weekly scouting for powdery mildew." },
            { name: "Diseased (Mixed)", type: "Fungal", pathogen: "Pseudoperonospora / Podosphaera spp.", imageCount: 335, severity: "High", symptoms: "Angular, water-soaked lesions or powdery coating; yellowing and vine decline.", treatment: "Apply chlorothalonil or cymoxanil. Use resistant varieties. Improve drainage." },
            { name: "Rotten", type: "Rotten", pathogen: "Pythium / Botrytis spp.", imageCount: 491, severity: "High", symptoms: "Soft, water-soaked rot at blossom end or on fruit surface; rapid collapse.", treatment: "Avoid over-watering, improve drainage, apply preventive fungicides." },
        ],
    },
    {
        name: "Guava", scientificName: "Psidium guajava", totalImages: 819,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 477, healthy: true, severity: "Low", symptoms: "Firm, green leaves with no spots; normal branching and fruit set.", treatment: "Balanced fertilization, proper pruning, and monitoring for wilt pathogens." },
            { name: "Diseased (Mixed)", type: "Fungal", pathogen: "Colletotrichum / Pestalotiopsis spp.", imageCount: 142, severity: "Medium", symptoms: "Anthracnose lesions, leaf spots, fruit blotches and premature drop.", treatment: "Copper-based fungicides, proper canopy management, and remove infected fruit." },
            { name: "Rotten", type: "Rotten", pathogen: "Post-harvest fungi", imageCount: 200, severity: "High", symptoms: "Soft spots on fruit expanding to full fruit collapse with mold growth.", treatment: "Wax coating, cool storage, ethylene management post-harvest." },
        ],
    },
    {
        name: "Jamun", scientificName: "Syzygium cumini", totalImages: 624,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 279, healthy: true, severity: "Low", symptoms: "Glossy, dark green leaves; vigorous growth with no spots or cankers.", treatment: "Pruning for light penetration, irrigation management, and phosphorus nutrition." },
            { name: "Diseased (Mixed)", type: "Fungal", pathogen: "Pestalotiopsis / Colletotrichum spp.", imageCount: 345, severity: "Medium", symptoms: "Leaf spots, twig dieback, and fruit anthracnose with dark sunken lesions.", treatment: "Apply copper fungicides, remove infected parts, and improve canopy ventilation." },
        ],
    },
    {
        name: "Jujube", scientificName: "Ziziphus jujuba", totalImages: 400,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 200, healthy: true, severity: "Low", symptoms: "Bright green ovate leaves; firm, blemish-free fruit.", treatment: "Adequate zinc and boron, pruning for structure, monitor for witches' broom." },
            { name: "Rotten", type: "Rotten", pathogen: "Post-harvest pathogens", imageCount: 200, severity: "High", symptoms: "Shriveling, dark discoloration, and fungal growth on stored fruit.", treatment: "Low-temperature storage, controlled atmosphere, antifungal coatings." },
        ],
    },
    {
        name: "Lemon", scientificName: "Citrus limon", totalImages: 236,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 159, healthy: true, severity: "Low", symptoms: "Glossy, elliptic leaves; well-formed aromatic fruit.", treatment: "Balanced citrus fertilizer, drip irrigation, and psyllid monitoring." },
            { name: "Diseased (Mixed)", type: "Bacterial", pathogen: "Candidatus Liberibacter / Xanthomonas spp.", imageCount: 77, severity: "High", symptoms: "Blotchy mottle, canker lesions on leaves and fruit, and yellowing shoots.", treatment: "Remove infected trees, control psyllid and canker vectors, use certified stock." },
        ],
    },
    {
        name: "Mango", scientificName: "Mangifera indica", totalImages: 1588,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 739, healthy: true, severity: "Low", symptoms: "Lanceolate leaves with bronze-red flush turning dark green; no spots.", treatment: "Balanced NPK + micronutrients, canopy management, and anthracnose prevention at flowering." },
            { name: "Diseased (Mixed)", type: "Fungal", pathogen: "Colletotrichum gloeosporioides / Oidium mangiferae", imageCount: 265, severity: "High", symptoms: "Anthracnose dark lesions on leaves and fruit; powdery mildew on panicles.", treatment: "Apply propiconazole or carbendazim. Prune for airflow. Sulphur spray at pre-flowering." },
            { name: "Rotten", type: "Rotten", pathogen: "Aspergillus / Fusarium spp.", imageCount: 584, severity: "High", symptoms: "Stem-end rot, spongy flesh, and off-odor in stored mangoes.", treatment: "Hot water treatment (52°C for 5 min), wax coating, and cold-chain management." },
        ],
    },
    {
        name: "Orange", scientificName: "Citrus sinensis", totalImages: 1199,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 598, healthy: true, severity: "Low", symptoms: "Glossy, dark green leaves; firm, uniformly colored fruit.", treatment: "Citrus-balanced fertilizer, drip irrigation, and regular psyllid monitoring." },
            { name: "Rotten", type: "Rotten", pathogen: "Penicillium / Geotrichum spp.", imageCount: 601, severity: "High", symptoms: "Green or blue mold on fruit surface; water-soaked, collapsing flesh.", treatment: "Fungicide dips post-harvest, proper storage humidity, and ethylene management." },
        ],
    },
    {
        name: "Peach", scientificName: "Prunus persica", totalImages: 971,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 363, healthy: true, severity: "Low", symptoms: "Long, lanceolate green leaves without shot-hole lesions. Normal fruit set.", treatment: "Winter dormant oil, proper irrigation, and calcium sprays to maintain cell integrity." },
            { name: "Bacterial Spot", type: "Bacterial", pathogen: "Xanthomonas arboricola pv. pruni", imageCount: 608, severity: "High", symptoms: "Water-soaked lesions turning angular, purple to brown; shot-hole appearance; fruit spots and cracking.", treatment: "Copper-based bactericides combined with mancozeb. Prune for drying. Plant resistant varieties." },
        ],
    },
    {
        name: "Pomegranate", scientificName: "Punica granatum", totalImages: 959,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 487, healthy: true, severity: "Low", symptoms: "Glossy, lanceolate leaves; bright red fruit with no cracks.", treatment: "Drip irrigation, potassium for fruit quality, and prune for open canopy." },
            { name: "Diseased (Mixed)", type: "Fungal", pathogen: "Colletotrichum / Alternaria spp.", imageCount: 272, severity: "Medium", symptoms: "Leaf spots, fruit blotch, and premature drop with dark sunken lesions.", treatment: "Copper fungicides, mancozeb sprays, and careful irrigation management." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis / Aspergillus spp.", imageCount: 200, severity: "High", symptoms: "Soft, brown patches on fruit; visible mold and fermented odor.", treatment: "Early harvest, antifungal wax coatings, and cool storage." },
        ],
    },
    {
        name: "Potato", scientificName: "Solanum tuberosum", totalImages: 3432,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 1284, healthy: true, severity: "Low", symptoms: "Vigorous deep green foliage, no necrotic spots or water-soaked lesions. Normal tuber development.", treatment: "Maintain hilling, proper soil moisture, and scout for aphids (vectors of viruses)." },
            { name: "Early Blight", type: "Fungal", pathogen: "Alternaria solani", imageCount: 1166, severity: "Medium", symptoms: "Dark brown concentric rings ('target spots') on older leaves; yellowing and premature defoliation.", treatment: "Apply chlorothalonil or mancozeb every 7-10 days. Rotate crops and use resistant varieties." },
            { name: "Late Blight", type: "Oomycete", pathogen: "Phytophthora infestans", imageCount: 1158, severity: "Critical", symptoms: "Large water-soaked dark green to black lesions; white fungal growth on leaf undersides; rapid plant collapse.", treatment: "Metalaxyl or phosphonate fungicides. Destroy infected plants immediately. Use certified seed potatoes." },
            { name: "Rotten", type: "Rotten", pathogen: "Erwinia / Fusarium spp.", imageCount: 466, severity: "High", symptoms: "Tuber soft rot, slimy decay, and foul odor; black leg on stems.", treatment: "Use certified disease-free seed, cool storage, and avoid wounding at harvest." },
        ],
    },
    {
        name: "Rice", scientificName: "Oryza sativa", totalImages: 4184,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 1039, healthy: true, severity: "Low", symptoms: "Erect, green tillers with no discoloration or lesions. Normal panicle development.", treatment: "Balanced N-P-K, water management, and integrated pest management." },
            { name: "Brown Spot", type: "Fungal", pathogen: "Bipolaris oryzae", imageCount: 807, severity: "Medium", symptoms: "Oval to circular brown spots with gray-white centers on leaves and glumes.", treatment: "Apply tricyclazole or propiconazole. Use tolerant varieties and balanced potassium." },
            { name: "Leaf Blast", type: "Fungal", pathogen: "Magnaporthe oryzae", imageCount: 929, severity: "High", symptoms: "Diamond-shaped gray lesions with brown borders; rapid leaf death in humid conditions.", treatment: "Tricyclazole or isoprothiolane fungicides. Resistant varieties. Avoid excess nitrogen." },
            { name: "Neck Blast", type: "Fungal", pathogen: "Magnaporthe oryzae", imageCount: 938, severity: "Critical", symptoms: "Brown lesion at panicle neck causes grain sterility and whiteheads; severe yield loss.", treatment: "Spray tricyclazole at heading stage. Use resistant cultivars and balanced nutrition." },
            { name: "Hispa", type: "Pest", pathogen: "Dicladispa armigera", imageCount: 471, severity: "Medium", symptoms: "White parallel streaks on leaves caused by larval mining; scraping damage by adults.", treatment: "Spray carbaryl or chlorpyrifos. Clip and destroy affected tillers. Monitor fields early." },
        ],
    },
    {
        name: "Soybean", scientificName: "Glycine max", totalImages: 2180,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 632, healthy: true, severity: "Low", symptoms: "Trifoliate leaves with uniform green color, no rust pustules or blight symptoms.", treatment: "Crop rotation, seed treatment with fungicides, and optimal planting date." },
            { name: "Bacterial Blight", type: "Bacterial", pathogen: "Pseudomonas savastanoi pv. glycinea", imageCount: 56, severity: "Medium", symptoms: "Angular, water-soaked spots with yellow halos on leaves; spots dry to brown.", treatment: "Use resistant varieties, copper-based bactericides, and avoid working wet fields." },
            { name: "Caterpillar Damage", type: "Pest", pathogen: "Anticarsia gemmatalis", imageCount: 613, severity: "High", symptoms: "Ragged leaf edges, defoliation from leaf margins; larvae visible on leaves.", treatment: "Bacillus thuringiensis (Bt) sprays, pyrethroids. Monitor with sweep nets weekly." },
            { name: "Diabrotica Damage", type: "Pest", pathogen: "Diabrotica speciosa", imageCount: 603, severity: "High", symptoms: "Round holes in leaves from adult feeding; root feeding by larvae causes lodging.", treatment: "Crop rotation to break beetle cycle. Soil insecticides for larval control." },
            { name: "Downy Mildew", type: "Fungal", pathogen: "Peronospora manshurica", imageCount: 50, severity: "Medium", symptoms: "Pale green to yellow spots on upper leaf; grayish-purple downy growth below.", treatment: "Use metalaxyl-treated seed. Apply mancozeb at first symptoms. Plant resistant varieties." },
            { name: "Mosaic Virus", type: "Viral", pathogen: "Soybean mosaic virus (SMV)", imageCount: 22, severity: "Medium", symptoms: "Mosaic mottling, leaf distortion, and stunted plants with reduced pod set.", treatment: "Use virus-free seed, control aphid vectors, and rogue infected plants early." },
            { name: "Powdery Mildew", type: "Fungal", pathogen: "Microsphaera diffusa", imageCount: 77, severity: "Low", symptoms: "White powdery growth on upper leaf surface; premature yellowing and defoliation.", treatment: "Apply sulfur or myclobutanil. Increase plant spacing for better air circulation." },
            { name: "Rust", type: "Fungal", pathogen: "Phakopsora pachyrhizi", imageCount: 65, severity: "High", symptoms: "Tan to reddish-brown pustules on lower leaf surface; rapid defoliation.", treatment: "Triazole fungicides (tebuconazole) at first symptoms. Scout frequently from R1 stage." },
            { name: "Southern Blight", type: "Fungal", pathogen: "Sclerotium rolfsii", imageCount: 62, severity: "High", symptoms: "White mycelial mat at soil line; mustard-seed sclerotia; sudden wilting and death.", treatment: "Crop rotation, deep tillage, PCNB soil treatment, and trichoderma biocontrols." },
        ],
    },
    {
        name: "Strawberry", scientificName: "Fragaria × ananassa", totalImages: 2115,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 988, healthy: true, severity: "Low", symptoms: "Bright green trifoliate leaves, no spots or purpling. Healthy, vigorous runners.", treatment: "Mulch with straw, maintain soil pH 6.0-6.5, apply balanced fertilizer." },
            { name: "Leaf Scorch", type: "Fungal", pathogen: "Diplocarpon earlianum", imageCount: 563, severity: "Medium", symptoms: "Dark purple spots enlarging to tan centers with purple margins; entire leaf may scorch.", treatment: "Apply captan or thiram fungicides after renovation. Remove infected leaves, use drip irrigation." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis cinerea", imageCount: 564, severity: "High", symptoms: "Gray mold on fruit; soft, brown, water-soaked tissue; rapid spread in humid conditions.", treatment: "Cyprodinil + fludioxonil fungicides. Remove infected fruit immediately. Improve air circulation." },
        ],
    },
    {
        name: "Sugarcane", scientificName: "Saccharum officinarum", totalImages: 596,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 180, healthy: true, severity: "Low", symptoms: "Tall, erect canes with wide, green leaf blades and no lesions.", treatment: "Balanced NPK, adequate irrigation, and use of certified disease-free ratoons." },
            { name: "Bacterial Blight", type: "Bacterial", pathogen: "Xanthomonas albilineans", imageCount: 100, severity: "High", symptoms: "White to cream leaf stripes running full leaf length; leaf scalding and wilting.", treatment: "Use disease-free planting material, hot-water treatment of setts, and resistant varieties." },
            { name: "Red Rot", type: "Fungal", pathogen: "Colletotrichum falcatum", imageCount: 171, severity: "Critical", symptoms: "Red discoloration of internal stalk tissue with white patches; sour smell; stalk drying.", treatment: "Hot-water seed treatment, crop rotation, resistant varieties, and fungicide seed treatment." },
            { name: "Red Stripe", type: "Bacterial", pathogen: "Acidovorax avenae subsp. avenae", imageCount: 53, severity: "Medium", symptoms: "Water-soaked red to orange stripes on leaf blade; necrosis under severe conditions.", treatment: "Use clean planting material, avoid wounds, and apply copper bactericides." },
            { name: "Rust", type: "Fungal", pathogen: "Puccinia melanocephala", imageCount: 92, severity: "Medium", symptoms: "Orange-brown pustules on leaf surfaces; severe infection causes leaf death.", treatment: "Resistant varieties, triazole fungicides. Monitor closely during humid seasons." },
        ],
    },
    {
        name: "Tea", scientificName: "Camellia sinensis", totalImages: 1917,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 222, healthy: true, severity: "Low", symptoms: "Glossy, dark green young shoots with no lesions or discoloration.", treatment: "Shade management, balanced NPK, regular plucking for rejuvenation." },
            { name: "Algal Leaf Spot", type: "Fungal", pathogen: "Cephaleuros virescens", imageCount: 339, severity: "Low", symptoms: "Orange-red powdery spots on leaves and stems; superficial algal growth.", treatment: "Copper fungicides, pruning for light and air penetration, and nitrogen management." },
            { name: "Anthracnose", type: "Fungal", pathogen: "Colletotrichum camelliae", imageCount: 300, severity: "Medium", symptoms: "Gray to brown irregular lesions on leaves and blister blight on shoots.", treatment: "Copper oxychloride sprays, remove infected shoots, improve drainage." },
            { name: "Bird Eye Spot", type: "Fungal", pathogen: "Cercospora theae", imageCount: 297, severity: "Medium", symptoms: "Small circular spots with light gray center and dark brown border on leaves.", treatment: "Copper-based fungicides, avoid nitrogen excess, and improve canopy airflow." },
            { name: "Brown Blight", type: "Fungal", pathogen: "Colletotrichum gloeosporioides", imageCount: 339, severity: "Medium", symptoms: "Brown, water-soaked blighting of young shoots; stem cankers and dieback.", treatment: "Fungicide (thiophanate-methyl), pruning to remove blighted shoots, improve drainage." },
            { name: "Red Leaf Spot", type: "Fungal", pathogen: "Didymella theae", imageCount: 420, severity: "High", symptoms: "Large reddish-brown blotches on mature leaves; defoliation under severe infection.", treatment: "Copper or carbendazim fungicides. Remove severely affected leaves. Balanced nutrition." },
        ],
    },
    {
        name: "Tomato", scientificName: "Solanum lycopersicum", totalImages: 10983,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 2018, healthy: true, severity: "Low", symptoms: "Uniform green leaves, no mottling or lesions. Vigorous growth and normal fruit set.", treatment: "Regular staking, consistent watering, beneficial insect habitat, and balanced fertilization." },
            { name: "Bacterial Spot", type: "Bacterial", pathogen: "Xanthomonas perforans", imageCount: 1124, severity: "High", symptoms: "Small dark oily spots with yellow halos on leaves and fruit; defoliation from bottom upward.", treatment: "Copper + mancozeb rotations, use pathogen-free seed, avoid overhead irrigation, prune lower leaves." },
            { name: "Early Blight", type: "Fungal", pathogen: "Alternaria solani", imageCount: 967, severity: "Medium", symptoms: "Concentric bullseye spots on older leaves; yellowing, defoliation, stem lesions and collar rot.", treatment: "Chlorothalonil, mancozeb, or copper fungicides. Mulch to reduce soil splash, stake plants for airflow." },
            { name: "Late Blight", type: "Oomycete", pathogen: "Phytophthora infestans", imageCount: 1105, severity: "Critical", symptoms: "Greasy water-soaked lesions on leaves and stems; white sporulation under humidity; rapid plant death.", treatment: "Metalaxyl, cyazofamid, or mandipropamid. Destroy infected plants immediately. Use resistant varieties." },
            { name: "Leaf Mold", type: "Fungal", pathogen: "Passalora fulva", imageCount: 949, severity: "Medium", symptoms: "Pale green to yellow spots on upper leaf; olive-green to brown velvety mold below; leaves curl and die.", treatment: "Improve air circulation, reduce humidity, apply chlorothalonil or copper. Use resistant cultivars." },
            { name: "Mosaic Virus", type: "Viral", pathogen: "Tomato mosaic virus (ToMV)", imageCount: 547, severity: "Medium", symptoms: "Mottled light and dark green patches; leaf distortion; fern-like growth; reduced yield.", treatment: "Use virus-free seed, disinfect tools, rotate crops. No cure; remove infected plants." },
            { name: "Rotten", type: "Rotten", pathogen: "Botrytis / Fusarium spp.", imageCount: 488, severity: "High", symptoms: "Gray mold on fruit, blossom-end rot, or crown rot with rapid fruit collapse.", treatment: "Calcium sprays for BER, fungicides for gray mold. Consistent watering. Improve air flow." },
            { name: "Septoria Leaf Spot", type: "Fungal", pathogen: "Septoria lycopersici", imageCount: 1094, severity: "High", symptoms: "Small circular spots with dark margins and gray centers (pycnidia); lower leaves yellow and drop.", treatment: "Chlorothalonil or mancozeb every 7-10 days. Remove infected leaves, stake plants, rotate crops." },
            { name: "Spider Mites", type: "Pest", pathogen: "Tetranychus urticae", imageCount: 1078, severity: "Medium", symptoms: "Stippling (tiny yellow/white dots) on leaves; fine webbing on undersides; leaves bronze and drop.", treatment: "Release predatory mites (Phytoseiulus persimilis). Use insecticidal soap or abamectin." },
            { name: "Target Spot", type: "Fungal", pathogen: "Corynespora cassiicola", imageCount: 909, severity: "High", symptoms: "Dark circular lesions with concentric rings (target pattern); coalescing causing severe defoliation.", treatment: "Apply boscalid or pyraclostrobin. Reduce leaf wetness, improve air circulation." },
            { name: "Yellow Leaf Curl Virus", type: "Viral", pathogen: "Tomato yellow leaf curl virus (TYLCV)", imageCount: 1183, severity: "High", symptoms: "Severe stunting, leaf curling upward, yellowing leaf margins, reduced fruit set. Transmitted by whiteflies.", treatment: "Control whiteflies (imidacloprid, cyantraniliprole). Resistant varieties (Ty genes), insect netting." },
        ],
    },
    {
        name: "Wheat", scientificName: "Triticum aestivum", totalImages: 3014,
        diseases: [
            { name: "Healthy", type: "Healthy", pathogen: "N/A", imageCount: 985, healthy: true, severity: "Low", symptoms: "Erect, blue-green leaves; no rust pustules or mold. Uniform tillering and heading.", treatment: "Balanced nitrogen, correct seeding date, and scout from tillering stage." },
            { name: "Brown Rust", type: "Fungal", pathogen: "Puccinia triticina", imageCount: 941, severity: "High", symptoms: "Small, circular to oval orange-brown pustules on upper leaf surface; rapid spread.", treatment: "Triazole fungicides (tebuconazole, propiconazole). Plant resistant varieties. Spray at first sign." },
            { name: "Septoria", type: "Fungal", pathogen: "Zymoseptoria tritici", imageCount: 97, severity: "High", symptoms: "Pale green-yellow lesions with tan centers and black pycnidia on leaves; defoliation.", treatment: "Triazole + strobilurin mixtures. Use resistant varieties. Apply at flag leaf stage." },
            { name: "Yellow Rust", type: "Fungal", pathogen: "Puccinia striiformis", imageCount: 991, severity: "Critical", symptoms: "Bright yellow-orange pustules in stripe pattern along leaf veins; cool-weather epidemic risk.", treatment: "Propiconazole or tebuconazole at first symptoms. Monitor forecast systems. Resistant varieties." },
        ],
    },
];

// ─── Computed Stats ────────────────────────────────────────────────────────────
const TOTAL_CROPS    = cropsData.length;
const TOTAL_IMAGES   = cropsData.reduce((a, c) => a + c.totalImages, 0);
const TOTAL_CLASSES  = cropsData.reduce((a, c) => a + c.diseases.length, 0);
const TOTAL_DISEASES = cropsData.reduce((a, c) => a + c.diseases.filter(d => !d.healthy).length, 0);
const TOTAL_HEALTHY  = TOTAL_CLASSES - TOTAL_DISEASES;

// ─── Style Helpers ────────────────────────────────────────────────────────────
const TYPE_STYLES: Record<string, { badge: string; dot: string; label: string }> = {
    Fungal:             { badge: "bg-amber-100 text-amber-800",   dot: "bg-amber-500",  label: "Fungal" },
    Bacterial:          { badge: "bg-red-100 text-red-800",       dot: "bg-red-500",    label: "Bacterial" },
    Viral:              { badge: "bg-purple-100 text-purple-800", dot: "bg-purple-500", label: "Viral" },
    Pest:               { badge: "bg-orange-100 text-orange-800", dot: "bg-orange-400", label: "Pest" },
    Oomycete:           { badge: "bg-blue-100 text-blue-800",     dot: "bg-blue-500",   label: "Oomycete" },
    Rotten:             { badge: "bg-stone-100 text-stone-700",   dot: "bg-stone-400",  label: "Rotten" },
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
    return <Badge className={`${s.badge} border-0 text-xs font-medium hover:${s.badge}`}>{s.label}</Badge>;
}
function SevBadge({ severity }: { severity: string }) {
    return <Badge className={`${SEV_STYLES[severity]} border-0 text-xs font-medium`}>{severity}</Badge>;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
// function StatCard({ icon, value, label, sub }: { icon: React.ReactNode; value: string; label: string; sub?: string }) {
//     return (
//         <motion.div
//             whileHover={{ y: -3, boxShadow: T.shadowHov }}
//             className="rounded-2xl p-5 flex flex-col gap-3"
//             style={{ background: T.glass, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)", boxShadow: T.shadow }}
//         >
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(10,123,74,0.1)" }}>
//                 <span style={{ color: T.primary }}>{icon}</span>
//             </div>
//             <div>
//                 <p className="text-3xl font-bold" style={{ color: T.textPrimary, fontFamily: "var(--font-plus-jakarta, inherit)" }}>{value}</p>
//                 <p className="text-sm font-semibold mt-0.5" style={{ color: T.primary }}>{label}</p>
//                 {sub && <p className="text-xs mt-0.5" style={{ color: T.textSecond }}>{sub}</p>}
//             </div>
//         </motion.div>
//     );
// }

function CropCard({ crop }: { crop: Crop }) {
    const [open, setOpen] = useState<string | null>(null);
    const healthyCount  = crop.diseases.filter(d => d.healthy).length;
    const diseaseCount  = crop.diseases.filter(d => !d.healthy).length;
    const hasHealthy    = healthyCount > 0;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
            <Card
                className="h-full flex flex-col rounded-2xl overflow-hidden border-0"
                style={{ background: T.glass, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)", boxShadow: T.shadow }}
            >
                {/* Card Header */}
                <CardHeader className="pb-3 pt-5 px-5">
                    <div className="flex justify-between items-start gap-2">
                        <div>
                            <CardTitle className="text-base font-700 leading-tight" style={{ color: T.textPrimary, fontFamily: "var(--font-plus-jakarta, inherit)" }}>
                                {crop.name}
                            </CardTitle>
                            <p className="text-xs italic mt-0.5" style={{ color: T.textSecond }}>{crop.scientificName}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap" style={{ background: "rgba(10,123,74,0.1)", color: T.primary }}>
                            {crop.diseases.length} classes
                        </span>
                    </div>

                    {/* Progress bar and image count */}
                    <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1" style={{ color: T.textSecond }}>
                            <span>{crop.totalImages.toLocaleString()} images</span>
                            <span>{diseaseCount} disease{diseaseCount !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(10,123,74,0.12)" }}>
                            <div
                                className="h-1.5 rounded-full transition-all"
                                style={{
                                    width: `${Math.min(100, (crop.totalImages / 11000) * 100)}%`,
                                    background: `linear-gradient(90deg, ${T.primary}, #10B981)`,
                                }}
                            />
                        </div>
                    </div>

                    <div className="mt-2">
                        {hasHealthy ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.12)", color: "#065f46" }}>
                                <CheckCircle className="w-3 h-3" /> Healthy baseline included
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.12)", color: "#92400e" }}>
                                <AlertCircle className="w-3 h-3" /> No healthy baseline
                            </span>
                        )}
                    </div>
                </CardHeader>

                {/* Disease list */}
                <CardContent className="flex-1 px-5 pb-5 space-y-1">
                    {crop.diseases.map((disease) => {
                        const isOpen = open === disease.name;
                        const s = TYPE_STYLES[disease.type] ?? TYPE_STYLES.Fungal;
                        return (
                            <div key={disease.name} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                                <button
                                    onClick={() => setOpen(isOpen ? null : disease.name)}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-white/40"
                                >
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${s.dot}`} />
                                    <span className="flex-1 text-sm font-semibold" style={{ color: T.textPrimary }}>{disease.name}</span>
                                    <span className="text-xs" style={{ color: T.textSecond }}>{disease.imageCount.toLocaleString()}</span>
                                    <ChevronRight
                                        className="w-3.5 h-3.5 shrink-0 transition-transform"
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
                                            <div className="px-4 pb-3 pt-1 space-y-2" style={{ background: "rgba(245,250,240,0.6)" }}>
                                                {!disease.healthy && (
                                                    <p className="text-xs" style={{ color: T.textSecond }}>
                                                        <span className="font-semibold" style={{ color: T.textPrimary }}>Symptoms: </span>
                                                        {disease.symptoms}
                                                    </p>
                                                )}
                                                <p className="text-xs" style={{ color: T.textSecond }}>
                                                    <span className="font-semibold" style={{ color: T.textPrimary }}>Treatment: </span>
                                                    {disease.treatment}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5 pt-0.5">
                                                    <TypeBadge type={disease.type} />
                                                    <SevBadge severity={disease.severity} />
                                                    {disease.pathogen !== "N/A" && (
                                                        <span className="text-xs italic" style={{ color: T.textSecond }}>
                                                            {disease.pathogen}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
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
        visible: { transition: { staggerChildren: 0.04 } },
    };
    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    };

    // All diseases flattened for table
    const allDiseases = cropsData.flatMap(crop =>
        crop.diseases.map(d => ({ ...d, cropName: crop.name }))
    );

    return (
        <main
            className="min-h-screen"
            style={{ fontFamily: "var(--font-plus-jakarta, 'Plus Jakarta Sans', sans-serif)" }}
        >
            {/* Background */}
            <div className="fixed inset-0 -z-10" style={{
                background: "linear-gradient(135deg, #EFF5EA 0%, #F4F8F0 45%, #E8F3E0 100%)",
            }} />
            {/* Subtle decorative blobs */}
            <div className="fixed top-0 right-0 -z-10 w-96 h-96 rounded-full opacity-20"
                style={{ background: `radial-gradient(circle, ${T.primary} 0%, transparent 70%)`, filter: "blur(80px)" }} />
            <div className="fixed bottom-0 left-0 -z-10 w-80 h-80 rounded-full opacity-15"
                style={{ background: `radial-gradient(circle, #10B981 0%, transparent 70%)`, filter: "blur(80px)" }} />

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

                {/* ── Hero ─────────────────────────────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="mb-12"
                >
                    <div className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
                        style={{ background: T.glass, border: `1px solid ${T.borderMed}`, backdropFilter: "blur(16px)", boxShadow: "0 12px 40px rgba(10,123,74,0.1)" }}>

                        {/* Decorative leaf */}
                        <div className="absolute right-8 top-6 opacity-[0.07]">
                            <Leaf className="w-48 h-48" style={{ color: T.primary }} />
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                                    style={{ background: "rgba(10,123,74,0.1)", color: T.primary, border: `1px solid rgba(10,123,74,0.2)` }}>
                                    <Sprout className="w-3.5 h-3.5" />
                                    AgroLeaf AI · Crop Disease Intelligence
                                </div>

                                <h1 className="text-4xl md:text-5xl font-800 leading-tight mb-4"
                                    style={{ color: T.textPrimary, letterSpacing: "-0.02em" }}>
                                    {TOTAL_CROPS} Crops.{" "}
                                    <span style={{ color: T.primary }}>{TOTAL_CLASSES} Classes.</span>
                                    <br className="hidden md:block" /> Instant AI Detection.
                                </h1>
                                <p className="text-base md:text-lg max-w-2xl leading-relaxed" style={{ color: T.textSecond }}>
                                    AgroLeaf AI identifies diseases across the most common food crops worldwide —
                                    trained on <strong style={{ color: T.textPrimary }}>{TOTAL_IMAGES.toLocaleString()}+ images</strong> spanning{" "}
                                    <strong style={{ color: T.textPrimary }}>{TOTAL_DISEASES} disease conditions</strong> and{" "}
                                    <strong style={{ color: T.textPrimary }}>{TOTAL_HEALTHY} healthy baselines</strong>.
                                </p>
                            </div>

                            {/* Big circular stat */}
                            <div className="shrink-0 flex flex-col items-center justify-center w-40 h-40 rounded-full"
                                style={{ background: `rgba(10,123,74,0.08)`, border: `2px solid rgba(10,123,74,0.2)` }}>
                                <p className="text-4xl font-800" style={{ color: T.primary }}>{TOTAL_IMAGES.toLocaleString()}</p>
                                <p className="text-xs font-semibold mt-1 text-center leading-tight px-4" style={{ color: T.textSecond }}>Training<br />Images</p>
                            </div>
                        </div>

                        {/* Stat row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
                            {[
                                { icon: <Leaf className="w-5 h-5" />, v: TOTAL_CROPS, l: "Crops" },
                                { icon: <AlertCircle className="w-5 h-5" />, v: TOTAL_DISEASES, l: "Disease Classes" },
                                { icon: <CheckCircle className="w-5 h-5" />, v: TOTAL_HEALTHY, l: "Healthy Baselines" },
                                { icon: <Database className="w-5 h-5" />, v: TOTAL_CLASSES, l: "Total Classes" },
                            ].map(s => (
                                <div key={s.l} className="flex items-center gap-3 rounded-xl px-4 py-3"
                                    style={{ background: "rgba(255,255,255,0.55)", border: `1px solid ${T.border}` }}>
                                    <span style={{ color: T.primary }}>{s.icon}</span>
                                    <div>
                                        <p className="text-xl font-700" style={{ color: T.textPrimary }}>{s.v}</p>
                                        <p className="text-xs" style={{ color: T.textSecond }}>{s.l}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* ── Crop Directory ────────────────────────────────────────────── */}
                <section className="mb-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <h2 className="text-2xl font-800" style={{
                            color: T.textPrimary,
                            borderLeft: `4px solid ${T.primary}`,
                            paddingLeft: "1rem",
                        }}>
                            Crop Directory
                        </h2>
                        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.textSecond }} />
                                <Input
                                    placeholder="Search crops or diseases…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-9 pr-8 rounded-xl text-sm h-10 border-0 focus-visible:ring-1"
                                    style={{
                                        background: T.glass,
                                        border: `1px solid ${T.border}`,
                                        color: T.textPrimary,
                                        outline: `1px solid ${T.primary}`,
                                    }}
                                />
                                {search && (
                                    <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                        <X className="w-3.5 h-3.5" style={{ color: T.textSecond }} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Filter chips */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                                style={activeFilter === f
                                    ? { background: T.primary, color: "#fff", border: `1px solid ${T.primary}` }
                                    : { background: T.glass, color: T.textSecond, border: `1px solid ${T.border}`, backdropFilter: "blur(8px)" }
                                }
                            >
                                {f}
                            </button>
                        ))}
                        <span className="ml-auto text-xs flex items-center" style={{ color: T.textSecond }}>
                            {filtered.length} of {TOTAL_CROPS} crops
                        </span>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {filtered.map(crop => (
                            <motion.div key={crop.name} variants={cardVariants}>
                                <CropCard crop={crop} />
                            </motion.div>
                        ))}
                    </motion.div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20" style={{ color: T.textSecond }}>
                            <Sprout className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="font-medium">No crops match your search.</p>
                            <button onClick={() => { setSearch(""); setActiveFilter("All"); }} className="text-sm mt-2 underline" style={{ color: T.primary }}>
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>

                {/* ── Dataset Composition ──────────────────────────────────────── */}
                <section className="mb-16">
                    <h2 className="text-2xl font-800 mb-6" style={{ color: T.textPrimary, borderLeft: `4px solid ${T.primary}`, paddingLeft: "1rem" }}>
                        Dataset Composition by Crop
                    </h2>
                    <div className="rounded-2xl overflow-hidden" style={{ background: T.glass, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)", boxShadow: T.shadow }}>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow style={{ borderBottom: `1px solid ${T.border}`, background: "rgba(10,123,74,0.04)" }}>
                                        {["Crop", "Scientific Name", "Total Images", "Classes", "Has Healthy", "Top Disease"].map(h => (
                                            <TableHead key={h} className="text-xs font-700 uppercase tracking-wide" style={{ color: T.textPrimary }}>{h}</TableHead>
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
                                                style={{ borderBottom: `1px solid rgba(10,123,74,0.07)` }}
                                                className="transition-colors hover:bg-white/40"
                                            >
                                                <TableCell className="font-semibold text-sm" style={{ color: T.textPrimary }}>
                                                    <span className="mr-2 text-xs" style={{ color: T.textSecond }}>{i + 1}.</span>
                                                    {crop.name}
                                                </TableCell>
                                                <TableCell className="text-xs italic" style={{ color: T.textSecond }}>{crop.scientificName}</TableCell>
                                                <TableCell className="font-semibold text-sm" style={{ color: T.primary }}>{crop.totalImages.toLocaleString()}</TableCell>
                                                <TableCell className="text-sm" style={{ color: T.textSecond }}>{crop.diseases.length}</TableCell>
                                                <TableCell>
                                                    {hasHealthy
                                                        ? <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.12)", color: "#065f46" }}><CheckCircle className="w-3 h-3" /> Yes</span>
                                                        : <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.1)", color: "#92400e" }}><AlertCircle className="w-3 h-3" /> No</span>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {topDisease ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs" style={{ color: T.textSecond }}>{topDisease.name}</span>
                                                            <TypeBadge type={topDisease.type} />
                                                        </div>
                                                    ) : <span className="text-xs" style={{ color: T.textSecond }}>—</span>}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </section>

                {/* ── Disease Quick-Reference ──────────────────────────────────── */}
                <section className="mb-16">
                    <h2 className="text-2xl font-800 mb-6" style={{ color: T.textPrimary, borderLeft: `4px solid ${T.primary}`, paddingLeft: "1rem" }}>
                        Disease Quick-Reference
                    </h2>
                    <div className="rounded-2xl overflow-hidden" style={{ background: T.glass, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)", boxShadow: T.shadow }}>
                        <div className="overflow-x-auto max-h-130">
                            <Table>
                                <TableHeader className="sticky top-0" style={{ background: "rgba(245,250,240,0.95)", backdropFilter: "blur(8px)" }}>
                                    <TableRow style={{ borderBottom: `1px solid ${T.border}` }}>
                                        {["#", "Crop", "Condition", "Type", "Severity", "Images", "Pathogen"].map(h => (
                                            <TableHead key={h} className="text-xs font-700 uppercase tracking-wide" style={{ color: T.textPrimary }}>{h}</TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allDiseases.filter(d => !d.healthy).map((d, i) => (
                                        <TableRow
                                            key={`${d.cropName}-${d.name}`}
                                            style={{ borderBottom: "1px solid rgba(10,123,74,0.07)" }}
                                            className="transition-colors hover:bg-white/40"
                                        >
                                            <TableCell className="text-xs w-8" style={{ color: T.textSecond }}>{i + 1}</TableCell>
                                            <TableCell className="font-semibold text-sm" style={{ color: T.textPrimary }}>{d.cropName}</TableCell>
                                            <TableCell className="text-sm" style={{ color: T.textSecond }}>{d.name}</TableCell>
                                            <TableCell><TypeBadge type={d.type} /></TableCell>
                                            <TableCell><SevBadge severity={d.severity} /></TableCell>
                                            <TableCell className="font-semibold text-sm" style={{ color: T.primary }}>{d.imageCount.toLocaleString()}</TableCell>
                                            <TableCell className="text-xs italic max-w-40 truncate" style={{ color: T.textSecond }}>{d.pathogen}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="px-4 py-3 text-right text-xs" style={{ color: T.textSecond, borderTop: `1px solid ${T.border}` }}>
                            {TOTAL_DISEASES} disease classes shown · scroll to view all
                        </div>
                    </div>
                </section>

                {/* ── Image Guidelines ─────────────────────────────────────────── */}
                <section className="mb-16">
                    <h2 className="text-2xl font-800 mb-6" style={{ color: T.textPrimary, borderLeft: `4px solid ${T.primary}`, paddingLeft: "1rem" }}>
                        Image Guidelines for Best Results
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { icon: <Camera className="w-5 h-5" />, title: "Close-up single leaf", desc: "Photograph one leaf per image — avoid bunches. Fill the frame for maximum detail." },
                            { icon: <Zap className="w-5 h-5" />, title: "Natural daylight", desc: "Shoot outdoors in diffuse daylight. Avoid flash, shadows, and artificial color casts." },
                            { icon: <Shield className="w-5 h-5" />, title: "Minimum 256 × 256 px", desc: "Higher resolution improves accuracy. Our model was trained on images ≥256px per side." },
                            { icon: <TrendingUp className="w-5 h-5" />, title: "Both leaf surfaces", desc: "Include upper and lower leaf surfaces where possible — many diseases appear on undersides first." },
                        ].map(g => (
                            <motion.div
                                key={g.title}
                                whileHover={{ y: -2 }}
                                className="flex gap-4 items-start rounded-2xl p-5"
                                style={{ background: T.glass, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)", boxShadow: T.shadow }}
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(10,123,74,0.1)" }}>
                                    <span style={{ color: T.primary }}>{g.icon}</span>
                                </div>
                                <div>
                                    <p className="font-700 text-sm mb-1" style={{ color: T.textPrimary }}>{g.title}</p>
                                    <p className="text-xs leading-relaxed" style={{ color: T.textSecond }}>{g.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ── Roadmap ──────────────────────────────────────────────────── */}
                <section className="mb-12">
                    <div className="rounded-3xl p-8 text-center"
                        style={{ background: `linear-gradient(135deg, rgba(10,123,74,0.07), rgba(16,185,129,0.06))`, border: `1px solid ${T.borderMed}`, backdropFilter: "blur(12px)" }}>
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(10,123,74,0.1)" }}>
                            <TrendingUp className="w-6 h-6" style={{ color: T.primary }} />
                        </div>
                        <h2 className="text-2xl font-800 mb-2" style={{ color: T.textPrimary }}>Expanding Our Crop Library</h2>
                        <p className="text-sm mb-5" style={{ color: T.textSecond }}>
                            We continuously expand coverage. Current dataset: <strong style={{ color: T.textPrimary }}>{TOTAL_CROPS} crops · {TOTAL_CLASSES} classes · {TOTAL_IMAGES.toLocaleString()} images</strong>.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {["Cotton", "Watermelon", "Onion", "Tomato (expanded)", "Sunflower", "Groundnut", "Papaya"].map(c => (
                                <span key={c} className="px-3 py-1.5 rounded-full text-xs font-semibold"
                                    style={{ background: "rgba(10,123,74,0.1)", color: T.primary, border: `1px solid rgba(10,123,74,0.2)` }}>
                                    {c}
                                </span>
                            ))}
                        </div>
                        <Button className="rounded-full gap-2 font-semibold"
                            style={{ background: T.primary, color: "#fff" }}>
                            Request a crop <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                </section>

                {/* ── Footer / Attribution ─────────────────────────────────────── */}
                <footer className="text-center text-xs pb-6" style={{ color: T.textSecond, borderTop: `1px solid ${T.border}`, paddingTop: "2rem" }}>
                    <p className="max-w-2xl mx-auto leading-relaxed">
                        Dataset sourced from the{" "}
                        <a
                            href="https://www.kaggle.com/datasets/akarshangupta/high-quality-crop-disease-image-dataset-for-cnns"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:underline"
                            style={{ color: T.primary }}
                        >
                            High Quality Crop Disease Image Dataset for CNNs <ExternalLink className="w-3 h-3" />
                        </a>{" "}
                        by Akarshan Gupta (Kaggle). Builds upon PlantVillage and additional open-source collections.
                        Total: <strong style={{ color: T.textPrimary }}>{TOTAL_IMAGES.toLocaleString()} images · {TOTAL_CLASSES} classes · {TOTAL_CROPS} crops</strong>.
                    </p>
                </footer>
            </div>
        </main>
    );
}