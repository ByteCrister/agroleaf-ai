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
    FileText,
    Scale,
    Shield,
    AlertTriangle,
    Code,
    Users,
    Mail,
    RefreshCw,
    CheckCircle2,
    Ban,
    Gavel,
    ExternalLink,
} from "lucide-react";

const REPOSITORY_URL = "https://github.com/ByteCrister/agroleaf-ai";

const TermsPage = () => {
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
                            <Scale className="h-8 w-8" />
                            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">
                                Terms of Service
                            </CardTitle>
                        </div>
                        <CardDescription className="text-emerald-100 text-base mt-2">
                            Effective date: {currentDate}
                        </CardDescription>
                        <p className="text-emerald-50/90 text-sm mt-4 max-w-2xl">
                            By using AgroLeaf AI, you agree to these terms. Please read them
                            carefully — they govern your access to and use of our crop disease
                            detection platform.
                        </p>
                    </CardHeader>

                    <CardContent className="px-6 md:px-8 py-8 space-y-8">
                        {/* Section 1: Acceptance of Terms */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <FileText className="h-5 w-5 text-emerald-600" />
                                1. Acceptance of Terms
                            </h2>
                            <div className="space-y-2 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                                <p>
                                    These Terms of Service (&quot;Terms&quot;) govern your use of AgroLeaf AI
                                    (the &quot;Platform&quot;), including the website, API, and any associated
                                    services, operated by ByteCrister (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
                                </p>
                                <p>
                                    By accessing or using AgroLeaf AI, you agree to be bound by these
                                    Terms. If you disagree with any part, please do not use the Platform.
                                </p>
                                <p>
                                    The Platform is <strong>free and open-source</strong> under the MIT
                                    License. You may self-host your own instance, in which case these
                                    Terms apply only to your use of our hosted version. Self-hosted
                                    deployments are governed by their own policies.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 2: Eligibility */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Users className="h-5 w-5 text-emerald-600" />
                                2. Eligibility
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>
                                    You must be at least <strong>13 years old</strong> to use AgroLeaf AI.
                                </li>
                                <li>
                                    If you are under 18, you must have parental or guardian consent.
                                </li>
                                <li>
                                    By using the Platform, you represent that you meet these eligibility
                                    requirements.
                                </li>
                                <li>
                                    We reserve the right to refuse service to anyone for any reason at
                                    any time.
                                </li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 3: Use of the Platform */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Shield className="h-5 w-5 text-emerald-600" />
                                3. Use of the Platform
                            </h2>

                            <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200">
                                3.1 Permitted Uses
                            </h3>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>Uploading crop leaf images for AI-based disease detection</li>
                                <li>Accessing disease diagnosis, confidence scores, and treatment recommendations</li>
                                <li>Using the API for programmatic integration (subject to rate limits)</li>
                                <li>Self-hosting the open-source code for personal, research, or commercial use</li>
                            </ul>

                            <h3 className="text-xl font-medium text-slate-700 dark:text-slate-200 mt-4">
                                3.2 Prohibited Uses
                            </h3>
                            <div className="bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 p-4 rounded-md space-y-2">
                                <div className="flex items-start gap-2">
                                    <Ban className="h-5 w-5 text-red-600 mt-0.5" />
                                    <p className="text-slate-700 dark:text-slate-200">
                                        You may <strong>not</strong> use AgroLeaf AI for:
                                    </p>
                                </div>
                                <ul className="list-disc pl-10 space-y-1 text-slate-600 dark:text-slate-300">
                                    <li>Illegal activities or violations of any applicable laws</li>
                                    <li>Uploading images that contain personal information of others without consent</li>
                                    <li>Harassment, abuse, or harm to others</li>
                                    <li>Attempting to reverse-engineer, decompile, or extract the AI model beyond permitted use</li>
                                    <li>Circumventing rate limits, security measures, or access controls</li>
                                    <li>Using the Platform to make medical or legal decisions (the Platform is for informational purposes only)</li>
                                    <li>Commercial resale of API access without explicit permission</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 4: Intellectual Property */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Gavel className="h-5 w-5 text-emerald-600" />
                                4. Intellectual Property
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>
                                    The AgroLeaf AI source code is released under the{" "}
                                    <strong>MIT License</strong>. You are free to use, modify, and
                                    distribute the code, subject to the terms of the MIT License.
                                </li>
                                <li>
                                    The AI model weights are provided for use with AgroLeaf AI. You may
                                    not redistribute or sell the model weights as a standalone product.
                                </li>
                                <li>
                                    All trademarks, logos, and service marks displayed on the Platform
                                    are the property of ByteCrister or third parties.
                                </li>
                                <li>
                                    You retain ownership of any images you upload. We claim no
                                    intellectual property rights over your content.
                                </li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 5: Disclaimer of Warranties */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <AlertTriangle className="h-5 w-5 text-emerald-600" />
                                5. Disclaimer of Warranties
                            </h2>
                            <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-500 p-4 rounded-md space-y-3">
                                <p className="text-slate-700 dark:text-slate-200 font-semibold">
                                    IMPORTANT: AgroLeaf AI is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind.
                                </p>
                                <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                    <li>
                                        The AI disease detection is <strong>not 100% accurate</strong>.
                                        Predictions may be incorrect, especially with low-quality images or
                                        unusual disease presentations.
                                    </li>
                                    <li>
                                        Treatment recommendations are generated based on general agricultural
                                        knowledge and should be verified with a local agronomist or
                                        extension service before application.
                                    </li>
                                    <li>
                                        We do not warrant that the Platform will be uninterrupted,
                                        error-free, or secure.
                                    </li>
                                    <li>
                                        Use of the Platform is at your <strong>sole risk</strong>. Crop
                                        management decisions based on AI output are your responsibility.
                                    </li>
                                </ul>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    AgroLeaf AI is a <strong>decision-support tool</strong>, not a
                                    substitute for professional agronomic advice, laboratory testing, or
                                    veterinary diagnosis.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 6: Limitation of Liability */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Shield className="h-5 w-5 text-emerald-600" />
                                6. Limitation of Liability
                            </h2>
                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md">
                                <p className="text-slate-700 dark:text-slate-200">
                                    To the maximum extent permitted by law, ByteCrister and its
                                    contributors shall not be liable for any indirect, incidental,
                                    special, consequential, or punitive damages, including without
                                    limitation:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                                    <li>Crop loss, reduced yield, or economic damage</li>
                                    <li>Loss of data, revenue, or business opportunities</li>
                                    <li>Personal injury or property damage</li>
                                    <li>Damages arising from reliance on AI predictions</li>
                                </ul>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                                    Our total liability shall not exceed the amount you paid to use the
                                    Platform (since the Platform is free, this amount is $0).
                                </p>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 7: Indemnification */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                7. Indemnification
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                You agree to indemnify and hold harmless ByteCrister and its
                                contributors from any claims, damages, losses, liabilities, costs, or
                                expenses (including reasonable legal fees) arising out of:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>Your use of the Platform</li>
                                <li>Your violation of these Terms</li>
                                <li>Your violation of any third-party rights, including intellectual property or privacy rights</li>
                                <li>Any content you upload or submit</li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 8: Self-Hosted Deployments */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Code className="h-5 w-5 text-emerald-600" />
                                8. Self-Hosted Deployments
                            </h2>
                            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-md">
                                <p className="text-slate-700 dark:text-slate-200">
                                    AgroLeaf AI is fully open-source. If you self-host your own instance:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1 text-slate-600 dark:text-slate-300">
                                    <li>These Terms apply only to your use of our hosted services (api.agroleaf.ai).</li>
                                    <li>You are solely responsible for your own data handling, security, and compliance.</li>
                                    <li>We provide no warranty or support for self-hosted instances.</li>
                                    <li>Self-hosted instances do not send any data to us — they operate independently.</li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    <a
                                        href={REPOSITORY_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:underline inline-flex items-center gap-1"
                                    >
                                        Get the code on GitHub <ExternalLink className="h-3 w-3" />
                                    </a>
                                </p>
                            </div>
                        </section>

                        <Separator />

                        {/* Section 9: API Usage & Rate Limits */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <RefreshCw className="h-5 w-5 text-emerald-600" />
                                9. API Usage & Rate Limits
                            </h2>
                            <ul className="list-disc pl-6 space-y-1 text-slate-600 dark:text-slate-300">
                                <li>
                                    The hosted API is subject to rate limits (see <a href="/api" className="text-emerald-600 hover:underline">/api</a> for details).
                                </li>
                                <li>Excessive requests may result in temporary or permanent throttling.</li>
                                <li>We reserve the right to modify rate limits without prior notice.</li>
                                <li>
                                    For high-volume or commercial API access, please contact us to discuss
                                    options.
                                </li>
                            </ul>
                        </section>

                        <Separator />

                        {/* Section 10: Termination */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Ban className="h-5 w-5 text-emerald-600" />
                                10. Termination
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                We may terminate or suspend your access to the Platform immediately,
                                without prior notice or liability, for any reason, including without
                                limitation if you breach these Terms.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                                Upon termination, your right to use the Platform will cease immediately.
                                If you have an account, we may delete or archive it. You may also
                                terminate by discontinuing use of the Platform.
                            </p>
                        </section>

                        <Separator />

                        {/* Section 11: Modifications to Terms */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <RefreshCw className="h-5 w-5 text-emerald-600" />
                                11. Modifications to Terms
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                We reserve the right to modify these Terms at any time. Changes will be
                                effective immediately upon posting to this page. Your continued use of
                                the Platform after changes constitutes acceptance of the modified Terms.
                            </p>
                            <p className="text-slate-600 dark:text-slate-300">
                                Material changes will be announced via the Platform or email (if you
                                have an account).
                            </p>
                        </section>

                        <Separator />

                        {/* Section 12: Governing Law */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Gavel className="h-5 w-5 text-emerald-600" />
                                12. Governing Law
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                These Terms shall be governed by the laws of the State of Delaware,
                                without regard to its conflict of law provisions. Any disputes arising
                                from these Terms shall be resolved exclusively in the state or federal
                                courts located in Delaware.
                            </p>
                        </section>

                        <Separator />

                        {/* Section 13: Contact */}
                        <section className="space-y-3">
                            <h2 className="text-2xl font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                                <Mail className="h-5 w-5 text-emerald-600" />
                                13. Contact
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300">
                                If you have any questions about these Terms, please contact us:
                            </p>
                            <ul className="list-none space-y-1 text-slate-600 dark:text-slate-300">
                                <li>• Via email: <a href="mailto:legal@agroleaf.ai" className="text-emerald-600 hover:underline">legal@agroleaf.ai</a></li>
                                <li>• Through our <a href="/contact" className="text-emerald-600 hover:underline">/contact page</a></li>
                                <li>• On GitHub: <a href={REPOSITORY_URL} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">{REPOSITORY_URL}</a></li>
                            </ul>
                        </section>

                        <div className="pt-6 text-center text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
                            AgroLeaf AI · Open-source crop disease detection · MIT License
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.main>
    );
};

export default TermsPage;