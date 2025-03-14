import React, { FC, useState, useEffect } from "react";
import {
  Product,
  ProductType,
  CreateProductRequest,
} from "@/app/types/product";
import {
  createProduct,
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

interface ProductAddModalProps {
  onClose: () => void;
  onCreate: (newProduct: Product) => void;
}

const ProductAddModal: FC<ProductAddModalProps> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: "",
    product_rating: 0,
    description: "",
    price: 0,
    stock: 0,
    product_type_id: "",
    image_url: "",
    supplier_name: "",
    expired_date: "",
    volume: 0,
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.price ||
      !formData.stock ||
      !formData.product_type_id ||
      !formData.expired_date
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all required fields.",
        showConfirmButton: true,
      });
      return;
    }

    // Validate numeric fields
    const productRating = parseFloat(formData.product_rating.toString());
    const price = parseFloat(formData.price.toString());
    const stock = parseInt(formData.stock.toString(), 10);
    const volume = parseFloat(formData.volume.toString());

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

    // Require image file for new product
    if (!imageFile) {
      Swal.fire({
        icon: "error",
        title: "Image Required",
        text: "Please upload a product image.",
        showConfirmButton: true,
      });
      return;
    }

    // Upload image to Firebase
    let imageUrl = "";
    try {
      // Using a temporary unique ID since product ID isn't available yet
      const tempId = Date.now().toString();
      const storageRef = ref(storage, `images/${tempId}`);
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

    const requestBody: CreateProductRequest = {
      name: formData.name,
      price,
      product_rating: productRating,
      stock,
      volume,
      expired_date: expiredDate.toISOString(),
      image_url: imageUrl,
      product_type_id: formData.product_type_id,
      description: formData.description || "",
      supplier_name: formData.supplier_name || "",
    };

    try {
      const newProduct = await createProduct(requestBody);
      if (newProduct) {
        onCreate(newProduct);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product created successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        onClose();
      }
    } catch (error) {
      // Clean up uploaded image if product creation fails
      if (imageUrl) {
        const storagePath = decodeURIComponent(
          imageUrl.split("/o/")[1].split("?")[0]
        );
        const imageRef = ref(storage, storagePath);
        await deleteObject(imageRef).catch((err) =>
          console.error("Failed to clean up image:", err)
        );
      }
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to create product.",
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

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Add New Product
        </h2>

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
                value={formData.product_rating}
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
                value={formData.volume}
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

            {/* Supplier Name */}
            <div>
              <label
                htmlFor="supplier_name"
                className="block text-sm font-medium text-gray-700"
              >
                Supplier Name
              </label>
              <input
                type="text"
                id="supplier_name"
                name="supplier_name"
                value={formData.supplier_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
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
                value={formData.description}
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
                required
              />
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
              Create Product
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProductAddModal;
