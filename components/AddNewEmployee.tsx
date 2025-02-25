import React, { useState, ChangeEvent, FormEvent } from "react";
import { Dialog } from "@/components/ui/dialog";
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
  role: string;
}

interface AddEmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddEmployeeForm = ({
  isOpen,
  onClose,
  onSuccess,
}: AddEmployeeFormProps) => {
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
    role: "Doctor",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        formData.address,
        formData.role // Include role for employees created by admin
      );

      onClose();
      onSuccess();

      // Reset form
      setFormData({
        name: "",
        first_name: "",
        last_name: "",
        email: "",
        plainPassword: "",
        confirmPassword: "",
        phone: "",
        address: "",
        role: "Doctor",
      });
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Username
              </label>
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
                placeholder="First name"
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
                placeholder="Last name"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>
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
                <p className="text-red-500 text-sm mt-1">
                  {errors.plainPassword}
                </p>
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
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Phone number"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Address"
              />
            </div>

            {/* Role selection for admin users */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              >
                <option value="Doctor">Doctor</option>
                <option value="Staff">Staff</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default AddEmployeeForm;
