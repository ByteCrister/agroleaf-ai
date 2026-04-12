"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, Variants } from "framer-motion";
import {
  SiGithub,
  SiLinkerd,
  SiFacebook,
  SiInstagram,
} from "react-icons/si";
import { Mail, Loader2 } from "lucide-react";

// shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SOCIAL_LINKS } from "@/const/social-links";

// Custom field wrapper component
function FormField({
  label,
  error,
  htmlFor,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Please select a subject" }),
  message: z.string().min(5, { message: "Message must be at least 5 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const subjectOptions = [
  "General Inquiry",
  "Bug Report",
  "Feature Request",
  "API Support",
  "Partnership/Collaboration",
  "Other",
] as const;

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    // Simulate API call / email sending
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form data:", data);
    alert("Message sent successfully! (Demo mode - no actual email was delivered)");
    reset();
    setIsSubmitting(false);
  }

  // Data for Connect With Me section
  const connectLinks = [
    {
      name: "GitHub",
      icon: SiGithub,
      description: "View my projects and contribute",
      url: SOCIAL_LINKS.GITHUB,
    },
    {
      name: "LinkedIn",
      icon: SiLinkerd,
      description: "Connect professionally",
      url: SOCIAL_LINKS.LINKEDIN,
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      description: "Follow me on Facebook",
      url: "https://facebook.com/your-username", // Replace with actual URL
    },
    {
      name: "Instagram",
      icon: SiInstagram,
      description: "See my posts and updates",
      url: SOCIAL_LINKS.INSTAGRAM,
    },
    {
      name: "Email",
      icon: Mail,
      description: "Send me an email directly",
      url: SOCIAL_LINKS.EMAIL,
    },
  ];

  // Specific Inquiry Routing data
  const inquiryRoutes = [
    {
      title: "Bug Reports",
      content: (
        <>
          For bugs, please open a GitHub Issue at{" "}
          <a
            href="https://github.com/ByteCrister/agroleaf-ai/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            https://github.com/ByteCrister/agroleaf-ai/issues
          </a>
          . Include: steps to reproduce, expected vs. actual behavior, screenshots, browser/device info.
        </>
      ),
    },
    {
      title: "Feature Requests",
      content: (
        <>
          Have an idea for a new crop, disease, or feature? Open a GitHub Issue with the &apos;enhancement&apos;
          label or use the form above.
        </>
      ),
    },
    {
      title: "API Support",
      content: (
        <>
          Check the <span className="font-mono text-sm">/api</span> documentation and{" "}
          <span className="font-mono text-sm">/help</span> page first. For unresolved issues, use the
          contact form with subject &apos;API Support&apos;.
        </>
      ),
    },
    {
      title: "Research & Collaboration",
      content: (
        <>
          Interested in using AgroLeaf AI in your research or integrating it into your agricultural
          platform? Reach out via the form or email.
        </>
      ),
    },
    {
      title: "Privacy & Data",
      content: (
        <>
          For data deletion or privacy-related requests, see our{" "}
          <span className="font-mono text-sm">/privacy</span> page or email directly.
        </>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-12 text-center md:mb-16"
        >
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Get In Touch
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            Questions, feedback, bug reports, or collaboration ideas — I&apos;d love to hear from you.
          </p>
        </motion.div>

        {/* Two-column layout: Contact Form + Connect With Me */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mb-16 grid gap-8 lg:grid-cols-2"
        >
          {/* Contact Form Card */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and I&apos;ll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <FormField
                    label="Name *"
                    error={errors.name?.message}
                    htmlFor="name"
                  >
                    <Input
                      id="name"
                      placeholder="Your name"
                      {...register("name")}
                    />
                  </FormField>

                  {/* Email Field */}
                  <FormField
                    label="Email *"
                    error={errors.email?.message}
                    htmlFor="email"
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                    />
                  </FormField>

                  {/* Subject Field (Select) */}
                  <FormField
                    label="Subject *"
                    error={errors.subject?.message}
                    htmlFor="subject"
                  >
                    <Controller
                      name="subject"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger id="subject">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjectOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormField>

                  {/* Message Field */}
                  <FormField
                    label="Message *"
                    error={errors.message?.message}
                    htmlFor="message"
                  >
                    <Textarea
                      id="message"
                      placeholder="How can I help you?"
                      className="min-h-30"
                      {...register("message")}
                    />
                  </FormField>

                  <div className="space-y-3">
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Message
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      I typically respond within 24-48 hours.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connect With Me Grid */}
          <motion.div variants={fadeInUp}>
            <Card className="h-full shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Connect With Me</CardTitle>
                <CardDescription>
                  Find me on these platforms for collaboration, updates, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {connectLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 rounded-lg border p-4 transition-all hover:border-primary hover:bg-accent/50 hover:shadow-sm"
                    >
                      <div className="rounded-full bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <link.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{link.name}</h3>
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Specific Inquiry Routing */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Specific Inquiry Routing</CardTitle>
              <CardDescription>
                For faster handling, please refer to the appropriate channel below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {inquiryRoutes.map((route) => (
                  <div
                    key={route.title}
                    className="rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                  >
                    <h3 className="mb-2 font-semibold text-primary">{route.title}</h3>
                    <p className="text-sm text-muted-foreground">{route.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Open Source Community */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Open Source Community</CardTitle>
              <CardDescription>
                AgroLeaf AI is open-source and community-driven. The best way to contribute is through
                GitHub:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Star the repo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Fork and submit PRs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Report issues</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>Improve documentation</span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-start md:justify-end">
                  <Button asChild variant="outline" className="w-full md:w-auto">
                    <a
                      href="https://github.com/ByteCrister/agroleaf-ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <SiGithub className="h-4 w-4" />
                      Visit GitHub Repository
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}