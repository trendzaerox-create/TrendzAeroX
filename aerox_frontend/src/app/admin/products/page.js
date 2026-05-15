


"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminProducts,
  deleteProduct,
} from "@/features/adminProducts/adminProductThunks";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const products = useSelector((state) => state.adminProducts.products || []);
  const loading = useSelector((state) => state.adminProducts.loading);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleArchive = async (id) => {
    const ok = window.confirm(
      "Archive this product?\n\nIt will be hidden from customers but kept for order history."
    );

    if (!ok) return;

    const resultAction = await dispatch(deleteProduct(id));

    if (deleteProduct.fulfilled.match(resultAction)) {
      dispatch(fetchAdminProducts());
    } else {
      alert(resultAction.payload || "Archive failed");
    }
  };

  const getReviewStats = (product) => {
    const reviews = product.reviews || [];

    if (!reviews.length) {
      return {
        average: 0,
        count: 0,
      };
    }

    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);

    return {
      average: total / reviews.length,
      count: reviews.length,
    };
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  };

  const renderPriceBlock = (product) => {
    const sellingPrice = Number(product.priceInr || 0);
    const mrp = Number(product.mrpInr || 0);
    const discountPercent = Number(product.discountPercent || 0);

    if (discountPercent > 0 && mrp > sellingPrice) {
      return (
        <div style={styles.priceWrap}>
          <div style={styles.discountPriceRow}>
            <span style={styles.discountText}>-{discountPercent}%</span>
            <span style={styles.priceText}>
              ₹{sellingPrice.toLocaleString("en-IN")}
            </span>
          </div>

          <div style={styles.mrpRow}>
            MRP:{" "}
            <span style={styles.mrpText}>₹{mrp.toLocaleString("en-IN")}</span>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.priceWrap}>
        <span style={styles.priceText}>
          ₹{sellingPrice.toLocaleString("en-IN")}
        </span>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerCard}>
          <div>
            <p style={styles.overline}>Admin Dashboard</p>
            <h1 style={styles.heading}>Products Management</h1>
            <p style={styles.subtext}>
              Manage your inventory, edit products, archive items, and monitor
              product review performance.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/products/create")}
            style={styles.primaryButton}
          >
            + Create Product
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total Products</p>
            <h3 style={styles.statValue}>{products.length}</h3>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Active</p>
            <h3 style={styles.statValue}>
              {
                products.filter(
                  (p) => !(p.deleted === true || p.active === false)
                ).length
              }
            </h3>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Archived</p>
            <h3 style={styles.statValue}>
              {
                products.filter(
                  (p) => p.deleted === true || p.active === false
                ).length
              }
            </h3>
          </div>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.tableTitle}>All Products</h2>
              <p style={styles.tableSubtitle}>
                View and manage all products from one place.
              </p>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              <div style={styles.loader}></div>
              <p style={styles.loadingText}>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={styles.emptyBox}>
              <div style={styles.emptyIcon}>📦</div>
              <h3 style={styles.emptyTitle}>No products found</h3>
              <p style={styles.emptyText}>
                Start by creating your first product for the catalog.
              </p>
              <button
                onClick={() => router.push("/admin/products/create")}
                style={styles.primaryButton}
              >
                Create Product
              </button>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Product</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Reviews</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((p) => {
                    const firstImage = p.images?.[0];
                    const img =
                      typeof firstImage === "string"
                        ? firstImage
                        : firstImage?.imageUrl;

                    const isArchived = p.deleted === true || p.active === false;
                    const reviewStats = getReviewStats(p);

                    return (
                      <tr
                        key={p.id}
                        style={{
                          ...styles.tr,
                          opacity: isArchived ? 0.75 : 1,
                          backgroundColor: isArchived ? "#fcfcfd" : "#ffffff",
                        }}
                      >
                        <td style={styles.td}>
                          <span style={styles.idBadge}>#{p.id}</span>
                        </td>

                        <td style={styles.td}>
                          {img ? (
                            <img
                              src={
                                img.startsWith("http")
                                  ? img
                                  : `${process.env.NEXT_PUBLIC_API_BASE}${img}`
                              }
                              alt={p.title}
                              style={styles.productImage}
                            />
                          ) : (
                            <div style={styles.noImage}>No Image</div>
                          )}
                        </td>

                        <td style={styles.td}>
                          <div style={styles.productTitle}>{p.title}</div>
                        </td>

                        <td style={styles.td}>{renderPriceBlock(p)}</td>

                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.stockBadge,
                              background:
                                p.stock > 10
                                  ? "#ecfdf3"
                                  : p.stock > 0
                                  ? "#fff7ed"
                                  : "#fef2f2",
                              color:
                                p.stock > 10
                                  ? "#027a48"
                                  : p.stock > 0
                                  ? "#b54708"
                                  : "#b42318",
                            }}
                          >
                            {p.stock}
                          </span>
                        </td>

                        <td style={styles.td}>
                          {reviewStats.count > 0 ? (
                            <div style={styles.reviewWrap}>
                              <div style={styles.reviewStars}>
                                {renderStars(reviewStats.average)}
                              </div>
                              <div style={styles.reviewMeta}>
                                {reviewStats.average.toFixed(1)} / 5
                              </div>
                              <div style={styles.reviewCount}>
                                {reviewStats.count} review
                                {reviewStats.count > 1 ? "s" : ""}
                              </div>
                            </div>
                          ) : (
                            <span style={styles.noReviewText}>No reviews</span>
                          )}
                        </td>

                        <td style={styles.td}>
                          {isArchived ? (
                            <span
                              style={{
                                ...styles.statusBadge,
                                background: "#f2f4f7",
                                color: "#475467",
                              }}
                            >
                              Archived
                            </span>
                          ) : (
                            <span
                              style={{
                                ...styles.statusBadge,
                                background: "#ecfdf3",
                                color: "#027a48",
                              }}
                            >
                              Active
                            </span>
                          )}
                        </td>

                        <td style={styles.td}>
                          <div style={styles.actionGroup}>
                            <button
                              onClick={() =>
                                router.push(`/admin/products/edit/${p.id}`)
                              }
                              style={styles.editButton}
                            >
                              Edit
                            </button>

                            {!isArchived && (
                              <button
                                onClick={() => handleArchive(p.id)}
                                style={styles.archiveButton}
                              >
                                Archive
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 50%, #eef2f7 100%)",
    padding: "32px 20px",
  },

  container: {
    maxWidth: "1280px",
    margin: "0 auto",
  },

  headerCard: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "28px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    border: "1px solid #e5e7eb",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  overline: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#667085",
  },

  heading: {
    margin: "8px 0 10px",
    fontSize: "32px",
    lineHeight: 1.1,
    fontWeight: 800,
    color: "#101828",
  },

  subtext: {
    margin: 0,
    fontSize: "15px",
    color: "#667085",
    maxWidth: "680px",
    lineHeight: 1.6,
  },

  primaryButton: {
    background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(17, 24, 39, 0.18)",
    whiteSpace: "nowrap",
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "20px 22px",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
  },

  statLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#667085",
    fontWeight: 600,
  },

  statValue: {
    margin: "10px 0 0",
    fontSize: "28px",
    fontWeight: 800,
    color: "#101828",
  },

  tableCard: {
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
    overflow: "hidden",
  },

  tableHeader: {
    padding: "24px 24px 16px",
    borderBottom: "1px solid #eaecf0",
  },

  tableTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 800,
    color: "#101828",
  },

  tableSubtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#667085",
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    minWidth: "1120px",
  },

  th: {
    textAlign: "left",
    padding: "16px 18px",
    background: "#f9fafb",
    color: "#475467",
    fontSize: "13px",
    fontWeight: 700,
    borderBottom: "1px solid #eaecf0",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },

  tr: {
    transition: "all 0.2s ease",
  },

  td: {
    padding: "16px 18px",
    borderBottom: "1px solid #f2f4f7",
    verticalAlign: "middle",
    fontSize: "14px",
    color: "#101828",
  },

  idBadge: {
    display: "inline-block",
    background: "#f2f4f7",
    color: "#344054",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 700,
  },

  productImage: {
    width: "64px",
    height: "64px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.06)",
  },

  noImage: {
    width: "64px",
    height: "64px",
    borderRadius: "12px",
    border: "1px dashed #d0d5dd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    color: "#98a2b3",
    background: "#f9fafb",
  },

  productTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#101828",
    lineHeight: 1.5,
    maxWidth: "280px",
  },

  priceWrap: {
    display: "grid",
    gap: "4px",
  },

  discountPriceRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  discountText: {
    color: "#cc0c39",
    fontSize: "14px",
    fontWeight: 800,
  },

  priceText: {
    fontWeight: 800,
    color: "#111827",
  },

  mrpRow: {
    fontSize: "12px",
    color: "#6b7280",
  },

  mrpText: {
    textDecoration: "line-through",
  },

  stockBadge: {
    display: "inline-block",
    minWidth: "42px",
    textAlign: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
  },

  reviewWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  reviewStars: {
    fontSize: "14px",
    color: "#f59e0b",
    fontWeight: 700,
    letterSpacing: "1px",
  },

  reviewMeta: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#101828",
  },

  reviewCount: {
    fontSize: "12px",
    color: "#667085",
  },

  noReviewText: {
    fontSize: "13px",
    color: "#98a2b3",
    fontWeight: 600,
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
  },

  actionGroup: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  editButton: {
    background: "#ffffff",
    color: "#344054",
    border: "1px solid #d0d5dd",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },

  archiveButton: {
    background: "#fff7ed",
    color: "#b54708",
    border: "1px solid #fed7aa",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "13px",
    fontWeight: 700,
    cursor: "pointer",
  },

  loadingBox: {
    padding: "60px 20px",
    textAlign: "center",
  },

  loader: {
    width: "40px",
    height: "40px",
    margin: "0 auto 14px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #111827",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    margin: 0,
    fontSize: "14px",
    color: "#667085",
    fontWeight: 600,
  },

  emptyBox: {
    padding: "70px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    fontSize: "42px",
    marginBottom: "12px",
  },

  emptyTitle: {
    margin: "0 0 8px",
    fontSize: "22px",
    fontWeight: 800,
    color: "#101828",
  },

  emptyText: {
    margin: "0 0 20px",
    fontSize: "14px",
    color: "#667085",
  },
};