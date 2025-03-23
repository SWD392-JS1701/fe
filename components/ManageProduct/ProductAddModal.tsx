import React, { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { app } from "@/firebaseconfig";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import {
  Product,
  ProductType,
  CreateProductRequest,
} from "@/app/types/product";
import {
  createProduct,
  getAllProductTypes,
} from "@/app/services/productService";
import { set } from "lodash";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      product_type_id: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    if (!imageFile) {
      Swal.fire({
        icon: "error",
        title: "Image Required",
        text: "Please upload a product image.",
        showConfirmButton: true,
      });
      return;
    }

    let imageUrl = "";
    try {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent className="max-w-4xl max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Name
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              {/* Product Rating */}
              <div>
                <label
                  htmlFor="product_rating"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Rating
                </label>
                <Input
                  type="number"
                  id="product_rating"
                  name="product_rating"
                  value={formData.product_rating}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  max="5"
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stock
                </label>
                <Input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              {/* Volume */}
              <div>
                <label
                  htmlFor="volume"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Volume (ml)
                </label>
                <Input
                  type="number"
                  id="volume"
                  name="volume"
                  value={formData.volume}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                />
              </div>

              {/* Expired Date */}
              <div>
                <label
                  htmlFor="expired_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expiration Date
                </label>
                <Input
                  type="date"
                  id="expired_date"
                  name="expired_date"
                  value={formData.expired_date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Product Type */}
              <div>
                <label
                  htmlFor="product_type_id"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Type
                </label>
                <Select
                  value={formData.product_type_id}
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((type) => (
                      <SelectItem key={type._id} value={type._id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Supplier Name */}
              <div>
                <label
                  htmlFor="supplier_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Supplier Name
                </label>
                <Input
                  type="text"
                  id="supplier_name"
                  name="supplier_name"
                  value={formData.supplier_name}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="h-16"
                />
              </div>

              {/* Image */}
              <div className="md:col-span-2">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Image
                </label>
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                />
                {imageFile && (
                  <p className="mt-2 text-sm text-gray-500">{imageFile.name}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default ProductAddModal;
