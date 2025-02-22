"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, User } from "@/app/services/userService";
import { createDoctor } from "@/app/services/doctorService";
import AdminNavbar from "@/components/AdminNavbar";

const EmployeePage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

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

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Recommended</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-gray-500">{user.role}</p>
              <div className="flex flex-wrap gap-2 my-4">
                <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  {user.address}
                </span>
              </div>
              <div className="flex gap-4">
                <button
                  className={`w-full px-4 py-2 rounded-lg ${
                    user.role === "Doctor"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white"
                  }`}
                  onClick={() => handleRecruit(user)}
                  disabled={user.role === "Doctor" || loading === user._id}
                >
                  {loading === user._id
                    ? "Recruiting..."
                    : user.role === "Doctor"
                    ? "Recruited"
                    : "Recruit"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
