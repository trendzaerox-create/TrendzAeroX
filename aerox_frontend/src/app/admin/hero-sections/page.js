"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteHeroSection,
  fetchAdminHeroSections,
} from "@/features/heroSections/heroSectionSlice";

export default function AdminHeroSectionsPage() {
  const dispatch = useDispatch();
  const { adminItems, loadingAdmin } = useSelector((state) => state.heroSections);

  useEffect(() => {
    dispatch(fetchAdminHeroSections());
  }, [dispatch]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this hero section?");
    if (!ok) return;
    await dispatch(deleteHeroSection(id));
  };

  return (
    <div className="space-y-6">
      {/* Header with title and CTA button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Hero Sections
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage homepage hero banners linked to products.
          </p>
        </div>

        <Link
          href="/admin/hero-sections/create"
          className="inline-flex items-center justify-center rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800"
        >
          Add Hero Section
        </Link>
      </div>

      {/* Hero sections list card */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loadingAdmin ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading hero sections...
          </div>
        ) : adminItems?.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No hero sections found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {adminItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-gray-50/50 md:flex-row md:items-center md:justify-between"
              >
                {/* Left side: image + info */}
                <div className="flex min-w-0 items-center gap-4">
                  <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="text-sm text-gray-600">
                      Product: {item.productTitle || "N/A"}
                    </p>

                    <p className="text-sm text-gray-600">
                      Sort: {item.sortOrder} | Status:{" "}
                      <span
                        className={
                          item.active
                            ? "font-semibold text-green-600"
                            : "font-semibold text-gray-400"
                        }
                      >
                        {item.active ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right side: action buttons */}
                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <Link
                    href={`/admin/hero-sections/edit/${item.id}`}
                    className="inline-flex min-w-[90px] items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="inline-flex min-w-[100px] items-center justify-center rounded-full border border-red-700 bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




// "use client";

// import Link from "next/link";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   deleteHeroSection,
//   fetchAdminHeroSections,
// } from "@/features/heroSections/heroSectionSlice";

// export default function AdminHeroSectionsPage() {
//   const dispatch = useDispatch();
//   const { adminItems, loadingAdmin } = useSelector((state) => state.heroSections);

//   useEffect(() => {
//     dispatch(fetchAdminHeroSections());
//   }, [dispatch]);

//   const handleDelete = async (id) => {
//     const ok = window.confirm("Are you sure you want to delete this hero section?");
//     if (!ok) return;
//     await dispatch(deleteHeroSection(id));
//   };

//   return (
//     <div className="min-h-screen bg-[#f8f8f8]">
//       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
//         {/* Top Header */}
//         <div className="mb-6 rounded-[28px] border border-gray-200 bg-white px-6 py-6 shadow-sm sm:px-8">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//             <div>
//               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
//                 Admin Dashboard
//               </p>
//               <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
//                 Hero Sections
//               </h1>
//               <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
//                 Manage homepage hero banners linked with products. Keep your
//                 storefront premium, clean, and conversion-focused.
//               </p>
//             </div>

//             <Link
//               href="/admin/hero-sections/create"
//               className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-800"
//             >
//               Add Hero Section
//             </Link>
//           </div>
//         </div>

//         {/* List */}
//         <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
//           {loadingAdmin ? (
//             <div className="p-10 text-center text-sm font-medium text-gray-500">
//               Loading hero sections...
//             </div>
//           ) : adminItems?.length === 0 ? (
//             <div className="p-10 text-center">
//               <h3 className="text-base font-semibold text-gray-900">
//                 No hero sections found
//               </h3>
//               <p className="mt-2 text-sm text-gray-500">
//                 Start by creating your first homepage hero section.
//               </p>
//               <div className="mt-5">
//                 <Link
//                   href="/admin/hero-sections/create"
//                   className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
//                 >
//                   Create Hero Section
//                 </Link>
//               </div>
//             </div>
//           ) : (
//             <div className="divide-y divide-gray-100">
//               {adminItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="flex flex-col gap-5 p-5 transition hover:bg-gray-50 md:flex-row md:items-center md:justify-between md:p-6"
//                 >
//                   <div className="flex min-w-0 items-center gap-4">
//                     <div className="h-24 w-32 flex-shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
//                       <img
//                         src={item.imageUrl}
//                         alt={item.title}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>

//                     <div className="min-w-0">
//                       <h3 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
//                         {item.title}
//                       </h3>

//                       <p className="mt-1 text-sm text-gray-600">
//                         Linked Product:{" "}
//                         <span className="font-medium text-gray-800">
//                           {item.productTitle || "N/A"}
//                         </span>
//                       </p>

//                       <div className="mt-3 flex flex-wrap items-center gap-2">
//                         <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
//                           Sort Order: {item.sortOrder}
//                         </span>

//                         <span
//                           className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
//                             item.active
//                               ? "bg-green-50 text-green-700"
//                               : "bg-gray-100 text-gray-500"
//                           }`}
//                         >
//                           {item.active ? "Active" : "Inactive"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-wrap items-center gap-3 md:justify-end">
//                     <Link
//                       href={`/admin/hero-sections/edit/${item.id}`}
//                       className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
//                     >
//                       Edit
//                     </Link>

//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }