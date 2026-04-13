"use client";

import { motion } from "framer-motion";
import {
    Code,
    Key,
    Database,
    Upload,
    BarChart3,
    Activity,
    Zap,
    Copy,
    Check,
    ExternalLink,
    Cpu,
    Brain,
    FlaskConical,
    Terminal,
    ChevronRight,
    Circle,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ─── Animation variants ───────────────────────────────────── */
const fadeUp = {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: "easeOut" },
};
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

/* ─── TOC items ─────────────────────────────────────────────── */
const TOC = [
    { id: "overview", label: "Overview" },
    { id: "auth", label: "Authentication" },
    { id: "endpoint", label: "Endpoint" },
    { id: "rate-limits", label: "Rate Limits" },
    { id: "image-req", label: "Image Requirements" },
    { id: "ai-tech", label: "AI & Techniques" },
    { id: "crops", label: "Supported Crops" },
    { id: "local-dev", label: "Local Dev" },
];

/* ─── All 30 crops from dataset-tree.txt ────────────────────── */
const CROPS = [
    { name: "Apple",        classes: 5,  files: 3166  },
    { name: "Banana",       classes: 2,  files: 1226  },
    { name: "Bellpepper",   classes: 2,  files: 960   },
    { name: "Carrot",       classes: 2,  files: 934   },
    { name: "Cassava",      classes: 5,  files: 2277  },
    { name: "Cherry",       classes: 2,  files: 1088  },
    { name: "Chili",        classes: 5,  files: 479   },
    { name: "Coffee",       classes: 4,  files: 1046  },
    { name: "Corn",         classes: 8,  files: 3743  },
    { name: "Cucumber",     classes: 3,  files: 1647  },
    { name: "Gauva",        classes: 2,  files: 419   },
    { name: "Grape",        classes: 5,  files: 2585  },
    { name: "Guava",        classes: 2,  files: 400   },
    { name: "Jamun",        classes: 2,  files: 624   },
    { name: "Jujube",       classes: 2,  files: 400   },
    { name: "Lemon",        classes: 2,  files: 236   },
    { name: "Mango",        classes: 3,  files: 1588  },
    { name: "Orange",       classes: 2,  files: 1199  },
    { name: "Peach",        classes: 2,  files: 971   },
    { name: "Pepper",       classes: 2,  files: 1151  },
    { name: "Pepper Bell",  classes: 2,  files: 865   },
    { name: "Pomegranate",  classes: 3,  files: 959   },
    { name: "Potato",       classes: 6,  files: 3432  },
    { name: "Rice",         classes: 8,  files: 4184  },
    { name: "Soybean",      classes: 9,  files: 2180  },
    { name: "Strawberry",   classes: 3,  files: 2115  },
    { name: "Sugarcane",    classes: 7,  files: 596   },
    { name: "Tea",          classes: 6,  files: 1917  },
    { name: "Tomato",       classes: 19, files: 10983 },
    { name: "Wheat",        classes: 7,  files: 3014  },
];

const MAX_CLASSES = 19; // Tomato has the most

/* ─── Code block ────────────────────────────────────────────── */
const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="group relative overflow-hidden rounded-xl border border-[rgba(10,123,74,0.25)] shadow-lg">
            <div className="flex items-center justify-between border-b border-[rgba(10,123,74,0.2)] bg-[#0B1E0B]/90 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                    <Circle className="h-2.5 w-2.5 fill-[#EF4444] text-[#EF4444]" />
                    <Circle className="h-2.5 w-2.5 fill-[#F59E0B] text-[#F59E0B]" />
                    <Circle className="h-2.5 w-2.5 fill-[#10B981] text-[#10B981]" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#3A4D3A]/60">
                    {language}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-white/90"
                    aria-label="Copy code"
                >
                    {copied ? <><Check size={12} /><span>Copied</span></> : <><Copy size={12} /><span>Copy</span></>}
                </button>
            </div>
            <pre className="overflow-x-auto bg-[#0B1E0B]/95 p-5 text-sm leading-relaxed">
                <code className={`language-${language} font-mono text-gray-300`}>{code}</code>
            </pre>
        </div>
    );
};

