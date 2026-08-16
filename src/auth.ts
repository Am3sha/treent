import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import {
  clearLoginFailures,
  isLoginRateLimited,
  recordLoginFailure,
} from "@/lib/request-security";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "info@trennt.sa" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
    if (!credentials?.email || !credentials?.password) {
      console.log("[auth] missing credentials");
      return null;
    }

    const email = String(credentials.email);
    if (isLoginRateLimited(req, email)) {
      console.log("[auth] rate limited:", email);
      return null;
    }

    const adminEmail = process.env.ADMIN_EMAIL?.trim().replace(/^["']|["']$/g, "");
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim().replace(/^["']|["']$/g, "");

    console.log("[auth] ADMIN_EMAIL exists:", !!adminEmail, "value:", adminEmail);
    console.log("[auth] ADMIN_PASSWORD_HASH exists:", !!adminPasswordHash, "length:", adminPasswordHash?.length, "prefix:", adminPasswordHash?.slice(0, 7));
    console.log("[auth] input email raw:", JSON.stringify(email));
    console.log("[auth] input email trimmed:", JSON.stringify(email.trim()));
    console.log("[auth] input email lowered:", JSON.stringify(email.trim().toLowerCase()));

    if (!adminEmail || !adminPasswordHash) {
      console.log("[auth] missing env vars");
      recordLoginFailure(req, email);
      return null;
    }

    const normalizedInput = email.trim().toLowerCase();
    const normalizedAdmin = adminEmail.trim().toLowerCase();
    console.log("[auth] normalized input vs admin:", normalizedInput === normalizedAdmin);

    if (normalizedInput !== normalizedAdmin) {
      console.log("[auth] email mismatch raw:", email, "vs", adminEmail);
      recordLoginFailure(req, email);
      return null;
    }

    const passwordMatch = await bcrypt.compare(String(credentials.password), adminPasswordHash);
    console.log("[auth] bcrypt match:", passwordMatch);
    if (!passwordMatch) {
      recordLoginFailure(req, email);
      return null;
    }

    clearLoginFailures(req, email);

    return {
      id: "admin",
      email: adminEmail,
      name: "Admin",
    };
  },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
