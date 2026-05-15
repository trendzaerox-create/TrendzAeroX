



"use client";

import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import {
  uploadProductImages,
  setImages,
  clearImages,
} from "@/features/products/uploadSlice";
import { createProduct } from "@/features/products/adminProductSlice";
import { fetchAdminCategories } from "@/features/categories/categorySlice";
import getImageUrl from "@/lib/getImageUrl";

export default function CreateProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const categories = useSelector(
    (state) => state.categories.adminCategories || []
  );
  const uploadedImages = useSelector((state) => state.upload.images || []);
  const uploadLoading = useSelector((state) => state.upload.loading);

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [files, setFiles] = useState([]);

  useEffect(() => {
    dispatch(fetchAdminCategories());
    dispatch(clearImages());

    return () => {
      dispatch(clearImages());
    };
  }, [dispatch]);

  const removeImage = (index) => {
    const arr = [...uploadedImages];
    arr.splice(index, 1);
    dispatch(setImages(arr));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select image files first");
      return;
    }

    try {
      await dispatch(uploadProductImages(files)).unwrap();
      setFiles([]);
      alert("Images uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const discountPercent = useMemo(() => {
    const sellingPrice = Number(price);
    const originalPrice = Number(mrp);

    if (
      !Number.isFinite(sellingPrice) ||
      !Number.isFinite(originalPrice) ||
      sellingPrice <= 0 ||
      originalPrice <= 0 ||
      sellingPrice >= originalPrice
    ) {
      return 0;
    }

    return Math.round(((originalPrice - sellingPrice) * 100) / originalPrice);
  }, [price, mrp]);

  const handleCreate = async () => {
    if (loading) return;

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Please enter a valid selling price");
      return;
    }

    if (mrp && Number(mrp) <= 0) {
      alert("Please enter a valid MRP");
      return;
    }

    if (mrp && Number(mrp) < Number(price)) {
      alert("MRP must be greater than or equal to selling price");
      return;
    }

    if (!stock && stock !== 0) {
      alert("Stock is required");
      return;
    }

    if (Number(stock) < 0) {
      alert("Stock cannot be negative");
      return;
    }

    if (!categoryId) {
      alert("Please select category");
      return;
    }

    setLoading(true);

    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        priceInr: Number(price),
        mrpInr: mrp ? Number(mrp) : null,
        stock: Number(stock),
        categoryId: Number(categoryId),
        images: uploadedImages,
      };

      await dispatch(createProduct(data)).unwrap();

      dispatch(clearImages());
      alert("Product Created");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert(
        typeof err === "string"
          ? err
          : err?.message || "Create failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    color: "#111827",
    background: "#ffffff",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8f8f8",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#111827",
            margin: "0 0 24px 0",
          }}
        >
          Create Product
        </h1>

        <div style={{ display: "grid", gap: "18px" }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              placeholder="Enter product title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Enter product description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              style={{
                ...inputStyle,
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            <div>
              <label style={labelStyle}>Selling Price (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="Enter selling price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>MRP / Original Price (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="Enter MRP"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Stock</label>
              <input
                type="number"
                min="0"
                placeholder="Enter stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              background: "#f9fafb",
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "#6b7280",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Price Preview
            </div>

            {price ? (
              <div>
                {discountPercent > 0 ? (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          color: "#cc0c39",
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        -{discountPercent}%
                      </span>

                      <span
                        style={{
                          color: "#111827",
                          fontSize: "28px",
                          fontWeight: "800",
                        }}
                      >
                        ₹{Number(price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      M.R.P.:{" "}
                      <span style={{ textDecoration: "line-through" }}>
                        ₹{Number(mrp).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </>
                ) : (
                  <div
                    style={{
                      color: "#111827",
                      fontSize: "28px",
                      fontWeight: "800",
                    }}
                  >
                    ₹{Number(price).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Enter selling price and MRP to preview discount.
              </div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              style={inputStyle}
            >
              <option value="">Select Category</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Product Images</label>
            <input
              type="file"
              multiple
              accept="image/*,video/mp4,video/webm"
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "10px",
                fontSize: "14px",
                color: "#111827",
                background: "#ffffff",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              onClick={handleUpload}
              disabled={uploadLoading}
              style={{
                padding: "12px 18px",
                background: uploadLoading ? "#9ca3af" : "#111827",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: uploadLoading ? "not-allowed" : "pointer",
              }}
            >
              {uploadLoading ? "Uploading..." : "Upload Images"}
            </button>

            <button
              onClick={handleCreate}
              disabled={loading}
              style={{
                padding: "12px 18px",
                background: loading ? "#9ca3af" : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: "28px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#111827",
              marginBottom: "14px",
            }}
          >
            Uploaded Images
          </h3>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {uploadedImages.map((img, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  border: "1px solid #e5e7eb",
                  padding: "8px",
                  borderRadius: "12px",
                  background: "#ffffff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
                }}
              >
                <img
                  src={getImageUrl(img)}
                  width="120"
                  alt={`Product image ${i + 1}`}
                  style={{
                    display: "block",
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />

                <button
                  onClick={() => removeImage(i)}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#dc2626",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "999px",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "700",
                    lineHeight: "24px",
                    textAlign: "center",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}