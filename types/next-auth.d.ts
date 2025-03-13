import { DefaultSession, DefaultUser } from "next-auth";
import {JWT,DefaultJWT} from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    access_token?: string;
    refresh_token?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string;
      email?: string;
      role?: string;
      access_token?: string;
      refresh_token?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT{
        role?: string;
        access_token?: string;
        expiration: number;
    }
}