import {
  getBlogs as fetchBlogs,
  getBlogById as fetchBlogById,
  createBlog as createNewBlog,
  updateBlog as updateExistingBlog,
  deleteBlog as deleteExistingBlog,
} from "@/app/services/blogService";
import { toast } from "react-hot-toast";

export const getBlogs = async () => {
  try {
    const blogs = await fetchBlogs();
    return blogs;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const getBlogById = async (id: string) => {
  try {
    const blog = await fetchBlogById(id);
    return blog;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const createBlog = async (
  doctor_id: string,
  title: string,
  content: string
) => {
  try {
    const newBlog = await createNewBlog(doctor_id, title, content);
    toast.success("Blog created successfully!");
    return newBlog;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const updateBlog = async (id: string, blog: any) => {
  try {
    const updatedBlog = await updateExistingBlog(id, blog);
    toast.success("Blog updated successfully!");
    return updatedBlog;
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    await deleteExistingBlog(id);
    toast.success("Blog deleted successfully!");
  } catch (error: any) {
    toast.error(error.message);
    throw error;
  }
};
