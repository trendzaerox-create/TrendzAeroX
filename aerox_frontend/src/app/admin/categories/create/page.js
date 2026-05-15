"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CategoryForm from "@/components/admin/CategoryForm";
import {
  createCategory,
  clearCategoryState,
} from "@/features/categories/categorySlice";

export default function AdminCreateCategoryPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { submitting, error, successMessage } = useSelector(
    (state) => state.categories
  );

  useEffect(() => {
    return () => dispatch(clearCategoryState());
  }, [dispatch]);

  const handleSubmit = async (payload) => {
    const resultAction = await dispatch(createCategory(payload));
    if (createCategory.fulfilled.match(resultAction)) {
      router.push("/admin/categories/list");
    }
  };

  return (
    <div className="max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Category</h1>
        <p className="text-sm text-gray-500">Add a new product category</p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
          {successMessage}
        </div>
      )}

      <CategoryForm onSubmit={handleSubmit} loading={submitting} />
    </div>
  );
}