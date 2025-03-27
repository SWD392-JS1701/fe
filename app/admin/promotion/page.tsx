"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

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
    <div className="p-8 bg-gray-50 min-h-screen mt-30">
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Promotion Management ({promotions.length} promotions)
              </h1>
              <p className="text-sm text-gray-500">
                All promotions ({promotions.length} items)
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3">Start Date</th>
                  <th className="p-3">End Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((promotion) => (
                  <tr key={promotion._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <Link href={`/admin/promotion/${promotion._id}`}>
                        <p className="text-gray-800 font-medium hover:text-blue-600">
                          {promotion.title}
                        </p>
                      </Link>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-800">{promotion.description}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-800">
                        {promotion.discount_percentage}%
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-800">
                        {new Date(promotion.start_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="text-gray-800">
                        {new Date(promotion.end_date).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )}
                      </p>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-center items-center space-x-2">
                        <button
                          onClick={() => handleEditPromotion(promotion)}
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Edit promotion"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePromotion(promotion._id)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete promotion"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
