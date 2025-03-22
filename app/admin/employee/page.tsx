"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

import CreateEmployeeModal from "@/components/CreateEmployeeModal";
import { createNewDoctor } from "@/app/controller/doctorController";
import {
  fetchAllUsers,
  updateExistingUser,
} from "@/app/controller/userController";
import { User } from "@/app/types/user";

const EmployeePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("Doctor");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await fetchAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.role !== "Admin" &&
        (user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [users, searchTerm]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUserAdded = async () => {
    const updatedUsers = await fetchAllUsers();
    setUsers(updatedUsers);
  };

  const handleRecruit = async (user: User) => {
    if (loading) return;
    setLoading(user._id);

    try {
      const updatedUser = await updateExistingUser(user._id, {
        role: selectedRole,
      });

      if (selectedRole === "Doctor" && updatedUser) {
        const newDoctor = {
          user_Id: user._id,
          name: `${user.first_name} ${user.last_name}`,
          certification: "General Practitioner",
          schedule: "Mon-Fri 9 AM - 5 PM",
          description: "Newly recruited doctor",
        };
        await createNewDoctor(newDoctor);
      }

      if (updatedUser) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === user._id ? { ...u, role: selectedRole } : u
          )
        );
      }
    } catch (error) {
      console.error("Error recruiting user:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="px-6 py-1 bg-gray-100 min-h-screen relative mt-30">
      {/* Breadcrumb and Add Button */}
      <div className="bg-gray-100 p-4 mb-4 flex justify-between items-center rounded-lg">
        <nav className="text-gray-600 text-sm">
          <Link href="/admin/overview" className="hover:text-gray-800">
            <span>Dashboard</span>
          </Link>
          <span className="text-gray-400"> {" > "} </span>
          <span className="text-gray-800">Employees</span>
        </nav>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={16} className="mr-2" /> Add Employee
        </button>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              Employee Management ({totalItems} employees)
            </h1>
            <p className="text-sm text-gray-500">
              All employees ({totalItems} items)
            </p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <svg
              className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Role</th>
                <th className="p-3">Address</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.phone_number || "N/A"}</td>
                  <td className="p-3">
                    {user.role === "User" ? (
                      <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                        disabled={loading === user._id}
                      >
                        <SelectTrigger className="w-25">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Doctor">Doctor</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span>{user.role}</span>
                    )}
                  </td>
                  <td className="p-3">{user.address || "N/A"}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      {user.role === "User" ? (
                        <button
                          onClick={() => handleRecruit(user)}
                          disabled={loading === user._id}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          {loading === user._id ? "Recruiting..." : "Recruit"}
                        </button>
                      ) : (
                        <span className="text-gray-500 text-sm">Recruited</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} entries
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              {"<"}
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 border rounded-lg ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-lg disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>

      <CreateEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default EmployeePage;
