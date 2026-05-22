

"use client";

import { useState, useEffect } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function CategoryForm({
  initialValues = {
    name: "",
    imageUrls: [],
    bannerImageUrls: [],
    thinBannerImageUrls: [],
  },
  onSubmit,
  loading = false,
}) {
  const [name, setName] = useState(initialValues.name || "");
  const [imageUrls, setImageUrls] = useState(initialValues.imageUrls || []);
  const [bannerImageUrls, setBannerImageUrls] = useState(
    initialValues.bannerImageUrls || []
  );
  const [thinBannerImageUrls, setThinBannerImageUrls] = useState(
    initialValues.thinBannerImageUrls || []
  );

  const [uploadingField, setUploadingField] = useState("");
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setName(initialValues?.name || "");
    setImageUrls(initialValues?.imageUrls || []);
    setBannerImageUrls(initialValues?.bannerImageUrls || []);
    setThinBannerImageUrls(initialValues?.thinBannerImageUrls || []);
  }, [initialValues]);

  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const token =
      localStorage.getItem("accessToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("adminToken");

    const response = await fetch(
      `${API_BASE_URL}/api/admin/categories/upload-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const data = await response.json();
    return data.imageUrl;
  };

  const handleImageUpload = async (e, fieldName) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploadingField(fieldName);
      setUploadError("");

      const uploadedUrls = [];

      for (const file of files) {
        const imageUrl = await uploadSingleFile(file);
        uploadedUrls.push(imageUrl);
      }

      if (fieldName === "imageUrls") {
        setImageUrls((prev) => [...prev, ...uploadedUrls]);
      }

      if (fieldName === "bannerImageUrls") {
        setBannerImageUrls((prev) => [...prev, ...uploadedUrls]);
      }

      if (fieldName === "thinBannerImageUrls") {
        setThinBannerImageUrls((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (error) {
      setUploadError(error.message || "Image upload failed");
    } finally {
      setUploadingField("");
      e.target.value = "";
    }
  };

  const removeImage = (fieldName, index) => {
    if (fieldName === "imageUrls") {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    }

    if (fieldName === "bannerImageUrls") {
      setBannerImageUrls((prev) => prev.filter((_, i) => i !== index));
    }

    if (fieldName === "thinBannerImageUrls") {
      setThinBannerImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSubmit({
      name: trimmedName,
      imageUrls,
      bannerImageUrls,
      thinBannerImageUrls,

      imageUrl: imageUrls[0] || null,
      bannerImageUrl: bannerImageUrls[0] || null,
      thinBannerImageUrl: thinBannerImageUrls[0] || null,
    });
  };

  const uploading = Boolean(uploadingField);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Category Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          autoComplete="off"
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none focus:border-black"
          required
        />
      </div>

      <ImageUploadField
        label="Category Card Images"
        helper="You can upload multiple category card images."
        imageUrls={imageUrls}
        previewType="square"
        uploading={uploadingField === "imageUrls"}
        disabled={uploading || loading}
        onUpload={(e) => handleImageUpload(e, "imageUrls")}
        onRemove={(index) => removeImage("imageUrls", index)}
      />

      <ImageUploadField
        label="Normal Banner Images"
        helper="Recommended: 1920 × 600 px. You can upload multiple banner images."
        imageUrls={bannerImageUrls}
        previewType="banner"
        uploading={uploadingField === "bannerImageUrls"}
        disabled={uploading || loading}
        onUpload={(e) => handleImageUpload(e, "bannerImageUrls")}
        onRemove={(index) => removeImage("bannerImageUrls", index)}
      />

      <ImageUploadField
        label="Thin Banner Images"
        helper="Recommended: 1920 × 220 px. You can upload multiple thin banner images."
        imageUrls={thinBannerImageUrls}
        previewType="thinBanner"
        uploading={uploadingField === "thinBannerImageUrls"}
        disabled={uploading || loading}
        onUpload={(e) => handleImageUpload(e, "thinBannerImageUrls")}
        onRemove={(index) => removeImage("thinBannerImageUrls", index)}
      />

      {uploadError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {uploadError}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || uploading || !name.trim()}
        className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : uploading ? "Uploading..." : "Save Category"}
      </button>
    </form>
  );
}

function ImageUploadField({
  label,
  helper,
  imageUrls = [],
  previewType = "square",
  uploading,
  disabled,
  onUpload,
  onRemove,
}) {
  const isBanner = previewType === "banner";
  const isThinBanner = previewType === "thinBanner";

  const gridClassName =
    isBanner || isThinBanner
      ? "grid grid-cols-1 gap-4"
      : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

  const previewClassName =
    previewType === "banner"
      ? "h-36 w-full"
      : previewType === "thinBanner"
      ? "h-20 w-full"
      : "h-32 w-32";

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <p className="mb-3 text-xs text-gray-500">{helper}</p>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        disabled={disabled}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-60"
      />

      {uploading && (
        <p className="mt-2 text-sm text-gray-500">Uploading images...</p>
      )}

      {imageUrls.length > 0 && (
        <div className="mt-4">
          <p className="mb-3 text-sm font-medium text-gray-600">
            Image Preview
          </p>

          <div className={gridClassName}>
            {imageUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2 ${
                  isBanner || isThinBanner ? "w-full" : "w-fit"
                }`}
              >
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black text-lg font-bold leading-none text-white shadow-md transition hover:bg-red-600"
                  aria-label="Remove image"
                >
                  ×
                </button>

                <img
                  src={url}
                  alt={`${label} preview ${index + 1}`}
                  className={`${previewClassName} rounded-lg border border-gray-100 bg-white object-cover`}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}