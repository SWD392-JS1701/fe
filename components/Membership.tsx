import React, { FC, useState, Dispatch, SetStateAction } from "react";
import Swal from "sweetalert2";
import { updateUser } from "@/app/services/userService";

interface Membership {
  _id: string;
  name: string;
  description: string;
  discount_percentage: number;
  point_value: number;
  createdAt: string;
  updatedAt: string;
}

interface MembershipProps {
  memberships: Membership[];
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

const Membership: FC<MembershipProps> = ({ memberships, user, setUser }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleJoin = async (membershipId: string) => {
    setLoading(membershipId);

    try {
      const updatedUserData = await updateUser(user.id, {
        membership_id: membershipId,
      });

      if (updatedUserData) {
        setUser((prevUser: any) => ({
          ...prevUser,
          membership_id: membershipId,
        }));
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `Successfully joined ${
            memberships.find((m) => m._id === membershipId)?.name
          }!`,
          confirmButtonColor: "#9333EA",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to join membership. Please try again.",
          confirmButtonColor: "#9333EA",
          confirmButtonText: "OK",
        });
      }
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to join membership. Please try again.",
        confirmButtonColor: "#9333EA",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border">
      <h2 className="text-2xl font-bold text-black mb-6">
        Your Membership Options
      </h2>
      {memberships.length === 0 ? (
        <p className="text-gray-600">No memberships available at this time.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((membership) => {
            const isJoined = user.membership_id === membership._id;
            return (
              <div
                key={membership._id}
                className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col h-64"
              >
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                  {membership.name}
                </h3>
                <p className="text-gray-700 mb-4 flex-grow">
                  {membership.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Discount:</span>{" "}
                    {membership.discount_percentage}% off
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Points:</span>{" "}
                    {membership.point_value}
                  </p>
                </div>
                <button
                  onClick={() => handleJoin(membership._id)}
                  disabled={isJoined || loading === membership._id}
                  className={`mt-4 w-full py-2 px-4 rounded-full transition-colors duration-300 ${
                    isJoined
                      ? "bg-green-500 text-white cursor-not-allowed opacity-75"
                      : loading === membership._id
                      ? "bg-purple-600 text-white opacity-50 cursor-not-allowed"
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  {isJoined
                    ? "Joined"
                    : loading === membership._id
                    ? "Joining..."
                    : "Join Now"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Membership;
