"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import Link from "next/link";

import {
  getAllPromotionsController,
  createPromotionController,
  updatePromotionController,
  deletePromotionController,
} from "@/app/controller/promotionController";
import { Promotion } from "@/app/types/promotion";
import PromotionForm from "@/components/Promotion/PromotionForm";

const PromotionPage = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount_percentage: 0,
    start_date: "",
    end_date: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await getAllPromotionsController();
      setPromotions(data);
    } catch (error) {
      toast.error("Failed to load promotions");
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);
    try {
      await createPromotionController(formData);
      toast.success("Promotion created successfully!");
      setFormData({
        title: "",
        description: "",
        discount_percentage: 0,
        start_date: "",
        end_date: "",
      });
      setIsModalOpen(false);
      fetchPromotions();
    } catch (error) {
      toast.error("Failed to create promotion");
      console.error("Error creating promotion:", error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleUpdatePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);
    if (!selectedPromotion) return;

    try {
      await updatePromotionController(selectedPromotion._id, formData);
      toast.success("Promotion updated successfully!");
      setFormData({
        title: "",
        description: "",
        discount_percentage: 0,
        start_date: "",
        end_date: "",
      });
      setSelectedPromotion(null);
      setIsModalOpen(false);
      fetchPromotions();
    } catch (error) {
      toast.error("Failed to update promotion");
      console.error("Error updating promotion:", error);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await deletePromotionController(id);
        Swal.fire("Deleted!", "Promotion has been deleted.", "success");
        fetchPromotions();
      } catch (error) {
        toast.error("Failed to delete promotion");
        console.error("Error deleting promotion:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      discount_percentage: promotion.discount_percentage,
      start_date: promotion.start_date,
      end_date: promotion.end_date,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Promotion Management
      </h1>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">All Promotions</h2>
          <button
            onClick={() => {
              setSelectedPromotion(null);
              setFormData({
                title: "",
                description: "",
                discount_percentage: 0,
                start_date: "",
                end_date: "",
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            disabled={loading}
          >
            Create New Promotion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <div
              key={promotion._id}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <Link href={`/admin/promotion/${promotion._id}`}>
                <div className="cursor-pointer">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {promotion.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{promotion.description}</p>
                  <p className="text-gray-700">
                    <span className="font-medium">Discount:</span>{" "}
                    {promotion.discount_percentage}%
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(promotion.start_date).toLocaleDateString()} to{" "}
                    {new Date(promotion.end_date).toLocaleDateString()}
                  </p>
                </div>
              </Link>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditPromotion(promotion)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePromotion(promotion._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PromotionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={
          selectedPromotion ? handleUpdatePromotion : handleCreatePromotion
        }
        isSubmitting={isSubmitting}
        mode={selectedPromotion ? "edit" : "create"}
      />
    </div>
  );
};

export default PromotionPage;
