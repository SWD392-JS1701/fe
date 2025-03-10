import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/app/services/authService";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  id: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Please enter your email and password");
        }
        const { email, password } = credentials;
        try {
          const user = await login(email, password);
          if (user?.access_token) {
            const decoded: JWTPayload = jwtDecode(user.access_token);
            return {
              id: decoded.id,
              name: decoded.username,
              email: email,
              role: decoded.role,
              access_token: user.access_token,
            } as User;
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | null }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT & { id?: string };
    }) {
      if (token && session.user) {
        session.user.id = token.id!;
        session.user.role = token.role;
        session.user.access_token = token.access_token;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
