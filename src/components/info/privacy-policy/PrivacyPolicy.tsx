"use client";

import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
    Info,
    Upload,
    Database,
    Eye,
    Cookie,
    Mail,
    Lock,
    Users,
    Code,
    RefreshCw,
    FileText,
    CheckCircle2,
} from "lucide-react";

const GITHUB_REPOSITORY_URL = ``;

const PrivacyPolicy = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="min-h-screen bg-linear-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-4xl mx-auto">
                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
                    <CardHeader className="bg-linear-to-r from-emerald-600 to-teal-700 text-white rounded-t-2xl pb-8 pt-10 px-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="h-8 w-8" />
                            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                                Privacy Policy
                            </CardTitle>
                        </div>
                        <CardDescription className="text-emerald-100 text-base mt-2">
                            Last updated: {currentDate}
                        </CardDescription>
                        <p className="text-emerald-50/90 text-sm mt-4 max-w-2xl">
                            AgroLeaf AI is committed to protecting your data. This policy
                            explains how we handle information when you use our crop disease
                            detection platform.
                        </p>
                    </CardHeader>

                    <CardContent className="px-6 md:px-8 py-8 space-y-8">
                        {/* Section 1: Introduction */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Info className="h-5 w-5 text-emerald-600" />
                                1. Introduction
                            </h2>
                            <div className="space-y-2 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                                <p>
                                    <strong className="font-semibold">Platform:</strong> AgroLeaf
                                    AI
                                </p>
                                <p>
                                    <strong className="font-semibold">Operator:</strong> ByteCrister
                                    (individual developer / open-source project)
                                </p>
                                <p>
                                    <strong className="font-semibold">Effective Date:</strong>{" "}
                                    {currentDate}
                                </p>
                                <p>
                                    This Privacy Policy explains how AgroLeaf AI collects, uses,
                                    and protects your information when you use our crop disease
                                    detection web application, available at{" "}
                                    <a
                                        href={GITHUB_REPOSITORY_URL}
                                        className="text-emerald-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {GITHUB_REPOSITORY_URL}
                                    </a>
                                    . AgroLeaf AI is free, open-source software.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 2: Information We Collect */}
                        <section className="space-y-5">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Database className="h-5 w-5 text-emerald-600" />
                                2. Information We Collect
                            </h2>

                            <div className="space-y-4 pl-2">
                                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">
                                    2.1 Information You Provide Directly
                                </h3>
                                <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                    <li>Account information (if applicable): name, email address</li>
                                    <li>Crop leaf images uploaded for disease detection</li>
                                    <li>Contact form submissions: name, email, message content</li>
                                    <li>Feedback and bug reports</li>
                                </ul>

                                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200 mt-4">
                                    2.2 Information Collected Automatically
                                </h3>
                                <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                    <li>Log data: IP address, browser type, operating system, referring URL</li>
                                    <li>Usage data: pages visited, features used, timestamps</li>
                                    <li>API usage data: endpoints called, request timestamps, response status codes</li>
                                    <li>Cookies: session cookies for functionality, analytics cookies (if applicable)</li>
                                </ul>

                                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200 mt-4 flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-emerald-600" />
                                    2.3 Uploaded Images (Critical)
                                </h3>

                                <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-md space-y-3 text-slate-700 dark:text-slate-200">

                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                        <p>
                                            Images uploaded for disease detection are processed in real-time by our AI model.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                        <p>
                                            Images are NOT permanently stored on our servers after processing. They are held in temporary memory during inference and deleted immediately after the prediction is returned.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                        <p>
                                            We do NOT use your uploaded images to retrain or improve our AI model without explicit consent.
                                        </p>
                                    </div>

                                    <div className="flex items-start gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                                        <p>
                                            If you self-host AgroLeaf AI, all image processing occurs entirely on your own infrastructure. No data is sent to external servers.
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 3: How We Use Your Information */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Eye className="h-5 w-5 text-emerald-600" />
                                3. How We Use Your Information
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>To provide the crop disease detection service</li>
                                <li>To respond to your inquiries and support requests</li>
                                <li>To improve the platform (aggregated, anonymized usage analytics only)</li>
                                <li>To send important service updates (if you have an account)</li>
                                <li className="font-medium">We do NOT sell, rent, or share your personal information with third parties</li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 4: Data Storage & Security */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Lock className="h-5 w-5 text-emerald-600" />
                                4. Data Storage & Security
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>Data is stored on Vercel (frontend) and Supabase (database, authentication) for the hosted version of AgroLeaf AI.</li>
                                <li>HTTPS encryption for all data in transit</li>
                                <li>Images are processed in memory and not written to persistent storage</li>
                                <li>Passwords (if applicable) are hashed using bcrypt/argon2</li>
                                <li>While we implement reasonable security measures, no system is 100% secure.</li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 5: Third-Party Services */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Code className="h-5 w-5 text-emerald-600" />
                                5. Third-Party Services
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>Hosting provider (Vercel) – for serving the application</li>
                                <li>Analytics (Vercel Analytics) – anonymized usage patterns, no personal data</li>
                                <li>Database & authentication (Supabase) – for account management (if enabled)</li>
                                <li className="font-medium">We do not share your uploaded images with any third party.</li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 6: Cookies */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Cookie className="h-5 w-5 text-emerald-600" />
                                6. Cookies
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>Session cookies: required for functionality</li>
                                <li>Analytics cookies: optional, used to understand usage patterns</li>
                                <li>You can disable cookies in your browser settings. Some features may not work without session cookies.</li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 7: Your Rights */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Users className="h-5 w-5 text-emerald-600" />
                                7. Your Rights
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>Access: You can request a copy of your data</li>
                                <li>Deletion: You can request deletion of your account and associated data</li>
                                <li>Correction: You can update your account information</li>
                                <li>Opt-out: You can opt out of analytics tracking</li>
                                <li>To exercise these rights, contact us at <a href="mailto:privacy@agroleaf.ai" className="text-emerald-600 hover:underline">privacy@agroleaf.ai</a> or via /contact.</li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 8: Data Retention */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <RefreshCw className="h-5 w-5 text-emerald-600" />
                                8. Data Retention
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>Account data: retained until you delete your account</li>
                                <li>Uploaded images: not retained (deleted immediately after processing)</li>
                                <li>API logs: retained for 90 days for debugging, then deleted</li>
                                <li>Contact form submissions: retained for 1 year</li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 9: Children's Privacy */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <FileText className="h-5 w-5 text-emerald-600" />
                                9. Children&apos;s Privacy
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                AgroLeaf AI is not directed at children under 13. We do not
                                knowingly collect data from children.
                            </p>
                        </section>

                        <Separator />

                        {/* Section 10: Self-Hosted Deployments */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Code className="h-5 w-5 text-emerald-600" />
                                10. Self-Hosted Deployments
                            </h2>
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                                <p className="text-slate-700 dark:text-slate-200">
                                    If you self-host AgroLeaf AI using our open-source code, this
                                    privacy policy does not apply. You are responsible for your
                                    own data handling practices. No data from self-hosted
                                    instances is sent to us.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 11: Changes to This Policy */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <RefreshCw className="h-5 w-5 text-emerald-600" />
                                11. Changes to This Policy
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                We may update this policy from time to time. Changes will be
                                posted on this page with an updated effective date.
                            </p>
                        </section>

                        <Separator />

                        {/* Section 12: Contact */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Mail className="h-5 w-5 text-emerald-600" />
                                12. Contact
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                For privacy-related questions or requests, contact:{" "}
                                <a href="mailto:privacy@agroleaf.ai" className="text-emerald-600 hover:underline">
                                    privacy@agroleaf.ai
                                </a>{" "}
                                or visit our <a href="/contact" className="text-emerald-600 hover:underline">/contact</a> page.
                            </p>
                        </section>

                        <div className="pt-6 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                            AgroLeaf AI · Open-source crop disease detection · Self-host
                            available on GitHub
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.main>
    );
};

export default PrivacyPolicy;