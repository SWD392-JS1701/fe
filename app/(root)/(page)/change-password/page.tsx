"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";

const ChangePasswordPage = () => {
  const [code, setCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
  const [passwordValidation, setPasswordValidation] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (e.target.value.length === 6) {
      setIsCodeVerified(true); // Simulate code verification
    } else {
      setIsCodeVerified(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);

    // Validate password
    setPasswordValidation({
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      length: password.length >= 8,
    });
  };

  const handleResetPassword = () => {
    if (
      isCodeVerified &&
      Object.values(passwordValidation).every((rule) => rule)
    ) {
      Swal.fire({
        icon: "success",
        title: "Password reset successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
      // Add your logic to reset the password here
    } else {
      Swal.fire({
        icon: "error",
        title:
          "Please complete all fields and ensure the password meets the requirements.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Reset Password
        </h1>

        {/* Code Verification Section */}
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Enter the code sent to{" "}
            <span className="font-semibold">abc@gmail.com</span> to reset
            your password.
          </p>
          <div className="flex justify-between space-x-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={code[index] || ""}
                onChange={handleCodeChange}
                className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>
          {isCodeVerified && (
            <p className="text-green-500 text-sm mt-2">✔ Code verified</p>
          )}
        </div>

        {/* New Password Section */}
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

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            onClick={() => alert("Cancel clicked")}
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
