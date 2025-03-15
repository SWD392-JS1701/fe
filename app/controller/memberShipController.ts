import {
  getMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
} from "@/app/services/membershipSevice";
import { toast } from "react-hot-toast";
import { Membership } from "../types/membership";

export const fetchAllMemberships = async () => {
  try {
    const memberships = await getMemberships();
    return memberships;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const fetchMembershipById = async (id: string) => {
  try {
    const membership = await getMembershipById(id);
    return membership;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createNewMembership = async (membership: Membership) => {
  try {
    const newMembership = await createMembership(membership);
    toast.success("Membership created successfully!");
    return newMembership;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateExistingMembership = async (
  id: string,
  membership: Membership
) => {
  try {
    const updatedMembership = await updateMembership(id, membership);
    toast.success("Membership updated successfully!");
    return updatedMembership;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteExistingMembership = async (id: string) => {
  try {
    const result = await deleteMembership(id);
    toast.success("Membership deleted successfully!");
    return result;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
