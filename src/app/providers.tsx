"use client";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SessionSync } from "@/components/wrappers/SessionSync";
import { SessionProvider } from "next-auth/react";

export default function Providers({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SessionProvider>
        <SessionSync />
        <Header />
        {children}
        <Footer />
    </SessionProvider>;
}