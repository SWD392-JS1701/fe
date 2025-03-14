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
    expired_date: new Date(product.expired_date).toISOString().split("T")[0],
  });
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
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
        // Only try to delete the existing image if the URL is valid and exists
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

          // Check if the image exists
          try {
            await getDownloadURL(oldImageRef); // If this works, the image exists
            await deleteObject(oldImageRef); // Only delete if it exists
          } catch (error: any) {
            if (error.code !== "storage/object-not-found") {
              throw error; // Rethrow if it's a different error
            }
          }
        }

        // Upload new image
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Failed to upload image: " + error.message,
          showConfirmButton: true,
        });
        return;
      }
    }

    // Prepare request body
    const requestBody: ProductUpdateRequest = {
      ...formData,
      product_rating: productRating,
      price,
      stock,
      volume,
      expired_date: expiredDate.toISOString(),
      image_url: imageUrl,
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
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
                  alt="Product"
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
