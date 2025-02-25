import React, { useState, ChangeEvent, FormEvent } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "@/app/services/authService";

interface FormData {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  plainPassword: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    plainPassword: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing in a field
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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

    if (!formData.plainPassword) {
      newErrors.plainPassword = "Password is required";
    } else if (formData.plainPassword.length < 6) {
      newErrors.plainPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.plainPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await register(
        formData.name,
        formData.email,
        formData.plainPassword,
        formData.first_name,
        formData.last_name,
        formData.phone,
        formData.address
        // No role parameter - will use default role for new users
      );

      // Redirect or show success message
      window.location.href = "/sign-in";
    } catch (error: any) {
      setSubmitError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {submitError}
        </div>
      )}

      <div>
        <label className="block text-gray-700 font-medium mb-2">Username</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          placeholder="Choose a username"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          First Name
        </label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          placeholder="Your first name"
        />
        {errors.first_name && (
          <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Last Name
        </label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          placeholder="Your last name"
        />
        {errors.last_name && (
          <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="relative">
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          name="plainPassword"
          value={formData.plainPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          placeholder="Create a password"
        />
        <div
          className="absolute inset-y-0 right-0 top-8 pr-3 flex items-center cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </div>
        {errors.plainPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.plainPassword}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          placeholder="Your phone number"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
          placeholder="Your address"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed mt-6"
      >
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignUpForm;
