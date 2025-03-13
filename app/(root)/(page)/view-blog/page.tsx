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

  const truncateContent = (content: string, maxLength: number) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
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
    <div className="relative bg-gray-50 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Daily Posts
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Explore the latest insights and updates from our doctors.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
          {blogs.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No blogs available.
            </div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="flex flex-col overflow-hidden rounded-lg shadow-lg"
              >
                {/* Placeholder Image (since API data doesn't include images) */}
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
                    alt={blog.title}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                      <Link href={`/view-blog/${blog._id}`}>Article</Link>
                    </p>
                    <Link
                      href={`/view-blog/${blog._id}`}
                      className="mt-2 block"
                    >
                      <p className="text-xl font-semibold text-gray-900">
                        {blog.title}
                      </p>
                      <p className="mt-3 text-base text-gray-500">
                        {truncateContent(blog.content, 100)}
                      </p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <Link href={`/doctors/${blog.doctor_id._id}`}>
                        <span className="sr-only">
                          {blog.author ||
                            `${blog.doctor_id.first_name} ${blog.doctor_id.last_name}`}
                        </span>
                      </Link>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        <Link
                          href={`/doctors/${blog.doctor_id._id}`}
                          className="hover:underline"
                        >
                          {blog.author ||
                            `${blog.doctor_id.first_name} ${blog.doctor_id.last_name}`}
                        </Link>
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={blog.created_at}>
                          {new Date(blog.created_at).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
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
