import { jwtDecode } from "jwt-decode";
import { User } from "@/lib/redux/store";

interface JWTPayload {
  id: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const getUserFromToken = async (): Promise<User | null> => {
  if (typeof window === "undefined") return null;

  try {
    const response = await fetch("/api/auth/session", {
      headers: {
        accept: "application/json",
      },
    });
    const session = await response.json();

    if (!session?.user?.access_token) {
      console.log("No access_token in session");
      return null;
    }

    const decoded: JWTPayload = jwtDecode(session.user.access_token);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.log("Token expired");
      return null;
    }

    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      access_token: session.user.access_token,
    };
  } catch (error) {
    console.error("Error fetching user from session:", error);
    return null;
  }
};
