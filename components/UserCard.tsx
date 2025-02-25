import React from "react";
import { User } from "@/app/services/userService";

interface UserCardProps {
  user: User;
  isAdmin: boolean;
  isLoading: boolean;
  onRecruit: () => void;
}

const UserCard = ({ user, isAdmin, isLoading, onRecruit }: UserCardProps) => {
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
        <div className="flex gap-4">
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
