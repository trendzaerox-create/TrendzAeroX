// "use client";

// import { useState, useEffect } from "react";

// export default function CategoryForm({
//   initialValues = { name: "" },
//   onSubmit,
//   loading = false,
// }) {
//   const [name, setName] = useState(initialValues.name || "");

//   useEffect(() => {
//     setName(initialValues?.name || "");
//   }, [initialValues?.name]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const trimmedName = name.trim();
//     if (!trimmedName) return;

//     onSubmit({ name: trimmedName });
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
//     >
//       <div>
//         <label className="mb-2 block text-sm font-semibold text-gray-700">
//           Category Name
//         </label>

//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Enter category name"
//           autoComplete="off"
//           className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black placeholder:text-gray-400 outline-none focus:border-black"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={loading || !name.trim()}
//         className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//       >
//         {loading ? "Saving..." : "Save Category"}
//       </button>
//     </form>
//   );
// }












"use client";

import { useState, useEffect } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default function CategoryForm({
  initialValues = { name: "", imageUrl: "" },
  onSubmit,
  loading = false,
}) {
  const [name, setName] = useState(initialValues.name || "");
  const [imageUrl, setImageUrl] = useState(initialValues.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    setName(initialValues?.name || "");
    setImageUrl(initialValues?.imageUrl || "");
  }, [initialValues?.name, initialValues?.imageUrl]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError("");

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
      setImageUrl(data.imageUrl);
    } catch (error) {
      setUploadError(error.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSubmit({
      name: trimmedName,
      imageUrl: imageUrl || null,
    });
  };

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

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Category Image
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading || loading}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-black outline-none focus:border-black"
        />

        {uploading && (
          <p className="mt-2 text-sm text-gray-500">Uploading image...</p>
        )}

        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}

        {imageUrl && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-600">
              Image Preview
            </p>
            <img
              src={imageUrl}
              alt="Category preview"
              className="h-32 w-32 rounded-xl border border-gray-200 object-cover"
            />
          </div>
        )}
      </div>

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