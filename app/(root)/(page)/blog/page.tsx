"use client";

import { useState } from "react";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  author: string;
  content: string;
  image: string;
}

const initialBlogs: BlogPost[] = [
  { id: 1, title: "The Secret to Glowing Skin", author: "Alice Johnson", content: "Discover the best skincare routine for a healthy glow...", image: "https://via.placeholder.com/600x300" },
  { id: 2, title: "Why Hydration Matters", author: "John Doe", content: "Keeping your skin hydrated is the key to a youthful appearance...", image: "https://via.placeholder.com/600x300" },
  { id: 3, title: "Best Skincare Products of 2025", author: "Emily Brown", content: "Here are the top-rated skincare products for 2025...", image: "https://via.placeholder.com/600x300" },
  { id: 4, title: "Morning vs. Night Skincare", author: "Sarah Lee", content: "Should you change your skincare routine based on the time of day?", image: "https://via.placeholder.com/600x300" },
  { id: 5, title: "Anti-Aging Secrets", author: "Michael Roberts", content: "Explore the best anti-aging skincare routines backed by science.", image: "https://via.placeholder.com/600x300" },
];

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(initialBlogs[0]);

  const deleteBlog = (id: number) => {
    setBlogs(blogs.filter((blog) => blog.id !== id));
    if (selectedBlog?.id === id) {
      setSelectedBlog(blogs.length > 1 ? blogs[0] : null);
    }
  };

  const editBlog = (id: number) => {
    alert(`Edit blog with ID: ${id}`);
  };

  return (
    <div className="min-h-screen py-30 bg-gray-100 p-8 flex flex-col">
      <div className="container mx-auto flex flex-col h-[85vh]">
        {/* Create New Blog Button */}
        <div className="mb-4">
          <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
            Create New Blog
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-grow space-x-8">
          {/* Left Side - Blog List (Fixed 2/3 width, scrollable) */}
          <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Blogs</h2>
            <div className="overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-gray-300" style={{ maxHeight: "90vh" }}>
              <ul className="space-y-4">
                {blogs.map((blog) => (
                  <li key={blog.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition cursor-pointer">
                    <button onClick={() => setSelectedBlog(blog)} className="text-lg text-blue-600 font-semibold flex-grow text-left">
                      {blog.title}
                    </button>
                    <div className="flex space-x-3">
                      <button onClick={() => editBlog(blog.id)} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition">
                        Edit
                      </button>
                      <button onClick={() => deleteBlog(blog.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Side - Selected Blog (Fixed 1/3 width) */}
          <div className="w-1/3 bg-white p-6 rounded-lg shadow-lg h-full">
            {selectedBlog ? (
              <>
                <h1 className="text-2xl font-bold text-gray-900">{selectedBlog.title}</h1>
                <p className="text-gray-600 text-sm mb-4">Written by <strong>{selectedBlog.author}</strong></p>
                <Image src={selectedBlog.image} alt={selectedBlog.title} width={300} height={200} className="rounded-lg mb-4" />
                <p className="text-gray-700">{selectedBlog.content}</p>
              </>
            ) : (
              <p className="text-gray-500">No blog selected.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
