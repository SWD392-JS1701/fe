"use client";

import React, { useState, useEffect, FC } from "react";
import Link from "next/link";
import { getBlogs } from "@/app/services/blogService";
import { Blog } from "@/app/types/blog";

const ViewBlog: FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await getBlogs();
        setBlogs(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch blogs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const truncateContent = (content: string) => {
    return content.split(".")[0] + "."; // Chỉ lấy câu đầu tiên
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading blogs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28 mt-10">
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold italic text-black uppercase text-center ">
            Daily Posts
          </h2>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-8 lg:max-w-none lg:grid-cols-3">
          {blogs.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No blogs available.
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="relative overflow-hidden rounded-xl shadow-lg group w-full h-[450px]"
              >
                {/* Hình ảnh */}
                <div className="relative h-72 w-full transition-transform duration-400 ease-in-out group-hover:-translate-y-10">
                  <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                    alt={blog.title}
                  />
                </div>

                {/* Nội dung */}
                <div className="absolute bottom-0 left-0 w-full bg-white p-6 transition-transform duration-400 ease-in-out group-hover:-translate-y-10">
                  <Link href={`/view-blog/${blog._id}`} className="block">
                    <p className="text-2xl font-extrabold text-black uppercase tracking-wide text-center">
                      {blog.title}
                    </p>

                    <p className="text-sm text-gray-500 opacity-0 transition-opacity duration-400 ease-in-out group-hover:opacity-100 line-clamp-1 text-center">
                      {truncateContent(blog.content)}
                    </p>
                  </Link>
                  <Link
                    href={`/view-blog/${blog._id}`}
                    className="block text-center text-sm font-bold text-black uppercase tracking-wide opacity-0 transition-opacity duration-400 ease-in-out group-hover:opacity-100 mt-2"
                  >
                    Read Now →
                  </Link>
                </div>

                {/* Thông tin tác giả & ngày đăng */}
                <div className="absolute bottom-6 right-6 text-sm text-gray-600 opacity-0 transition-opacity duration-400 ease-in-out group-hover:opacity-100">
                  <span>
                    {blog.author ||
                      `${blog.user_id.first_name} ${blog.user_id.last_name}`}
                  </span>{" "}
                  •{" "}
                  <time dateTime={blog.created_at}>
                    {new Date(blog.created_at).toLocaleDateString()}
                  </time>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;
