"use client";

import React from "react";

const InstructionNotification: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">
          Appointment Instructions
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">✔</span>
            <p>
              Please arrive 10 minutes before your scheduled consultation time
              for check-in.
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">✔</span>
            <p>
              Come with clean, makeup-free skin to allow for proper skin
              analysis.
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">✔</span>
            <p>
              Bring a list of current skincare products you're using and any
              known skin allergies.
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">✔</span>
            <p>
              Our skincare specialist will assess your skin condition, discuss
              your concerns, and recommend suitable products for your skin type.
            </p>
          </div>
          <div className="flex items-start">
            <span className="text-green-500 mr-2 mt-1">✔</span>
            <p>
              The consultation will include a personalized skincare routine and
              product recommendations.
            </p>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionNotification;
