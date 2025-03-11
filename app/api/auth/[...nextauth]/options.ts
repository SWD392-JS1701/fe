import NextAuth, { NextAuthOptions, User, Session, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { login } from "@/app/services/authService";
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import { API_URL } from "@/config";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      access_token: string;
    } & DefaultSession["user"]
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    access_token?: string;
    refresh_token?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError";
  }
}

interface JWTPayload {
  id: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refresh_token }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed:", {
        status: response.status,
        data: data
      });
      throw new Error("Failed to refresh access token");
    }

    return {
      ...token,
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? token.refresh_token,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
  } catch (error) {
    console.error("Refresh token failed", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
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
          
          if (user?.tokens.access_token) {
            const decoded: JWTPayload = jwtDecode(user.tokens.access_token);
            console.log("Decoded token:", decoded);
            return {
              id: decoded.id,
              name: decoded.username,
              email: email,
              role: decoded.role,
              access_token: user.tokens.access_token,
              refresh_token: user.tokens.refreshToken,
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
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in - set up the token
        return {
          ...token,
          id: user.id,
          role: user.role,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          accessTokenExpires: Date.now() + 15 * 60 * 1000 // 15 minutes
        };
      }

      // On subsequent calls, check if token needs refresh
      // Refresh when less than 1 minute left
      if (token.accessTokenExpires && Date.now() + 60 * 1000 > token.accessTokenExpires) {
        console.log("Token is about to expire, attempting refresh");
        try {
          const refreshedToken = await refreshAccessToken(token);
          if (refreshedToken.error) {
            // If refresh failed, but old token is still valid, keep using it
            if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
              console.log("Refresh failed but current token still valid");
              return token;
            }
            // If refresh failed and token is expired, force sign out
            console.log("Refresh failed and token expired");
            throw new Error("RefreshAccessTokenError");
          }
          console.log("Token refreshed successfully");
          return refreshedToken;
        } catch (error) {
          console.error("Error refreshing token:", error);
          return {
            ...token,
            error: "RefreshAccessTokenError"
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        // Instead of returning null, return a session with an error flag
        return {
          ...session,
          error: "RefreshAccessTokenError"
        } as Session;
      }

      if (token && session.user) {
        session.user.id = token.id!;
        session.user.role = token.role!;
        session.user.access_token = token.access_token!;
      }
      
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      console.log("User signed out, cleaning up...");
      // You can add cleanup logic here if needed
    },
    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        console.log("Session ended due to refresh token error");
      }
    }
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);