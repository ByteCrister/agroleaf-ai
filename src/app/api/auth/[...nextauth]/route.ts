// app/api/auth/[...nextauth]/route.ts
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { findUserByEmail, createUserWithRandomPassword, verifyPassword } from "@/lib/auth/user";
import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required");
        }
        const email = credentials.email.toLowerCase();
        const userExists = await findUserByEmail(email);
        if (!userExists) {
          throw new Error("No account found with this email");
        }
        const isValid = await verifyPassword(email, credentials.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return { id: email, email, name: email.split("@")[0] };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // When signing in with Google, create a user record if it doesn't exist.
      if (account?.provider === "google" && user.email) {
        const exists = await findUserByEmail(user.email);
        if (!exists) {
          await createUserWithRandomPassword(
            user.email,
            user.name ?? user.email.split("@")[0],
            user.image ?? undefined
          );
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  },
  pages: { signIn: "/" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };