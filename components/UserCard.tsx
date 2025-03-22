import React from "react";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

import { User } from "../app/types/user";

interface UserCardProps {
  user: User;
  isAdmin: boolean;
  isLoading: boolean;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onRecruit: () => void;
}

const UserCard = ({
  user,
  isAdmin,
  isLoading,
  selectedRole,
  onRoleChange,
  onRecruit,
}: UserCardProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold">
        {user.first_name} {user.last_name}
      </h2>
      <p className="text-gray-500">{user.role}</p>
      <div className="flex flex-wrap gap-2 my-4">
        <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
          {user.address}
        </span>
      </div>

      {isAdmin && (
        <div className="space-y-3">
          <Select
            value={selectedRole}
            onValueChange={onRoleChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
            </SelectContent>
          </Select>

          <button
            className={`w-full px-4 py-2 rounded-lg ${
              user.role === "Doctor"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white"
            }`}
            onClick={onRecruit}
            disabled={user.role === "Doctor" || isLoading}
          >
            {isLoading
              ? "Recruiting..."
              : user.role === "Doctor"
              ? "Recruited"
              : "Recruit"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
