"use client";

import React from "react";
import Head from "next/head";
import Link from "next/link";
import SignUpForm from "@/components/SignUpForm";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-purple-50 flex flex-col justify-center">
      <Head>
        <title>Create Account - GlowUp Skincare</title>
      </Head>

      <div className="max-w-md w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
          Create Account
        </h2>

        <SignUpForm />

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
      </div>
    </div>
  );
};

export default SignUp;
