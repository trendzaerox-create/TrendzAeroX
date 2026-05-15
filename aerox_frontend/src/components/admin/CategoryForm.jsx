"use client";

import { useState, useEffect } from "react";

export default function CategoryForm({
  initialValues = { name: "" },
  onSubmit,
  loading = false,
}) {
  const [name, setName] = useState(initialValues.name || "");

  useEffect(() => {
    setName(initialValues?.name || "");
  }, [initialValues?.name]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSubmit({ name: trimmedName });
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

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="rounded-xl bg-black px-5 py-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Category"}
      </button>
    </form>
  );
}