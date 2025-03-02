import React from "react";

const Blog = () => {
  return (
    <>
      <div className="w-full dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 pt-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Skincare Insights
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Discover the latest trends, tips, and product reviews in skincare.
            </p>
          </div>
          <div className="mx-auto mt-8 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {/* Blog Post 1 */}
            <article className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 dark:bg-gray-700 px-8 py-8 pb-8 pt-80 sm:pt-48 lg:pt-80">
              <img
                src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3R8ZW58MHwwfHx8MTcxMjc1MzIxN3ww&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Skincare Products"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time className="mr-8">Apr 15, 2024</time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg
                    viewBox="0 0 2 2"
                    className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                  >
                    <circle cx="1" cy="1" r="1"></circle>
                  </svg>
                  <div className="flex gap-x-2.5">
                    <img
                      src="https://randomuser.me/api/portraits/women/1.jpg"
                      alt="Author"
                      className="h-6 w-6 flex-none rounded-full bg-white/10"
                    />
                    Emily
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <a href="/skincare-blog/post1">
                  <span className="absolute inset-0"></span>
                  Top 5 Skincare Products for Glowing Skin in 2024
                </a>
              </h3>
            </article>

            {/* Blog Post 2 */}
            <article className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 dark:bg-gray-700 px-8 py-8 pb-8 pt-80 sm:pt-48 lg:pt-80">
              <img
                src="https://images.unsplash.com/photo-1598528738936-c50861cc75a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHJvdXRpbmV8ZW58MHwwfHx8MTcxMjc1MzIxN3ww&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Skincare Routine"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time className="mr-8">Mar 28, 2024</time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg
                    viewBox="0 0 2 2"
                    className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                  >
                    <circle cx="1" cy="1" r="1"></circle>
                  </svg>
                  <div className="flex gap-x-2.5">
                    <img
                      src="https://randomuser.me/api/portraits/men/3.jpg"
                      alt="Author"
                      className="h-6 w-6 flex-none rounded-full bg-white/10"
                    />
                    David
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <a href="/skincare-blog/post2">
                  <span className="absolute inset-0"></span>
                  How to Build the Perfect Skincare Routine for Your Skin Type
                </a>
              </h3>
            </article>

            {/* Blog Post 3 */}
            <article className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 dark:bg-gray-700 px-8 py-8 pb-8 pt-80 sm:pt-48 lg:pt-80">
              <img
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc2tpbmNhcmV8ZW58MHwwfHx8MTcxMjc1MzIxN3ww&ixlib=rb-4.0.3&q=80&w=1080"
                alt="Natural Skincare"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
              <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time className="mr-8">Mar 10, 2024</time>
                <div className="-ml-4 flex items-center gap-x-4">
                  <svg
                    viewBox="0 0 2 2"
                    className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                  >
                    <circle cx="1" cy="1" r="1"></circle>
                  </svg>
                  <div className="flex gap-x-2.5">
                    <img
                      src="https://randomuser.me/api/portraits/women/4.jpg"
                      alt="Author"
                      className="h-6 w-6 flex-none rounded-full bg-white/10"
                    />
                    Sarah
                  </div>
                </div>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <a href="/skincare-blog/post3">
                  <span className="absolute inset-0"></span>
                  The Benefits of Natural Ingredients in Skincare Products
                </a>
              </h3>
            </article>
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
