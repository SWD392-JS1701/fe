import React, { FC } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogById } from "@/app/services/blogService";
import { Blog } from "@/app/types/blog";

interface BlogDetailProps {
  params: { id: string };
}

const BlogDetail: FC<BlogDetailProps> = async ({ params }) => {
  const { id } = params;
  let blog: Blog | null = null;

  try {
    blog = await getBlogById(id);
  } catch (error: any) {
    console.error("Error fetching blog:", error);
    return notFound();
  }

  if (!blog) {
    return notFound();
  }

  const cleanContent = blog.content
    .replace(/[^\w\s\n.,!?]/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  return (
    <div className="relative bg-gray-50 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28 mt-10">
      {/* Background Gradient */}
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3"></div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Blog Content */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <Link href={`/doctors/${blog.doctor_id._id}`}>
                <span className="sr-only">
                  {blog.author ||
                    `${blog.doctor_id.first_name} ${blog.doctor_id.last_name}`}
                </span>
                <img
                  className="h-12 w-12 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </Link>
            </div>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-900">
                <Link
                  href={`/doctors/${blog.doctor_id._id}`}
                  className="hover:underline"
                >
                  {blog.author ||
                    `${blog.doctor_id.first_name} ${blog.doctor_id.last_name}`}
                </Link>
              </p>
              <div className="flex space-x-2 text-sm text-gray-500">
                <time dateTime={blog.created_at}>
                  {new Date(blog.created_at).toLocaleDateString()}
                </time>
                {blog.updated_at !== blog.created_at && (
                  <>
                    <span>·</span>
                    <span>
                      Updated: {new Date(blog.updated_at).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Placeholder Image */}
          <div className="mb-8">
            <img
              className="h-96 w-full object-cover rounded-lg"
              src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80"
              alt={blog.title}
            />
          </div>

          {/* Blog Content */}
          <div className="prose prose-lg text-gray-700 max-w-none">
            {cleanContent.length > 0 ? (
              cleanContent.map((paragraph, index) => (
                <p key={index} className="mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="mb-6 text-gray-500 italic">
                No content available for this blog.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
