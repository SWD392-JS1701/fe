import axiosInstance from "./axiosInstance";

export const getBlogs = async () => {
  try {
    const response = await axiosInstance.get("/blogs");
    return response.data;
  } catch (error: any) {
    console.error("Get Blogs API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch. Please try again."
    );
  }
};

export const getBlogById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/blogs/${id}`);
    console.log("API Response for getBlogById:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Get Blog By ID API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch. Please try again."
    );
  }
};

export const createBlog = async (
  user_id: string,
  title: string,
  content: string
) => {
  try {
    const response = await axiosInstance.post("/blogs/blogcreate", {
      user_id,
      title,
      content,
    });
    return response.data;
  } catch (error: any) {
    console.error("Create Blog API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create. Please try again."
    );
  }
};

export const updateBlog = async (id: string, blog: any) => {
  try {
    const response = await axiosInstance.put(`/blogs/${id}`, blog);
    return response.data;
  } catch (error: any) {
    console.error("Update Blog API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update. Please try again."
    );
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/blogs/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Delete Blog API Error:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete. Please try again."
    );
  }
};
