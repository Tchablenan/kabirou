import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { clientIp, rateLimitHit, rateLimitPeek, rateLimitReset } from "@/lib/rate-limit";

const LOGIN_MAX_PER_EMAIL = 5;
const LOGIN_MAX_PER_IP = 20;
const LOGIN_WINDOW_SEC = 15 * 60;
// Hash bcrypt d'une valeur aléatoire, utilisé quand le compte n'existe pas
const DUMMY_HASH = "$2b$10$3YV5t74OEo5.oPW8.wWjQecJf0qA.uU3Vrfnv8SOfuXLqJ.iHebiu";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Anti force brute : 5 échecs par compte, 20 par adresse IP, sur 15 minutes
        const email = credentials.email.trim().toLowerCase();
        const ipKey = `login:ip:${clientIp(req?.headers)}`;
        const emailKey = `login:email:${email}`;
        const [byIp, byEmail] = await Promise.all([
          rateLimitPeek(ipKey, LOGIN_MAX_PER_IP),
          rateLimitPeek(emailKey, LOGIN_MAX_PER_EMAIL),
        ]);
        if (!byIp.ok || !byEmail.ok) {
          throw new Error("TooManyAttempts");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Comparaison toujours effectuée (hash factice si le compte n'existe pas) :
        // le temps de réponse ne révèle pas si l'e-mail existe
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user?.password || DUMMY_HASH
        );

        if (!user || !user.password || !isPasswordCorrect) {
          await Promise.all([
            rateLimitHit(ipKey, LOGIN_MAX_PER_IP, LOGIN_WINDOW_SEC),
            rateLimitHit(emailKey, LOGIN_MAX_PER_EMAIL, LOGIN_WINDOW_SEC),
          ]);
          throw new Error("Invalid credentials");
        }

        await rateLimitReset(emailKey);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image;
      }
      
      // Handle manual session updates
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.id = token.id;
        session.user.image = token.picture as string | null | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60, // 2 hours
    updateAge: 60 * 60,   // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
};
