"use client";

import { Leaf, Scan, Wheat } from 'lucide-react';
import { GiCorn, GiPotato } from 'react-icons/gi';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { plusJakarta } from '@/fonts/google-fonts';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 text-sm text-primary">
          <Leaf className="h-4 w-4" />
          <span>AI-Powered Plant Doctor</span>
        </div>
        <h1 className={`${plusJakarta.className} text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent`}>
          Diagnose Crop Diseases<br />Across Multiple Species
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a single leaf image — our Vision Transformer model detects diseases in Rice, Potato, Corn, and more.
          Instant, accurate, and farmer-friendly.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Link href="/diagnose">
            <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
              <Scan className="h-5 w-5" /> Start Diagnosis
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="gap-2">
              Learn How It Works
            </Button>
          </Link>
        </div>
      </section>

      {/* Supported Crops */}
      <section className="mt-24 md:mt-32">
        <h2 className={`${plusJakarta.className} text-2xl md:text-3xl font-bold text-center mb-12`}>
          Supported Crops
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { name: 'Rice', icon: Wheat, diseases: '7 classes • 19k images' },
            { name: 'Potato', icon: GiCorn, diseases: 'Late Blight • Early Blight' },
            { name: 'Corn', icon: GiPotato, diseases: 'Common Rust • Leaf Blight' },
          ].map((crop) => (
            <div key={crop.name} className="bg-card rounded-2xl p-6 text-center border border-border/50 shadow-sm hover:shadow-md transition-all">
              <crop.icon className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="font-semibold text-lg">{crop.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{crop.diseases}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}