// "use client";

// import Link from "next/link";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAdminCategories,
//   deleteCategory,
//   clearCategoryState,
// } from "@/features/categories/categorySlice";

// export default function AdminCategoryListPage() {
//   const dispatch = useDispatch();
//   const { adminCategories, loading, submitting, error, successMessage } =
//     useSelector((state) => state.categories);

//   useEffect(() => {
//     dispatch(fetchAdminCategories());
//     return () => dispatch(clearCategoryState());
//   }, [dispatch]);

//   const handleDelete = (id) => {
//     const confirmed = window.confirm("Are you sure you want to delete this category?");
//     if (!confirmed) return;
//     dispatch(deleteCategory(id));
//   };

//   return (
//     <div className="space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Categories</h1>
//           <p className="text-sm text-gray-500">Manage your product categories</p>
//         </div>

//         <Link
//           href="/admin/categories/create"
//           className="rounded-xl bg-black px-5 py-3 text-white hover:opacity-90"
//         >
//           Create Category
//         </Link>
//       </div>

//       {error && (
//         <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
//           {error}
//         </div>
//       )}

//       {successMessage && (
//         <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
//           {successMessage}
//         </div>
//       )}

//       <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//         {loading ? (
//           <div className="p-6 text-sm text-gray-500">Loading categories...</div>
//         ) : adminCategories.length === 0 ? (
//           <div className="p-6 text-sm text-gray-500">No categories found.</div>
//         ) : (
//           <table className="w-full border-collapse">
//             <thead className="bg-gray-50">
//               <tr className="text-left text-sm text-gray-600">
//                 <th className="px-5 py-4">ID</th>
//                 <th className="px-5 py-4">Name</th>
//                 <th className="px-5 py-4">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {adminCategories.map((category) => (
//                 <tr key={category.id} className="border-t border-gray-100">
//                   <td className="px-5 py-4 text-sm">{category.id}</td>
//                   <td className="px-5 py-4 font-medium">{category.name}</td>
//                   <td className="px-5 py-4">
//                     <div className="flex gap-3">
//                       <Link
//                         href={`/admin/categories/edit/${category.id}`}
//                         className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
//                       >
//                         Edit
//                       </Link>

//                       <button
//                         onClick={() => handleDelete(category.id)}
//                         disabled={submitting}
//                         className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }








"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminCategories,
  deleteCategory,
  clearCategoryState,
} from "@/features/categories/categorySlice";

export default function AdminCategoryListPage() {
  const dispatch = useDispatch();
  const { adminCategories, loading, submitting, error, successMessage } =
    useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchAdminCategories());
    return () => dispatch(clearCategoryState());
  }, [dispatch]);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this category?");
    if (!confirmed) return;
    dispatch(deleteCategory(id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Admin Panel
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Categories
              </h1>
              <p className="mt-2 text-sm text-gray-500 md:text-base">
                Manage your product categories with a clean and organized dashboard.
              </p>
            </div>

            <Link
              href="/admin/categories/create"
              className="inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Create Category
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-700 shadow-sm">
            {successMessage}
          </div>
        )}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Category List
                </h2>
                <p className="text-sm text-gray-500">
                  View, edit, and delete your store categories.
                </p>
              </div>

              {!loading && adminCategories.length > 0 && (
                <div className="inline-flex w-fit items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                  Total: {adminCategories.length}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center px-6 py-10">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
                <p className="text-sm font-medium text-gray-500">
                  Loading categories...
                </p>
              </div>
            </div>
          ) : adminCategories.length === 0 ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-4">
                <svg
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 7.5l9-4 9 4m-18 0l9 4m-9-4v9l9 4m9-13l-9 4m9-4v9l-9 4m0-9v9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                No categories found
              </h3>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                You have not created any categories yet. Start by adding your first category.
              </p>
              <Link
                href="/admin/categories/create"
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Create First Category
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      ID
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category Name
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {adminCategories.map((category, index) => (
                    <tr
                      key={category.id}
                      className={`transition hover:bg-gray-50 ${
                        index !== adminCategories.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-5 text-sm font-medium text-gray-600">
                        #{category.id}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-sm font-bold text-white">
                            {category.name?.charAt(0)?.toUpperCase() || "C"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {category.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Store category
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">
                          Active
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-3">
                          <Link
                            href={`/admin/categories/edit/${category.id}`}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(category.id)}
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-xl border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}