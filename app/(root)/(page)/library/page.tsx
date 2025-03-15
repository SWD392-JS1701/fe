"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/app/types/product";
import { getAllProducts } from "@/app/services/productService";
import Loading from "@/components/Loading";
import Link from "next/link";

const Library = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || product.product_type_id === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Product Library</h1>
          <div className="flex space-x-4">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <Button
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
          >
            All Products
          </Button>
          <Button
            variant={selectedType === "cleanser" ? "default" : "outline"}
            onClick={() => setSelectedType("cleanser")}
          >
            Cleansers
          </Button>
          <Button
            variant={selectedType === "moisturizer" ? "default" : "outline"}
            onClick={() => setSelectedType("moisturizer")}
          >
            Moisturizers
          </Button>
          <Button
            variant={selectedType === "serum" ? "default" : "outline"}
            onClick={() => setSelectedType("serum")}
          >
            Serums
          </Button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="flex flex-col">
              <CardHeader>
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardTitle className="text-lg mb-2 hover:underline cursor-pointer">
                  {product.name}
                </CardTitle>
                <p className="text-gray-600 text-sm line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <Badge variant="secondary">{product.supplier_name}</Badge>
                  <span className="text-lg font-bold">${product.price}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Link href={`/products/${product._id}`}>
                  <Button className="w-full">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
