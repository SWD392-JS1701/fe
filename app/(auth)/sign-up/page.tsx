"use client";

import React, { useState, FC, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Head from "next/head";
import { register } from "@/app/services/authService";
import { useRouter } from "next/navigation";

interface FormData {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

const SignUp: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.first_name) newErrors.first_name = "First name is required";
    if (!formData.last_name) newErrors.last_name = "Last name is required";
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    if (!validateForm()) {
      console.log("Form is invalid");
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.first_name,
        formData.last_name,
        formData.phone,
        formData.address
      );
      router.push("/sign-in");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50 flex flex-col justify-center">
      <Head>
        <title>Create Account - GlowUp Skincare</title>
      </Head>

      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              User Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="first_name"
              className="block text-gray-700 font-medium mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.first_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your first name"
            />
            {errors.first_name && (
              <p className="mt-1 text-red-500 text-sm">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-gray-700 font-medium mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.last_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your last name"
            />
            {errors.last_name && (
              <p className="mt-1 text-red-500 text-sm">{errors.last_name}</p>
            )}
          </div>

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
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
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
              htmlFor="phone"
              className="block text-gray-700 font-medium mb-2"
            >
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-gray-700 font-medium mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.address ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Your address"
            />
            {errors.address && (
              <p className="mt-1 text-red-500 text-sm">{errors.address}</p>
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
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="mt-2">
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200"
            >
              Create Account
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-purple-600 hover:text-purple-800"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
