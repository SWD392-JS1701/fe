"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/app/services/blogService";
import { useSession } from "next-auth/react";
import { Blog } from "@/app/types/blog";

declare module "next-auth" {
  interface User {
    _id: string;
  }
}

const BlogPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"view" | "create" | "edit">(
    "view"
  );
  const [formData, setFormData] = useState(() => {
    if (typeof window !== "undefined") {
      const savedDraft = localStorage.getItem("blogDraft");
      if (savedDraft) {
        try {
          return JSON.parse(savedDraft);
        } catch (e) {
          console.error("Error parsing saved draft:", e);
        }
      }
    }
    return { title: "", content: "" };
  });
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log(session);
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (activeTab === "create") {
      if (formData.title.trim() || formData.content.trim()) {
        localStorage.setItem("blogDraft", JSON.stringify(formData));
      }
    }
  }, [formData, activeTab]);

  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      toast.error("Failed to load blogs");
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      setLoading(true);
      await deleteBlog(id);
      toast.success("Blog deleted successfully");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to delete blog");
      console.error("Error deleting blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
    });
    setActiveTab("edit");
  };

  const handleViewBlog = (id: string) => {
    router.push(`/staff/blog/${id}`);
  };

  const handleTabChange = (tab: "view" | "create" | "edit") => {
    if (tab === "create") {
      const savedDraft = localStorage.getItem("blogDraft");
      if (savedDraft) {
        try {
          setFormData(JSON.parse(savedDraft));
          toast.success("Draft restored successfully");
        } catch (e) {
          console.error("Error restoring draft:", e);
          toast.error("Failed to restore draft");
        }
      }
    } else if (tab !== "edit") {
      setFormData({ title: "", content: "" });
      setSelectedBlog(null);
    }
    setActiveTab(tab);
  };

  const handleCreateBlog = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!session?.user?.id) {
      toast.error("You must be logged in to create a blog");
      return;
    }

    try {
      await createBlog(session.user.id, formData.title, formData.content);
      toast.success("Blog created successfully");
      localStorage.removeItem("blogDraft");
      setFormData({ title: "", content: "" });
      handleTabChange("view");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to create blog");
      console.error("Error creating blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBlog = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!session?.user?.id || !selectedBlog) {
      toast.error("You must be logged in to update a blog");
      return;
    }

    try {
      await updateBlog(selectedBlog._id, {
        title: formData.title,
        content: formData.content,
      });
      toast.success("Blog updated successfully");
      setFormData({ title: "", content: "" });
      setSelectedBlog(null);
      handleTabChange("view");
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to update blog");
      console.error("Error updating blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDraft = () => {
    localStorage.removeItem("blogDraft");
    setFormData({ title: "", content: "" });
    toast.success("Draft deleted successfully");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "edit":
        if (!selectedBlog) return null;
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Edit Blog</h2>
              <button
                onClick={() => handleTabChange("view")}
                className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleUpdateBlog} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Blog"}
                </button>
              </div>
            </form>
          </>
        );
      case "create":
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Create New Blog
              </h2>
              <div className="flex gap-3">
                {formData.title.trim() || formData.content.trim() ? (
                  <button
                    onClick={handleDeleteDraft}
                    className="px-6 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 shadow-sm"
                  >
                    Delete Draft
                  </button>
                ) : null}
                <button
                  onClick={() => handleTabChange("view")}
                  className="px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
            <form onSubmit={handleCreateBlog} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Blog"}
                </button>
              </div>
            </form>
          </>
        );
      case "view":
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">All Blogs</h2>
              <button
                onClick={() => handleTabChange("create")}
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
              >
                Create New Blog
              </button>
            </div>
            <div className="space-y-4">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-100 p-6 rounded-lg hover:border-indigo-100 hover:shadow-md transition duration-200"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Written by{" "}
                      <span className="font-medium">
                        {blog.author || "Unknown Author"}
                      </span>
                      <span className="mx-2">•</span>
                      <time dateTime={blog.created_at}>
                        {new Date(blog.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewBlog(blog._id)}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditBlog(blog)}
                      className="px-4 py-2 text-sm font-medium text-yellow-600 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBlog(blog._id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {blogs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No blogs found. Create your first blog!
                  </p>
                </div>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-30 bg-gray-100 p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="h-screen py-1">
        <div className="flex h-[calc(100%-1rem)]">
          {/* Vertical Navigation Bar */}
          <div className="w-64 bg-white shadow-lg">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-8">
                Blog Management
              </h1>
              <nav className="space-y-2">
                <button
                  onClick={() => handleTabChange("view")}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeTab === "view"
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  View All Blogs
                </button>
                <button
                  onClick={() => handleTabChange("create")}
                  className={`w-full px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeTab === "create"
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Create New Blog
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area - Whiteboard Style */}
          <div className="flex-1 px-8 bg-gray-50">
            <div className="h-full w-full bg-white rounded-xl shadow-md border border-gray-100 overflow-auto">
              <div className="min-h-full p-8">{renderContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
