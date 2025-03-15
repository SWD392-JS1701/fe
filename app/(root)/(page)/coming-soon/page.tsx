import React from "react";

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 animate-pulse">We are</h1>
        <h1 className="text-6xl font-bold mb-4 animate-pulse">
          Cooking Our Website
        </h1>
        <p className="text-xl mb-8">
          We are going to launch our website Very Soon. Stay Tuned.
        </p>
        <div className="text-black-400 flex justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
          />
          <button className="bg-white text-blue-500 px-6 py-2 rounded-r-lg hover:bg-gray-100 transition-colors">
            Notify Me
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;
