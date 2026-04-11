"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Leaf } from 'lucide-react';
import { plusJakarta } from '@/fonts/google-fonts';

export default function DiagnosePage() {
    return (
        <div className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
            <Card className="border-border/60 shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                        <Leaf className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className={`${plusJakarta.className} text-3xl md:text-4xl`}>
                        Crop Disease Diagnosis
                    </CardTitle>
                    <CardDescription className="text-base">
                        Upload a clear photo of a leaf from Rice, Potato, or Corn
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">
                            Drag & drop or click to upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Supports JPG, PNG (max 10MB)
                        </p>
                    </div>
                    <Button className="w-full md:w-auto mx-auto block" size="lg">
                        Analyze Leaf
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}