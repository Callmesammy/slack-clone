import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID || "mock-github-id",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "mock-github-secret",
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || "mock-google-id",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "mock-google-secret",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const emailStr = credentials.email as string;
        const passwordStr = credentials.password as string;

        // Basic validation for frontend-first mock phase
        if (emailStr.includes("@") && passwordStr.length >= 6) {
          const username = emailStr.split("@")[0];
          return {
            id: Math.random().toString(36).substring(2, 15),
            name: username.charAt(0).toUpperCase() + username.slice(1),
            email: emailStr,
            username: username,
            image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username || token.name?.toLowerCase().replace(/\s+/g, "");
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).username = token.username as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "super-secret-key-must-be-at-least-32-bytes-long",
});
