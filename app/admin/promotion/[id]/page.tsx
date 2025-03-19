"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

import { Product } from "@/app/types/product";
import { Promotion, PromotedProduct } from "@/app/types/promotion";
import {
  getPromotionByIdController,
  createPromotedProductController,
} from "@/app/controller/promotionController";
import { fetchAllProducts } from "@/app/controller/productController";

const PromotionDetailPage = () => {
  const params = useParams();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchPromotionAndProducts = async () => {
      try {
        const promotionData = await getPromotionByIdController(
          params.id as string
        );
        setPromotion(promotionData);
        const allProducts = await fetchAllProducts();
        setProducts(allProducts);
      } catch (error) {
        toast.error("Failed to load promotion details or products");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPromotionAndProducts();
    }
  }, [params.id]);

  const handleAddProductToPromotion = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product to add to the promotion");
      return;
    }

    try {
      const promotedProductData: Omit<PromotedProduct, "_id" | "__v"> = {
        promotion_id: params.id as string,
        product_id: selectedProductId,
      };
      await createPromotedProductController(promotedProductData);
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product added to promotion successfully!",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });

      setSelectedProductId(null);
    } catch (error) {
      toast.error("Failed to add product to promotion");
      console.error("Error adding product to promotion:", error);
    }
  };

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

          {/* Add Product to Promotion */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Add Product to Promotion
            </h2>
            <div className="flex items-center space-x-4">
              <Select
                value={selectedProductId || ""}
                onValueChange={(value) => setSelectedProductId(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product._id!}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleAddProductToPromotion}>Add Product</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;
