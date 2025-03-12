import React, { FC, useState, useEffect } from "react";
import {
  Product,
  ProductType,
  ProductUpdateRequest,
} from "@/app/types/product";
import {
  updateProduct,
  getAllProductTypes,
} from "@/app/services/productService";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

const EditProductModal: FC<EditProductModalProps> = ({
  product,
  onClose,
  onUpdate,
}) => {
  const [formData, setFormData] = useState<Product>({
    ...product,
    expired_date: new Date(product.expired_date).toISOString().split("T")[0],
  });
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  // Fetch product types on mount
  useEffect(() => {
    const fetchProductTypes = async () => {
      const types = await getAllProductTypes();
      setProductTypes(types);
    };
    fetchProductTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate numeric fields
    const productRating = parseFloat(formData.product_rating.toString());
    const price = parseFloat(formData.price.toString());
    const stock = parseInt(formData.stock.toString(), 10);
    const volume = parseFloat(formData.volume.toString() || "0");

    if (isNaN(productRating) || isNaN(price) || isNaN(stock) || isNaN(volume)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please ensure all numeric fields (rating, price, stock, volume) are valid numbers.",
        showConfirmButton: true,
      });
      return;
    }

    // Validate expired_date
    const expiredDate = new Date(formData.expired_date);
    if (isNaN(expiredDate.getTime())) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "Please enter a valid expiration date.",
        showConfirmButton: true,
      });
      return;
    }

    // Transform formData to match API expected format
    const requestBody: ProductUpdateRequest = {
      name: formData.name,
      product_rating: productRating,
      description: formData.description,
      price: price,
      stock: stock,
      product_type_id: formData.product_type_id,
      image_url: formData.image_url,
      supplier_name: formData.supplier_name || formData.Supplier || "",
      expired_date: expiredDate.toISOString(),
      volume: volume,
    };

    try {
      const updatedProduct = await updateProduct(product._id, requestBody);
      if (updatedProduct) {
        onUpdate(updatedProduct);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product updated successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
        onClose();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update the product. Please try again.",
        showConfirmButton: true,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 backdrop-blur-md bg-white/30 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>

            <div>
              <label
                htmlFor="supplier_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Supplier
              </label>
              <input
                type="text"
                id="supplier_name"
                name="supplier_name"
                value={formData.supplier_name || formData.Supplier || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="volume"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Volume
              </label>
              <input
                type="number"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="0.1"
                min="0"
                required
              />
            </div>

            <div>
              <label
                htmlFor="product_type_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Type
              </label>
              <select
                id="product_type_id"
                name="product_type_id"
                value={formData.product_type_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>
                  Select a product type
                </option>
                {productTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="expired_date"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expired Date
              </label>
              <input
                type="date"
                id="expired_date"
                name="expired_date"
                value={formData.expired_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="image_url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image URL
              </label>
              <input
                type="text"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProductModal;
