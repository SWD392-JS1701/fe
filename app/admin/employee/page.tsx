"use client";

import React, {
  useEffect,
  useState,
  ReactNode,
  ChangeEvent,
  FormEvent,
} from "react";

import UserCard from "@/components/UserCard";
import { FaPlus, FaEye, FaEyeSlash } from "react-icons/fa";

import { getAllUsers } from "@/app/services/userService";
import { createDoctor } from "@/app/services/doctorService";
import { register } from "@/app/services/authService";
import { User } from "@/app/types/user";

interface FormData {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  plainPassword: string;
  confirmPassword: string;
  phone: string;
  address: string;
  role?: string;
}

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

const EmployeePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => user.role !== "admin");

  const handleRecruit = async (user: User) => {
    if (loading) return;
    setLoading(user._id);

    const newDoctor = {
      user_Id: user._id,
      certification: "General Practitioner",
      schedule: "Mon-Fri 9 AM - 5 PM",
      description: "Newly recruited doctor",
    };

    const result = await createDoctor(newDoctor);
    if (result) {
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, role: "Doctor" } : u
        )
      );
    }
    setLoading(null);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!validateForm()) return;

    try {
      await register(
        formData.name,
        formData.email,
        formData.plainPassword,
        formData.first_name,
        formData.last_name,
        formData.phone,
        formData.address,
        formData.role
      );
      setIsModalOpen(false);
      // Refresh users list
      const updatedUsers = await getAllUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Recommended</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              <FaPlus className="inline-block mr-2" />
              Add
            </button>
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="relative">
              <h2 className="text-2xl font-bold mb-4">Add New Employee</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        User Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                        placeholder="Your name"
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
                        <p className="text-red-500 text-sm mt-1">
                          {errors.first_name}
                        </p>
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
                        <p className="text-red-500 text-sm mt-1">
                          {errors.last_name}
                        </p>
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
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
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
                        placeholder="Confirm your password"
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
                        placeholder="Your phone number"
                      />
                    </div>

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
                    </div>
                  </div>
                </div>

                {/* Address field spanning both columns */}
                <div className="mt-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                    placeholder="Your address"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </Modal>

          {/* User Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                isAdmin={true}
                isLoading={loading === user._id}
                onRecruit={() => handleRecruit(user)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeePage;
