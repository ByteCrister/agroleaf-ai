import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createUserIfNotExists } from "@/utils/auth/user";
import NextAuth from "next-auth/next";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Email Login",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                // ⚠️ Replace with real validation logic
                if (!credentials?.email) return null;

                return {
                    id: crypto.randomUUID(),
                    email: credentials.email,
                    name: credentials.email.split("@")[0],
                };
            },
        }),
    ],

    callbacks: {
        async signIn({ user }) {
            if (user?.email) {
                await createUserIfNotExists({
                    id: user.id!,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                });
            }
            return true;
        },

        async jwt({ token, user }) {
            if (user) token.id = user.id;
            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
    },
});

export { handler as GET, handler as POST };
