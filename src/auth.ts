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
        console.error("[auth] authorize entered");
        if (!credentials?.email || !credentials?.password) {
          console.error("[auth] missing credentials");
          return null;
        }

        const email = String(credentials.email);
        if (isLoginRateLimited(req, email)) {
          console.error("[auth] rate limited");
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL?.trim().replace(/^["']|["']$/g, "");
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH?.trim().replace(/^["']|["']$/g, "");


        if (!adminEmail || !adminPasswordHash) {
          recordLoginFailure(req, email);
          return null;
        }

        const normalizedInput = email.trim().toLowerCase();
        const normalizedAdmin = adminEmail.trim().toLowerCase();

        if (normalizedInput !== normalizedAdmin) {
          console.error("[auth] email mismatch");
          recordLoginFailure(req, email);
          return null;
        }

        const passwordMatch = await bcrypt.compare(String(credentials.password), adminPasswordHash);
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
