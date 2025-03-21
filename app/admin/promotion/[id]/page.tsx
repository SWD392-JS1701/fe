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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

import { Product } from "@/app/types/product";
import { Promotion, PromotedProduct } from "@/app/types/promotion";
import {
  getPromotionByIdController,
  createPromotedProductController,
  updatePromotedProductController,
  deletePromotedProductController,
  getAllPromotedProductByPromotionIdController,
} from "@/app/controller/promotionController";
import {
  fetchAllProducts,
  fetchProductById,
} from "@/app/controller/productController";

const PromotionDetailPage = () => {
  const params = useParams();
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [promotedProducts, setPromotedProducts] = useState<
    Array<{ product: Product; promotedProduct: PromotedProduct }>
  >([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const fetchPromotedProducts = async () => {
    try {
      const promotedProductsData =
        await getAllPromotedProductByPromotionIdController(params.id as string);
      const productsWithDetails = await Promise.all(
        promotedProductsData.map(async (promotedProduct) => {
          const product = await fetchProductById(promotedProduct.product_id);
          return {
            product: product!,
            promotedProduct,
          };
        })
      );
      setPromotedProducts(productsWithDetails);
    } catch (error) {
      console.error("Error fetching promoted products:", error);
      toast.error("Failed to load promoted products");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promotionData, allProducts] = await Promise.all([
          getPromotionByIdController(params.id as string),
          fetchAllProducts(),
        ]);
        setPromotion(promotionData);
        setProducts(allProducts);
        await fetchPromotedProducts();
      } catch (error) {
        toast.error("Failed to load data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleAddProductToPromotion = async () => {
    if (!selectedProductId) {
      toast.error("Please select a product to add to the promotion");
      return;
    }

    try {
      await createPromotedProductController({
        promotion_id: params.id as string,
        product_id: selectedProductId,
      });
      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product added to promotion successfully!",
        confirmButtonText: "OK",
        confirmButtonColor: "#3085d6",
      });
      setSelectedProductId(null);
      await fetchPromotedProducts();
    } catch (error) {
      toast.error("Failed to add product to promotion");
      console.error("Error adding product to promotion:", error);
    }
  };

  const handleDeletePromotedProduct = async (promotedProductId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this product from the promotion?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        await deletePromotedProductController(promotedProductId);
        await Swal.fire(
          "Removed!",
          "Product has been removed from the promotion.",
          "success"
        );
        await fetchPromotedProducts();
      } catch (error) {
        toast.error("Failed to remove product from promotion");
        console.error("Error:", error);
      }
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Promotion Details</h2>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Title</TableCell>
                <TableCell>{promotion?.title}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Description</TableCell>
                <TableCell>{promotion?.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Discount</TableCell>
                <TableCell>{promotion?.discount_percentage}% off</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Duration</TableCell>
                <TableCell>
                  {new Date(promotion?.start_date!).toLocaleDateString()} to{" "}
                  {new Date(promotion?.end_date!).toLocaleDateString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Associated Products</h2>
          <div className="mb-4 flex items-center space-x-4">
            <Select
              value={selectedProductId || ""}
              onValueChange={(value) => setSelectedProductId(value)}
            >
              <SelectTrigger className="w-[300px]">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotedProducts.map(({ product, promotedProduct }) => (
                <TableRow key={promotedProduct._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/product/${product._id}`}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </Link>
                      <button
                        onClick={() =>
                          handleDeletePromotedProduct(promotedProduct._id)
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PromotionDetailPage;
