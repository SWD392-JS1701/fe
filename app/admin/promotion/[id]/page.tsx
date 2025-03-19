"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { getPromotionByIdController } from "@/app/controller/promotionController";
import { Promotion } from "@/app/types/promotion";

const PromotionDetailPage = () => {
  const params = useParams();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const data = await getPromotionByIdController(params.id as string);
        setPromotion(data);
      } catch (error) {
        toast.error("Failed to load promotion details");
        console.error("Error fetching promotion:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPromotion();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!promotion) {
    return (
      <div className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Promotion not found
          </h2>
          <Link
            href="/admin/promotion"
            className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
          >
            Back to Promotions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="mb-6">
        <Link
          href="/admin/promotion"
          className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
        >
          ← Back to Promotions
        </Link>
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          {promotion.title}
        </h1>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {promotion.description}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Discount
            </h2>
            <p className="text-gray-600">
              {promotion.discount_percentage}% off
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Duration
            </h2>
            <p className="text-gray-600">
              From{" "}
              <span className="font-medium">
                {new Date(promotion.start_date).toLocaleDateString()}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {new Date(promotion.end_date).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;
