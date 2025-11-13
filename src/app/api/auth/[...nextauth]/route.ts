import { prisma } from "@/lib/db";
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Account, Profile, Session, User } from "next-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const authOptions : NextAuthOptions = {
    session: { strategy: "jwt" },
    providers: [
        // 1) Credentials Provider (email + password)
        Credentials({
         name: "Credentials",
         credentials: {
            email: { label: "Email", type: "text" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            // Basic guards
            if (!credentials?.email || !credentials?.password) {
                throw new Error("Email and password are required");
            }

            // Look up user in the database
            const user = await prisma.user.findUnique({
                where: { email: credentials.email },
            });

            if (!user || !user.password) {
                throw new Error("Invalid email or password");

            }

            // Compare password with hashed version
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) {
                throw new Error("Invalid email or password");
            }

            // Return the shape that will become `session.user`
            return {
                id: user.id,
                name: user.name ?? user.email,
                email: user.email
            };
          },
        }),   
        
        // 2) GitHub OAuth Provider
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        }),

        // 3) Google OAuth Provider
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
    ],
    callbacks: {
        async jwt({ token, user }:{
            token: JWT;
            user?: User | null;
        }) {
            if (user) {
                // Runs on initial sign in
                token.id = user.id;
        }
        return token;
    },

    // Expose id on session.user so we can use it in requireUser()
    async session({ session, token}:{
        session: Session;
        token: JWT;
    }) {
        if (token?.id && session.user){
            (session.user as any).id = token.id;
        }
        return session;
    },

    // Optional: control who can sign in
    async signIn({ user, account }:{
        user: User;
        account: Account | null;
    }) {
        // You can restrict domains, providers. etc. here
        // For now, allow all sign-ins
        return true;
    },

},
    pages: {
        // Can create custom pages later
        // signIn: '/auth/signin',
        // error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };