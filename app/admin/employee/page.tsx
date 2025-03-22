"use client";

import React, { useEffect, useState } from "react";

import UserCard from "@/components/UserCard";
import CreateEmployeeModal from "@/components/CreateEmployeeModal";
import { FaPlus } from "react-icons/fa";

import { getAllUsers } from "@/app/services/userService";
import { createDoctor } from "@/app/services/doctorService";
import { updateExistingUser } from "@/app/controller/userController";
import { User } from "@/app/types/user";

const EmployeePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("Doctor");

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => user.role !== "Admin");

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
        await createDoctor(newDoctor);
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

  const handleUserAdded = async () => {
    const updatedUsers = await getAllUsers();
    setUsers(updatedUsers);
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-6 mt-30">
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

          <CreateEmployeeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUserAdded={handleUserAdded}
          />

          {/* User Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                isAdmin={true}
                isLoading={loading === user._id}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
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
