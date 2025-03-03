import { API_URL } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect,useState } from "react";
interface DecodedToken {
  role: string;
  exp: number;
}
export const register = async (
  username: string,
  email: string,
  plainPassword: string,
  first_name: string,
  last_name: string,
  phone_number: string,
  address: string,
  role?: string
) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      plainPassword,
      first_name,
      last_name,
      phone_number,
      address,
      role,
    });

    return response.data;
  } catch (error: any) {
    console.error("Register API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to register. Please try again."
    );
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const data = response.data;
    localStorage.setItem("access_token", data.access_token);
    return data;
  } catch (error: any) {
    console.error("Login API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch. Please try again."
    );
  }
};
const getAccessToken = (): string | null => {
  const storedToken = localStorage.getItem("access_token");

  if (!storedToken) return null;

  try {
    const parsedToken = JSON.parse(storedToken);
    return parsedToken.access_token;
  } catch (error) {
    console.error("Error parsing access token:", error);
    return null;
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};
export const useAuthRedirect = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = getAccessToken();

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("access_token");
      router.push("/sign-in");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  return { isChecking };
};


export const getUserRole = (): string | null => {
  const token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const decoded: DecodedToken = jwtDecode(token);
    return decoded.role || null;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

