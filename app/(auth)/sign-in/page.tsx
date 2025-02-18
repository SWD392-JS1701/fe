"use client";

import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Head from "next/head";

interface FormData {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      // Handle login logic here
      console.log("Login submitted:", formData);
      // Redirect or show success message
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
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
              )}
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
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="********"
              />
              {errors.password && (
                <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
              )}
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
            >
              Log In
            </button>

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
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
