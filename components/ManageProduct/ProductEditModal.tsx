import React, { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Product,
  ProductType,
  ProductUpdateRequest,
} from "@/app/types/product";
import {
  updateProduct,
  getAllProductTypes,
} from "@/app/services/productService";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { app } from "@/firebaseconfig";

const storage = getStorage(app);

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
    expired_date: new Date(product.expired_date).toISOString().split("T")[0], // Format date for input
  });
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        const types = await getAllProductTypes();
        setProductTypes(types);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to fetch product types.",
          showConfirmButton: true,
        });
      }
    };
    fetchProductTypes();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "product_rating" || name === "price" || name === "volume"
          ? parseFloat(value) || 0
          : name === "stock"
          ? parseInt(value, 10) || 0
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate numeric fields
    const productRating = parseFloat(
      formData.product_rating?.toString() || "0"
    );
    const price = parseFloat(formData.price.toString());
    const stock = parseInt(formData.stock.toString(), 10);
    const volume = parseFloat(formData.volume?.toString() || "0");

    if (isNaN(productRating) || isNaN(price) || isNaN(stock) || isNaN(volume)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Ensure numeric fields are valid.",
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
        text: "Enter a valid expiration date.",
        showConfirmButton: true,
      });
      return;
    }

    let imageUrl = formData.image_url;

    // Upload new image if selected
    if (imageFile) {
      const storageRef = ref(storage, `images/${product._id}`);
      try {
        if (
          formData.image_url &&
          formData.image_url.startsWith(
            "https://firebasestorage.googleapis.com"
          )
        ) {
          const storagePath = decodeURIComponent(
            formData.image_url.split("/o/")[1].split("?")[0]
          );
          const oldImageRef = ref(storage, storagePath);
          try {
            await getDownloadURL(oldImageRef); // Check if image exists
            await deleteObject(oldImageRef);
          } catch (error: any) {
            if (error.code !== "storage/object-not-found") {
              throw error;
            }
          }
        }

        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Failed to upload image: " + (error as Error).message,
          showConfirmButton: true,
        });
        return;
      }
    }

    const requestBody: ProductUpdateRequest = {
      name: formData.name,
      price,
      product_rating: productRating,
      stock,
      volume,
      expired_date: expiredDate.toISOString(),
      image_url: imageUrl,
      product_type_id: formData.product_type_id,
      description: formData.description,
    };

    try {
      const updatedProduct = await updateProduct(product._id, requestBody);
      if (updatedProduct) {
        onUpdate(updatedProduct);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        onClose();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update product.",
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Product Rating */}
            <div>
              <label
                htmlFor="product_rating"
                className="block text-sm font-medium text-gray-700"
              >
                Product Rating
              </label>
              <input
                type="number"
                id="product_rating"
                name="product_rating"
                value={formData.product_rating || ""}
                onChange={handleChange}
                step="0.1"
                min="0"
                max="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Volume */}
            <div>
              <label
                htmlFor="volume"
                className="block text-sm font-medium text-gray-700"
              >
                Volume (ml)
              </label>
              <input
                type="number"
                id="volume"
                name="volume"
                value={formData.volume || ""}
                onChange={handleChange}
                step="0.1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Expired Date */}
            <div>
              <label
                htmlFor="expired_date"
                className="block text-sm font-medium text-gray-700"
              >
                Expiration Date
              </label>
              <input
                type="date"
                id="expired_date"
                name="expired_date"
                value={formData.expired_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            {/* Product Type */}
            <div>
              <label
                htmlFor="product_type_id"
                className="block text-sm font-medium text-gray-700"
              >
                Product Type
              </label>
              <select
                id="product_type_id"
                name="product_type_id"
                value={formData.product_type_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select a type</option>
                {productTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none"
              />
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Product Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
              {formData.image_url && !imageFile && (
                <img
                  src={formData.image_url}
                  alt={formData.name}
                  className="mt-2 h-32 object-cover rounded-md"
                />
              )}
              {imageFile && (
                <p className="mt-2 text-sm text-gray-500">{imageFile.name}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
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
