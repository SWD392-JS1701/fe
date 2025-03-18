"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
