



"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { fetchProducts } from "../../../features/products/productSlice";

export default function ProductsPage() {

  const dispatch = useDispatch();
  const products = useSelector(state => state.products.items) || [];

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ⭐ Calculate average rating
  const getRatingData = (reviews) => {
    if (!reviews || reviews.length === 0) {
      return { avg: 0, count: 0 };
    }

    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avg = total / reviews.length;

    return {
      avg: avg,
      count: reviews.length
    };
  };

  // ⭐ Render stars (Amazon style)
  const renderStars = (avg) => {
    const full = Math.round(avg);

    return (
      <span style={{ color: "#f59e0b", fontSize: "14px" }}>
        {"★".repeat(full)}
        {"☆".repeat(5 - full)}
      </span>
    );
  };

  return (

    <div style={{ padding: "40px" }}>

      <h1>Products</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >

        {products.map((p) => {

          const firstImage = p.images?.[0];
          const { avg, count } = getRatingData(p.reviews);

          return (

            <Link
              key={p.id}
              href={`/product/${p.id}`}
              style={{
                textDecoration: "none",
                color: "inherit"
              }}
            >

              <div
                style={{
                  border: "1px solid #ddd",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "#fff",
                  cursor: "pointer"
                }}
              >

                {/* IMAGE */}

                {firstImage ? (

                  <img
                    src={
                      firstImage.startsWith("http")
                        ? firstImage
                        : `${process.env.NEXT_PUBLIC_API_BASE}${firstImage}`
                    }
                    alt={p.title}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      marginBottom: "10px"
                    }}
                  />

                ) : (

                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      background: "#f5f5f5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "6px",
                      marginBottom: "10px"
                    }}
                  >
                    No Image
                  </div>

                )}

                {/* PRODUCT INFO */}

                <h3 style={{ marginBottom: "6px" }}>{p.title}</h3>

                {/* ⭐ RATING */}

                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                  {renderStars(avg)}
                  <span style={{ fontSize: "13px", color: "#555" }}>
                    ({count})
                  </span>
                </div>

                <p style={{ fontWeight: "bold" }}>
                  ₹ {p.priceInr}
                </p>

                <p>Stock: {p.stock}</p>

                <p style={{ color: "#777" }}>
                  Category: {p.category}
                </p>

              </div>

            </Link>

          );

        })}

      </div>

    </div>

  );
}