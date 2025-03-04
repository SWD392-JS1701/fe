import axiosInstance from "./axiosInstance";

export const getSchedule = async () => {
  try {
    const response = await axiosInstance.get("/schedule");
    return response.data;
  } catch (error: any) {
    console.error("Schedule API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch schedule. Please try again."
    );
  }
};

export const getScheduleById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/schedule/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Schedule API Error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch schedule. Please try again."
    );
  }
};
