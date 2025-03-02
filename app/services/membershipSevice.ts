import axiosInstance from "./axiosInstance";

interface Membership {
  name: string;
  description: string;
  discount_percentage: number;
  point_value: number;
}

export const getMemberships = async () => {
  try {
    const response = await axiosInstance.get("/memberships");
    return response.data;
  } catch (error: any) {
    console.error("Get Memberships API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch memberships. Please try again."
    );
  }
};

export const getMembershipById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/memberships/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Get Membership By ID API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch membership. Please try again."
    );
  }
};

export const createMembership = async (membership: Membership) => {
  try {
    const response = await axiosInstance.post(
      "/memberships/create",
      membership
    );
    return response.data;
  } catch (error: any) {
    console.error("Create Membership API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to create membership. Please try again."
    );
  }
};

export const updateMembership = async (id: string, membership: Membership) => {
  try {
    const response = await axiosInstance.patch(
      `/memberships/${id}`,
      membership
    );
    return response.data;
  } catch (error: any) {
    console.error("Update Membership API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to update membership. Please try again."
    );
  }
};

export const deleteMembership = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/memberships/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete Membership API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to delete membership. Please try again."
    );
  }
};
