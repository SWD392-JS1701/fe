"use client";

import React, { useState, ChangeEvent } from "react";
import Swal from "sweetalert2";

import { resetPassword } from "@/app/services/authService";
import { useRouter } from "next/navigation";

const ChangePasswordPage = () => {
  const token = localStorage.getItem("access_token");
  const router = useRouter();
  const [newPassword, setNewPassword] = useState<string>("");
  const [passwordValidation, setPasswordValidation] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);

    setPasswordValidation({
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      length: password.length >= 8,
    });
  };

  const handleResetPassword = async () => {
    if (Object.values(passwordValidation).every((rule) => rule)) {
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "No token found",
          text: "Please log in to reset your password.",
          showConfirmButton: false,
          timer: 1500,
        });
        router.push("/sign-in");
        return;
      }

      try {
        await resetPassword(token, newPassword);
        Swal.fire({
          icon: "success",
          title: "Password reset successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "Failed to reset password",
          text: error.message || "Please try again.",
          showConfirmButton: false,
          timer: 1500,
        });
        console.error("Reset Password API Error:", error);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid password",
        text: "Please ensure the password meets the requirements.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Reset Password
        </h1>

        <div className="mb-6">
          <label
            htmlFor="newPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            New password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your new password"
          />
          <div className="mt-2 space-y-1 text-sm">
            <p
              className={
                passwordValidation.lowercase ? "text-green-500" : "text-red-500"
              }
            >
              {passwordValidation.lowercase ? "✔" : "✘"} At least one lowercase
              letter
            </p>
            <p
              className={
                passwordValidation.uppercase ? "text-green-500" : "text-red-500"
              }
            >
              {passwordValidation.uppercase ? "✔" : "✘"} At least one uppercase
              letter
            </p>
            <p
              className={
                passwordValidation.number ? "text-green-500" : "text-red-500"
              }
            >
              {passwordValidation.number ? "✔" : "✘"} At least one number
            </p>
            <p
              className={
                passwordValidation.length ? "text-green-500" : "text-red-500"
              }
            >
              {passwordValidation.length ? "✔" : "✘"} Minimum 8 characters
            </p>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            onClick={() => router.back()}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
