



// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Link from "next/link";

// import { fetchProducts } from "../../../features/products/productSlice";

// export default function ProductsPage() {

//   const dispatch = useDispatch();
//   const products = useSelector(state => state.products.items) || [];

//   useEffect(() => {
//     dispatch(fetchProducts());
//   }, [dispatch]);

//   // ⭐ Calculate average rating
//   const getRatingData = (reviews) => {
//     if (!reviews || reviews.length === 0) {
//       return { avg: 0, count: 0 };
//     }

//     const total = reviews.reduce((sum, r) => sum + r.rating, 0);
//     const avg = total / reviews.length;

//     return {
//       avg: avg,
//       count: reviews.length
//     };
//   };

//   // ⭐ Render stars (Amazon style)
//   const renderStars = (avg) => {
//     const full = Math.round(avg);

//     return (
//       <span style={{ color: "#f59e0b", fontSize: "14px" }}>
//         {"★".repeat(full)}
//         {"☆".repeat(5 - full)}
//       </span>
//     );
//   };

//   return (

//     <div style={{ padding: "40px" }}>

//       <h1>Products</h1>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
//           gap: "20px",
//           marginTop: "20px"
//         }}
//       >

//         {products.map((p) => {

//           const firstImage = p.images?.[0];
//           const { avg, count } = getRatingData(p.reviews);

//           return (

//             <Link
//               key={p.id}
//               href={`/product/${p.id}`}
//               style={{
//                 textDecoration: "none",
//                 color: "inherit"
//               }}
//             >

//               <div
//                 style={{
//                   border: "1px solid #ddd",
//                   padding: "12px",
//                   borderRadius: "8px",
//                   background: "#fff",
//                   cursor: "pointer"
//                 }}
//               >

//                 {/* IMAGE */}

//                 {firstImage ? (

//                   <img
//                     src={
//                       firstImage.startsWith("http")
//                         ? firstImage
//                         : `${process.env.NEXT_PUBLIC_API_BASE}${firstImage}`
//                     }
//                     alt={p.title}
//                     style={{
//                       width: "100%",
//                       height: "200px",
//                       objectFit: "cover",
//                       borderRadius: "6px",
//                       marginBottom: "10px"
//                     }}
//                   />

//                 ) : (

//                   <div
//                     style={{
//                       width: "100%",
//                       height: "200px",
//                       background: "#f5f5f5",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       borderRadius: "6px",
//                       marginBottom: "10px"
//                     }}
//                   >
//                     No Image
//                   </div>

//                 )}

//                 {/* PRODUCT INFO */}

//                 <h3 style={{ marginBottom: "6px" }}>{p.title}</h3>

//                 {/* ⭐ RATING */}

//                 <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
//                   {renderStars(avg)}
//                   <span style={{ fontSize: "13px", color: "#555" }}>
//                     ({count})
//                   </span>
//                 </div>

//                 <p style={{ fontWeight: "bold" }}>
//                   ₹ {p.priceInr}
//                 </p>

//                 <p>Stock: {p.stock}</p>

//                 <p style={{ color: "#777" }}>
//                   Category: {p.category}
//                 </p>

//               </div>

//             </Link>

//           );

//         })}

//       </div>

//     </div>

//   );
// }


















































"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import ProductCard from "@/components/ProductCard";
import api from "@/lib/apiClient";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/api/products"),
          api.get("/api/categories"),
        ]);

        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        setProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const selectedCategory = useMemo(() => {
    if (!categoryId) return null;

    return categories.find(
      (category) => Number(category.id) === Number(categoryId)
    );
  }, [categories, categoryId]);

  const isSameCategory = (product) => {
    if (!categoryId) return true;

    if (Number(product.categoryId) === Number(categoryId)) return true;
    if (Number(product.category?.id) === Number(categoryId)) return true;

    if (
      selectedCategory &&
      typeof product.category === "string" &&
      product.category.trim().toLowerCase() ===
        selectedCategory.name.trim().toLowerCase()
    ) {
      return true;
    }

    if (
      selectedCategory &&
      typeof product.category?.name === "string" &&
      product.category.name.trim().toLowerCase() ===
        selectedCategory.name.trim().toLowerCase()
    ) {
      return true;
    }

    return false;
  };

  const selectedCategoryProducts = useMemo(() => {
    if (!categoryId) return products;
    return products.filter((product) => isSameCategory(product));
  }, [products, categoryId, selectedCategory]);

  const otherProducts = useMemo(() => {
    if (!categoryId) return [];
    return products.filter((product) => !isSameCategory(product));
  }, [products, categoryId, selectedCategory]);

  const renderGrid = (items) => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((product) => (
        <div key={product.id} className="h-full">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Trendz AeroX
          </p>

          <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">
            {selectedCategory ? selectedCategory.name : "Products"}
          </h1>
        </div>

        {loading && (
          <p className="text-sm text-neutral-500">Loading products...</p>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && selectedCategoryProducts.length === 0 ? (
          <div className="rounded-[24px] border border-neutral-200 bg-[#fafafa] px-6 py-14 text-center text-[15px] text-neutral-500 shadow-[0_12px_30px_rgba(0,0,0,0.03)]">
            No products found.
          </div>
        ) : (
          !loading && renderGrid(selectedCategoryProducts)
        )}

        {!loading && categoryId && otherProducts.length > 0 && (
          <section className="mt-14">
            <div className="mb-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                More Collection
              </p>

              <h2 className="mt-3 text-[24px] font-semibold tracking-[-0.03em] text-black sm:text-[30px]">
                Other Products You May Like
              </h2>
            </div>

            {renderGrid(otherProducts)}
          </section>
        )}
      </div>
    </main>
  );
}