/* ─── Section wrapper ───────────────────────────────────────── */
const Section = ({
    id, icon: Icon, title, subtitle, children,
}: {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) => (
    <motion.section id={id} variants={fadeUp} className="scroll-mt-24">
        <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A7B4A] shadow-md shadow-[rgba(10,123,74,0.35)]">
                <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-[#1A2E1A]">{title}</h2>
                {subtitle && <p className="text-xs text-[#3A4D3A]">{subtitle}</p>}
            </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[rgba(10,123,74,0.2)] bg-[rgba(245,250,240,0.62)] shadow-sm backdrop-blur-xl">
            <div className="h-px w-full bg-linear-to-r from-transparent via-[#0A7B4A]/40 to-transparent" />
            <div className="space-y-5 p-6">{children}</div>
        </div>
    </motion.section>
);

/* ─── Inline code ───────────────────────────────────────────── */
const IC = ({ children }: { children: React.ReactNode }) => (
    <code className="rounded-md bg-[rgba(10,123,74,0.1)] px-1.5 py-0.5 font-mono text-[0.8em] font-semibold text-[#0A7B4A]">
        {children}
    </code>
);

/* ─── Param table ───────────────────────────────────────────── */
const ParamTable = ({ rows }: { rows: { param: string; type: string; required: boolean; desc: string }[] }) => (
    <div className="overflow-hidden rounded-xl border border-[rgba(10,123,74,0.15)]">
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-[rgba(10,123,74,0.15)] bg-white/40">
                    {["Parameter", "Type", "Required", "Description"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-widest text-[#3A4D3A]">{h}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((r, i) => (
                    <tr key={r.param} className={i % 2 === 0 ? "bg-white/20" : "bg-white/5"}>
                        <td className="px-4 py-3"><IC>{r.param}</IC></td>
                        <td className="px-4 py-3 font-mono text-xs text-[#3A4D3A]">{r.type}</td>
                        <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${r.required ? "bg-[#0A7B4A]/15 text-[#0A7B4A]" : "bg-[rgba(10,123,74,0.06)] text-[#3A4D3A]"}`}>
                                {r.required ? "Yes" : "No"}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-[#3A4D3A]">{r.desc}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/* ─── Error row ─────────────────────────────────────────────── */
const ErrorRow = ({ code, desc }: { code: string; desc: string }) => (
    <div className="flex items-center gap-3 rounded-xl border border-[rgba(10,123,74,0.1)] bg-white/30 px-4 py-2.5">
        <span className="font-mono text-sm font-bold text-[#EF4444]">{code}</span>
        <ChevronRight className="h-3 w-3 text-[#3A4D3A]/40" />
        <span className="text-sm text-[#3A4D3A]">{desc}</span>
    </div>
);

/* ─── Main ──────────────────────────────────────────────────── */
export function ApiDocsClient() {
    const [activeSection, setActiveSection] = useState("overview");

    const curlExample = `curl -X POST https://your-domain.com/api/v1/diagnose \\
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \\
  -F "file=@/path/to/leaf.jpg"`;

    const pythonExample = `import requests

url = "https://your-domain.com/api/v1/diagnose"
cookies = {"next-auth.session-token": "YOUR_SESSION_TOKEN"}
files = {"file": open("leaf.jpg", "rb")}

response = requests.post(url, cookies=cookies, files=files)
data = response.json()
print(f"Disease: {data['prediction']['predicted_class']}")
print(f"Confidence: {data['prediction']['confidence']*100:.1f}%")
print(f"Advice: {data['ai_feedback']}")`;

    const jsExample = `const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/v1/diagnose', {
  method: 'POST',
  credentials: 'include', // sends session cookie
  body: formData
});
const result = await response.json();
console.log(result.prediction.predicted_class);
console.log(result.ai_feedback);`;

    const successResponse = `{
  "prediction": {
    "predicted_class": "Tomato___Late_blight",
    "confidence": 0.9743,
    "top3_predictions": [
      { "class": "Tomato___Late_blight",  "confidence": 0.9743 },
      { "class": "Tomato___Early_blight", "confidence": 0.0182 },
      { "class": "Tomato___Leaf_Mold",    "confidence": 0.0051 }
    ]
  },
  "ai_feedback": "**Disease:** Tomato Late Blight\\n\\n**Treatment:**\\n- Organic: copper-based fungicide every 7-10 days.\\n- Chemical: chlorothalonil or mancozeb.\\n\\n**Prevention:** Rotate crops, water at base, use resistant varieties."
}`;

    const setupCode = `# Clone the repository
git clone https://github.com/ByteCrister/agroleaf-ai.git
cd agroleaf-ai

# Install Python dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env → GEMINI_API_KEY, FAST_API_KEY, etc.

# Start FastAPI backend  (port 8000)
python run.py

# Start Next.js frontend (port 3000)
npm run dev

# Endpoints:
# http://localhost:3000/api/v1/diagnose   ← Next.js proxy
# http://localhost:8000/api/predict       ← FastAPI direct`;

    return (
        <div className="min-h-screen">
            {/* ── Sticky header ───────────────────────────────── */}
            <header className="sticky top-0 z-50 border-b border-[rgba(10,123,74,0.18)] bg-[rgba(245,250,240,0.8)] backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A7B4A] shadow-md shadow-[rgba(10,123,74,0.35)]">
                        <Terminal className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-xl font-extrabold tracking-tight text-[#1A2E1A] md:text-2xl">
                            Diagnosis API Reference
                        </h1>
                        <p className="hidden text-xs text-[#3A4D3A] sm:block">
                            Image upload · AI inference · Agronomic advice
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden items-center gap-1.5 rounded-full border border-[rgba(10,123,74,0.25)] bg-white/60 px-3 py-1 text-xs font-semibold text-[#1A2E1A] sm:flex">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#10B981]" />
                            v1 · Live
                        </span>
                        <a
                            href="https://github.com/ByteCrister/agroleaf-ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-lg border border-[rgba(10,123,74,0.2)] bg-white/50 px-3 py-1.5 text-xs font-semibold text-[#1A2E1A] transition-colors hover:border-[rgba(10,123,74,0.5)] hover:bg-white/80"
                        >
                            <ExternalLink className="h-3 w-3" />
                            GitHub
                        </a>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex gap-8">
                    {/* ── Sidebar TOC ─────────────────────────────── */}
                    <aside className="hidden w-52 shrink-0 lg:block">
                        <div className="sticky top-24 rounded-2xl border border-[rgba(10,123,74,0.18)] bg-[rgba(245,250,240,0.55)] p-4 backdrop-blur-md">
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#3A4D3A]/60">
                                On this page
                            </p>
                            <nav className="space-y-0.5">
                                {TOC.map(({ id, label }) => (
                                    <a
                                        key={id}
                                        href={`#${id}`}
                                        onClick={() => setActiveSection(id)}
                                        className={cn(
                                            "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition-colors",
                                            activeSection === id
                                                ? "bg-[#0A7B4A] font-semibold text-white"
                                                : "text-[#3A4D3A] hover:bg-[rgba(10,123,74,0.08)] hover:text-[#1A2E1A]"
                                        )}
                                    >
                                        <ChevronRight className={cn("h-3 w-3 transition-opacity", activeSection === id ? "opacity-100" : "opacity-0")} />
                                        {label}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* ── Main content ─────────────────────────────── */}
                    <motion.main
                        className="min-w-0 flex-1 space-y-10"
                        variants={stagger}
                        initial="initial"
                        animate="animate"
                    >
                        {/* Overview */}
                        <Section id="overview" icon={Activity} title="Overview" subtitle="What this API does and how to reach it">
                            <p className="leading-relaxed text-[#3A4D3A]">
                                The <IC>POST /api/v1/diagnose</IC> endpoint accepts a crop leaf image,
                                runs inference through a Vision Transformer (ViT) model, and returns the
                                predicted disease, top-3 confidence scores, and AI-generated agronomic advice.
                                The model is trained on{" "}
                                <strong className="text-[#1A2E1A]">56,384 images</strong> across{" "}
                                <strong className="text-[#1A2E1A]">134 disease classes</strong> and{" "}
                                <strong className="text-[#1A2E1A]">30 crop types</strong>.
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {[
                                    { label: "Production", value: "https://your-domain.com/api/v1/diagnose" },
                                    { label: "Local dev",  value: "http://localhost:3000/api/v1/diagnose" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="rounded-xl border border-[rgba(10,123,74,0.15)] bg-[#0B1E0B]/90 px-4 py-3">
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#3A4D3A]/60">{label}</p>
                                        <p className="truncate font-mono text-sm text-[#10B981]">{value}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-[#3A4D3A]">
                                Protected by NextAuth.js session cookies. Rate limiting enforced per user via Redis.
                            </p>
                        </Section>

                        {/* Auth */}
                        <Section id="auth" icon={Key} title="Authentication" subtitle="Session-based via NextAuth.js">
                            <p className="leading-relaxed text-[#3A4D3A]">
                                When a user is logged in, their <IC>next-auth.session-token</IC> cookie is
                                automatically included in browser requests. For external / programmatic access,
                                pass it manually as a cookie header.
                            </p>
                            <div className="flex items-start gap-3 rounded-xl border border-[rgba(10,123,74,0.2)] bg-[rgba(10,123,74,0.06)] p-4">
                                <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 border-[#0A7B4A]" />
                                <p className="text-sm text-[#1A2E1A]">
                                    <strong>External access:</strong> Contact the team for a dedicated API key.
                                    This endpoint is designed for use within the AgroLeaf web app.
                                </p>
                            </div>
                        </Section>

                        {/* Endpoint */}
                        <Section id="endpoint" icon={Database} title="POST /api/v1/diagnose" subtitle="Upload a leaf image → disease prediction + AI advice">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="rounded-lg bg-[#0A7B4A] px-3 py-1 text-sm font-black tracking-wider text-white">POST</span>
                                <code className="rounded-xl border border-[rgba(10,123,74,0.2)] bg-white/50 px-3 py-1.5 font-mono text-sm font-semibold text-[#1A2E1A]">
                                    /api/v1/diagnose
                                </code>
                                <span className="text-sm text-[#3A4D3A]">multipart/form-data</span>
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#3A4D3A]/60">Request Parameters</p>
                                <ParamTable rows={[
                                    { param: "file", type: "file", required: true, desc: "Crop leaf image (JPEG, PNG, BMP). Max 10 MB." },
                                ]} />
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#3A4D3A]/60">Code Examples</p>
                                <Tabs defaultValue="curl" className="w-full">
                                    <TabsList className="mb-4 flex gap-1 rounded-xl border border-[rgba(10,123,74,0.2)] bg-white/40 p-1">
                                        {["curl", "python", "javascript"].map((t) => (
                                            <TabsTrigger
                                                key={t}
                                                value={t}
                                                className="flex-1 rounded-lg text-xs font-semibold capitalize data-[state=active]:bg-[#0A7B4A] data-[state=active]:text-white data-[state=active]:shadow-sm"
                                            >
                                                {t}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    <TabsContent value="curl"><CodeBlock code={curlExample} language="bash" /></TabsContent>
                                    <TabsContent value="python"><CodeBlock code={pythonExample} language="python" /></TabsContent>
                                    <TabsContent value="javascript"><CodeBlock code={jsExample} language="javascript" /></TabsContent>
                                </Tabs>
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#3A4D3A]/60">Success Response · 200</p>
                                <CodeBlock code={successResponse} language="json" />
                            </div>

                            <div>
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#3A4D3A]/60">Error Responses</p>
                                <div className="space-y-2">
                                    <ErrorRow code="400" desc="Invalid or missing file" />
                                    <ErrorRow code="401" desc="Unauthorized — not logged in" />
                                    <ErrorRow code="429" desc="Rate limit exceeded" />
                                    <ErrorRow code="502" desc="FastAPI service unreachable" />
                                    <ErrorRow code="503" desc="Model not loaded" />
                                </div>
                            </div>
                        </Section>

                        {/* Rate limits */}
                        <Section id="rate-limits" icon={Zap} title="Rate Limits" subtitle="Per-user limits enforced via Redis">
                            <p className="text-[#3A4D3A]">
                                Rate limiting is keyed to the user&apos;s email from the session token.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { period: "Per minute", limit: "2 requests" },
                                    { period: "Per hour",   limit: "5 requests" },
                                ].map(({ period, limit }) => (
                                    <div key={period} className="rounded-2xl border border-[rgba(10,123,74,0.2)] bg-white/40 p-5 text-center">
                                        <p className="text-3xl font-extrabold text-[#0A7B4A]">{limit.split(" ")[0]}</p>
                                        <p className="mt-1 text-xs font-semibold text-[#3A4D3A]">
                                            {limit.split(" ").slice(1).join(" ")} · {period}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-[#3A4D3A]">
                                Responses include <IC>Retry-After</IC> headers when the limit is exceeded.
                            </p>
                        </Section>

                        {/* Image requirements */}
                        <Section id="image-req" icon={Upload} title="Image Requirements">
                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { label: "Formats",        value: "JPEG · PNG · BMP" },
                                    { label: "Max file size",  value: "10 MB"            },
                                    { label: "Min resolution", value: "224 × 224 px"     },
                                ].map(({ label, value }) => (
                                    <div key={label} className="rounded-xl border border-[rgba(10,123,74,0.15)] bg-white/40 p-4">
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#3A4D3A]/60">{label}</p>
                                        <p className="font-semibold text-[#1A2E1A]">{value}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-[#3A4D3A]">
                                Images are automatically resized to 224 × 224 and normalised before inference.
                                Blurry or very low-resolution images may reduce prediction accuracy.
                            </p>
                        </Section>

                        {/* AI & Techniques */}
                        <Section id="ai-tech" icon={Brain} title="AI & Techniques" subtitle="Models, inference pipeline, and feedback generation">
                            <div className="grid gap-4 md:grid-cols-2">
                                {[
                                    {
                                        icon: Cpu,
                                        title: "Vision Transformer (ViT)",
                                        body: "Fine-tuned Google ViT-base-patch16-224 trained on 56,384 images across 134 disease classes and 30 crop types. Dynamic quantisation reduces memory footprint while maintaining accuracy.",
                                    },
                                    {
                                        icon: FlaskConical,
                                        title: "Gemini AI Feedback",
                                        body: "Predicted disease + confidence are forwarded to Google Gemini Flash, which returns structured farmer-friendly advice: symptoms, organic & chemical treatments, prevention tips, and expert escalation cues.",
                                    },
                                ].map(({ icon: Icon, title, body }) => (
                                    <div key={title} className="rounded-xl border border-[rgba(10,123,74,0.15)] bg-white/40 p-5">
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(10,123,74,0.1)]">
                                                <Icon className="h-4 w-4 text-[#0A7B4A]" />
                                            </div>
                                            <h3 className="font-bold text-[#1A2E1A]">{title}</h3>
                                        </div>
                                        <p className="text-sm leading-relaxed text-[#3A4D3A]">{body}</p>
                                    </div>
                                ))}
                            </div>
                            <div>
                                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#3A4D3A]/60">Tech Stack</p>
                                <div className="flex flex-wrap gap-2">
                                    {["FastAPI", "PyTorch", "Transformers", "Redis", "Next.js API Routes", "NextAuth.js", "Google Gemini"].map((t) => (
                                        <Badge
                                            key={t}
                                            variant="outline"
                                            className="rounded-lg border-[rgba(10,123,74,0.25)] bg-white/50 px-3 py-1 text-xs font-semibold text-[#1A2E1A] transition-colors hover:border-[rgba(10,123,74,0.5)]"
                                        >
                                            {t}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </Section>

                        {/* Crops — all 30 from dataset ──────────────── */}
                        <Section
                            id="crops"
                            icon={BarChart3}
                            title="Supported Crops & Diseases"
                            subtitle="30 crops · 134 disease classes · 56,384 training images"
                        >
                            {/* Summary pills */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { label: "Crops",            value: "30"     },
                                    { label: "Disease classes",  value: "134"    },
                                    { label: "Training images",  value: "56,384" },
                                ].map(({ label, value }) => (
                                    <div key={label} className="flex items-center gap-2 rounded-full border border-[rgba(10,123,74,0.2)] bg-white/50 px-4 py-1.5">
                                        <span className="text-sm font-extrabold text-[#0A7B4A]">{value}</span>
                                        <span className="text-xs text-[#3A4D3A]">{label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Crop grid — all 30 */}
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {CROPS.map(({ name, classes, files }) => (
                                    <div
                                        key={name}
                                        className="group rounded-xl border border-[rgba(10,123,74,0.15)] bg-white/40 p-3 transition-all hover:border-[rgba(10,123,74,0.4)] hover:bg-white/65 hover:shadow-sm"
                                    >
                                        <p className="truncate text-sm font-semibold text-[#1A2E1A]">
                                            🌱 {name}
                                        </p>
                                        <div className="mt-1 flex items-center justify-between">
                                            <p className="text-xs text-[#3A4D3A]">{classes} classes</p>
                                            <p className="text-[10px] font-medium text-[#0A7B4A]">
                                                {files >= 1000 ? `${(files / 1000).toFixed(1)}k` : files}
                                            </p>
                                        </div>
                                        {/* Class-count bar relative to max (Tomato = 19) */}
                                        <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-[rgba(10,123,74,0.1)]">
                                            <div
                                                className="h-full rounded-full bg-linear-to-r from-[#0A7B4A] to-[#2C5F2D]"
                                                style={{ width: `${(classes / MAX_CLASSES) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs text-[#3A4D3A]/70">
                                Bar width = disease-class count relative to Tomato (19 classes, the largest).
                                Top-3 predictions with confidence scores are returned per request.
                            </p>
                        </Section>

                        {/* Local dev */}
                        <Section id="local-dev" icon={Code} title="Local Development Setup">
                            <CodeBlock code={setupCode} language="bash" />
                            <p className="text-sm text-[#3A4D3A]">
                                Full documentation and model training details are in the{" "}
                                <a
                                    href="https://github.com/ByteCrister/agroleaf-ai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 font-semibold text-[#0A7B4A] underline underline-offset-2 transition-colors hover:text-[#2C5F2D]"
                                >
                                    GitHub repository <ExternalLink size={12} />
                                </a>.
                            </p>
                        </Section>
                    </motion.main>
                </div>
            </div>
        </div>
    );
}