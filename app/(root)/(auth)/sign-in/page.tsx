"use client";

import React, { useState, FC, ChangeEvent, FormEvent, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";

import { signIn } from "next-auth/react";
import { jwtDecode } from "jwt-decode";


interface FormData {
  email: string;
  password: string;
}

interface JWTPayload {
  id: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

const SignIn: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {

      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });
  
      if (result?.error) {
        setError(result.error);

      } else {
        // Get the session to check the role
        const session = await fetch("/api/auth/session").then((res) => res.json());
        if (session?.user?.access_token) {
          const decoded: JWTPayload = jwtDecode(session.user.access_token);
          console.log("Decoded token:", decoded);
          
          if (decoded.role === "Admin") {
            router.push("/overview");
          } else {
            router.push("/");
          }
        }
      }
    } catch (err: any) {

      setError(
        err.message || "An error occurred during login. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50 flex flex-col justify-center">
        <Head>
          <title>Login - GlowUp Skincare</title>
        </Head>

        <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
            Login to GlowUp
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
              {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-gray-700 font-medium mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="********"
              />
              {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            {error && <p className="mt-2 text-red-500 text-center">{error}</p>}

            <div className="text-center mt-4">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-purple-600 hover:text-purple-800"
                >
                  Sign up
                </Link>
              </p>
              <p className="text-gray-600 mt-2">
                <Link
                  href="/email"
                  className="text-purple-600 hover:text-purple-800"
                >
                  Forget Password?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
