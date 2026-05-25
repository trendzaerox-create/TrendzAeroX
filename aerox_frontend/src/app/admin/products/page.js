

// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAdminProducts,
//   deleteProduct,
// } from "@/features/adminProducts/adminProductThunks";
// import { useRouter } from "next/navigation";

// export default function AdminProductsPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const products = useSelector((state) => state.adminProducts.products || []);
//   console.log("ADMIN PRODUCTS =", products);
//   const loading = useSelector((state) => state.adminProducts.loading);

//   useEffect(() => {
//     dispatch(fetchAdminProducts());
//   }, [dispatch]);

//   const handleArchive = async (id) => {
//     const ok = window.confirm(
//       "Archive this product?\n\nIt will be hidden from customers but kept for order history."
//     );

//     if (!ok) return;

//     const resultAction = await dispatch(deleteProduct(id));

//     if (deleteProduct.fulfilled.match(resultAction)) {
//       dispatch(fetchAdminProducts());
//     } else {
//       alert(resultAction.payload || "Archive failed");
//     }
//   };

//   const hasValue = (value) =>
//     value !== null && value !== undefined && String(value).trim() !== "";

//   const shortText = (value, limit = 120) => {
//     if (!hasValue(value)) return "—";
//     const text = String(value);
//     return text.length > limit ? `${text.slice(0, limit)}...` : text;
//   };

//   const getCategoryName = (category) => {
//     if (!category) return "No category";
//     if (typeof category === "object") return category?.name || "No category";
//     return category;
//   };

//   const getImageSrc = (image) => {
//     if (!image) return "";

//     const img =
//       typeof image === "string"
//         ? image
//         : image?.imageUrl ||
//           image?.url ||
//           image?.mediaUrl ||
//           image?.videoUrl ||
//           "";

//     if (!img) return "";

//     if (img.startsWith("http")) return img;

//     const base =
//       process.env.NEXT_PUBLIC_API_BASE ||
//       process.env.NEXT_PUBLIC_API_BASE_URL ||
//       process.env.NEXT_PUBLIC_API_URL ||
//       "";

//     return `${base}${img}`;
//   };

//   const parseJsonArray = (value) => {
//     if (!hasValue(value)) return [];

//     try {
//       const parsed = JSON.parse(value);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch {
//       return [];
//     }
//   };

//   const renderBannerPreview = (value) => {
//     const banners = parseJsonArray(value);

//     if (banners.length === 0) {
//       return <span style={styles.emptyTextSmall}>—</span>;
//     }

//     return (
//       <div style={styles.bannerPreviewWrap}>
//         {banners.slice(0, 4).map((banner, index) => {
//           const img = getImageSrc(banner.imageUrl || banner.url || banner.mediaUrl);

//           return (
//             <div key={`${img}-${index}`} style={styles.bannerItem}>
//               {img ? (
//                 <img
//                   src={img}
//                   alt={banner.title || "PDP Banner"}
//                   style={styles.bannerImage}
//                 />
//               ) : (
//                 <div style={styles.noBannerImage}>No Image</div>
//               )}

//               <div style={styles.bannerTitle}>
//                 {banner.title || `Banner ${index + 1}`}
//               </div>
//             </div>
//           );
//         })}

//         {banners.length > 4 && (
//           <div style={styles.moreBannerText}>+{banners.length - 4} more</div>
//         )}
//       </div>
//     );
//   };

//   const renderJsonPreview = (value) => {
//     if (!hasValue(value)) return <span style={styles.emptyTextSmall}>—</span>;

//     return (
//       <pre style={styles.jsonPreview}>
//         {String(value).length > 280
//           ? `${String(value).slice(0, 280)}...`
//           : String(value)}
//       </pre>
//     );
//   };

//   const renderPriceBlock = (product) => {
//     const sellingPrice = Number(product.priceInr || 0);
//     const mrp = Number(product.mrpInr || 0);
//     const discountPercent = Number(product.discountPercent || 0);

//     return (
//       <div style={styles.priceWrap}>
//         <span style={styles.priceText}>
//           ₹{sellingPrice.toLocaleString("en-IN")}
//         </span>

//         {discountPercent > 0 && mrp > sellingPrice && (
//           <>
//             <span style={styles.discountText}>-{discountPercent}%</span>
//             <span style={styles.mrpText}>
//               MRP ₹{mrp.toLocaleString("en-IN")}
//             </span>
//           </>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <div style={styles.headerCard}>
//           <div>
//             <p style={styles.overline}>Admin Dashboard</p>
//             <h1 style={styles.heading}>Products Management</h1>
//             <p style={styles.subtext}>
//               View all products with complete advanced PDP content.
//             </p>
//           </div>

//           <button
//             onClick={() => router.push("/admin/products/create")}
//             style={styles.primaryButton}
//           >
//             + Create Product
//           </button>
//         </div>

//         <div style={styles.tableCard}>
//           <div style={styles.tableHeader}>
//             <h2 style={styles.tableTitle}>All Products With PDP Details</h2>
//             <p style={styles.tableSubtitle}>
//               Scroll horizontally to view all product PDP fields.
//             </p>
//           </div>

//           {loading ? (
//             <div style={styles.loadingBox}>Loading products...</div>
//           ) : products.length === 0 ? (
//             <div style={styles.emptyBox}>No products found.</div>
//           ) : (
//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>ID</th>
//                     <th style={styles.th}>Image</th>
//                     <th style={styles.th}>Title</th>
//                     <th style={styles.th}>Price</th>
//                     <th style={styles.th}>Stock</th>
//                     <th style={styles.th}>Short Highlights</th>
//                     <th style={styles.th}>Specifications</th>
//                     <th style={styles.th}>Feature Highlights</th>
//                     <th style={styles.th}>PDP Banner Images</th>
//                     <th style={styles.th}>PDP Banners JSON</th>
//                     <th style={styles.th}>FAQ</th>
//                     <th style={styles.th}>Warranty</th>
//                     <th style={styles.th}>Box Contents</th>
//                     <th style={styles.th}>Compatibility</th>
//                     <th style={styles.th}>Demo Video</th>
//                     <th style={styles.th}>Status</th>
//                     <th style={styles.th}>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {products.map((p) => {
//                     const firstImage = p.images?.[0];
//                     const img = getImageSrc(firstImage);
//                     const isArchived = p.deleted === true || p.active === false;

//                     return (
//                       <tr key={p.id} style={styles.tr}>
//                         <td style={styles.td}>
//                           <span style={styles.idBadge}>#{p.id}</span>
//                         </td>

//                         <td style={styles.td}>
//                           {img ? (
//                             <img src={img} alt={p.title} style={styles.productImage} />
//                           ) : (
//                             <div style={styles.noImage}>No Image</div>
//                           )}
//                         </td>

//                         <td style={styles.td}>
//                           <div style={styles.productTitle}>{p.title}</div>
//                           <div style={styles.productCategory}>
//                             {getCategoryName(p.category)}
//                           </div>
//                         </td>

//                         <td style={styles.td}>{renderPriceBlock(p)}</td>

//                         <td style={styles.td}>
//                           <span style={styles.stockBadge}>{p.stock}</span>
//                         </td>

//                         <td style={styles.tdWide}>{shortText(p.shortHighlights)}</td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.specificationsJson)}
//                         </td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.featureHighlightsJson)}
//                         </td>

//                         <td style={styles.tdBanner}>
//                           {renderBannerPreview(p.pdpBannersJson)}
//                         </td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.pdpBannersJson)}
//                         </td>

//                         <td style={styles.tdJson}>{renderJsonPreview(p.faqJson)}</td>

//                         <td style={styles.tdWide}>{shortText(p.warrantyInfo)}</td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.boxContentsJson)}
//                         </td>

//                         <td style={styles.tdWide}>{shortText(p.compatibility)}</td>

//                         <td style={styles.tdWide}>
//                           {hasValue(p.demoVideoUrl) ? (
//                             <a
//                               href={p.demoVideoUrl}
//                               target="_blank"
//                               rel="noreferrer"
//                               style={styles.link}
//                             >
//                               Open Video
//                             </a>
//                           ) : (
//                             "—"
//                           )}
//                         </td>

//                         <td style={styles.td}>
//                           <span
//                             style={{
//                               ...styles.statusBadge,
//                               background: isArchived ? "#f2f4f7" : "#ecfdf3",
//                               color: isArchived ? "#475467" : "#027a48",
//                             }}
//                           >
//                             {isArchived ? "Archived" : "Active"}
//                           </span>
//                         </td>

//                         <td style={styles.td}>
//                           <div style={styles.actionGroup}>
//                             <button
//                               onClick={() =>
//                                 router.push(`/admin/products/edit/${p.id}`)
//                               }
//                               style={styles.editButton}
//                             >
//                               Edit
//                             </button>

//                             {!isArchived && (
//                               <button
//                                 onClick={() => handleArchive(p.id)}
//                                 style={styles.archiveButton}
//                               >
//                                 Archive
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#f8fafc",
//     padding: "32px 20px",
//   },
//   container: {
//     maxWidth: "1600px",
//     margin: "0 auto",
//   },
//   headerCard: {
//     background: "#ffffff",
//     borderRadius: "20px",
//     padding: "28px 32px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: "20px",
//     border: "1px solid #e5e7eb",
//     marginBottom: "24px",
//     flexWrap: "wrap",
//   },
//   overline: {
//     margin: 0,
//     fontSize: "12px",
//     fontWeight: 700,
//     letterSpacing: "0.08em",
//     textTransform: "uppercase",
//     color: "#667085",
//   },
//   heading: {
//     margin: "8px 0 10px",
//     fontSize: "32px",
//     fontWeight: 800,
//     color: "#101828",
//   },
//   subtext: {
//     margin: 0,
//     fontSize: "15px",
//     color: "#667085",
//   },
//   primaryButton: {
//     background: "#111827",
//     color: "#fff",
//     border: "none",
//     borderRadius: "12px",
//     padding: "14px 18px",
//     fontSize: "14px",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   tableCard: {
//     background: "#ffffff",
//     borderRadius: "20px",
//     border: "1px solid #e5e7eb",
//     overflow: "hidden",
//   },
//   tableHeader: {
//     padding: "24px",
//     borderBottom: "1px solid #eaecf0",
//   },
//   tableTitle: {
//     margin: 0,
//     fontSize: "20px",
//     fontWeight: 800,
//     color: "#101828",
//   },
//   tableSubtitle: {
//     margin: "6px 0 0",
//     fontSize: "14px",
//     color: "#667085",
//   },
//   tableWrapper: {
//     width: "100%",
//     overflowX: "auto",
//   },
//   table: {
//     width: "100%",
//     minWidth: "3200px",
//     borderCollapse: "separate",
//     borderSpacing: 0,
//   },
//   th: {
//     textAlign: "left",
//     padding: "14px 16px",
//     background: "#f9fafb",
//     color: "#475467",
//     fontSize: "13px",
//     fontWeight: 800,
//     borderBottom: "1px solid #eaecf0",
//     whiteSpace: "nowrap",
//   },
//   tr: {
//     background: "#ffffff",
//   },
//   td: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "top",
//     fontSize: "14px",
//     color: "#101828",
//     whiteSpace: "nowrap",
//   },
//   tdWide: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "top",
//     fontSize: "13px",
//     color: "#344054",
//     width: "240px",
//     minWidth: "240px",
//     lineHeight: 1.5,
//     whiteSpace: "normal",
//   },
//   tdJson: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "top",
//     width: "320px",
//     minWidth: "320px",
//   },
//   tdBanner: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "top",
//     width: "360px",
//     minWidth: "360px",
//   },
//   bannerPreviewWrap: {
//     display: "flex",
//     gap: "10px",
//     flexWrap: "wrap",
//     alignItems: "flex-start",
//   },
//   bannerItem: {
//     width: "150px",
//   },
//   bannerImage: {
//     width: "150px",
//     height: "78px",
//     objectFit: "cover",
//     borderRadius: "10px",
//     border: "1px solid #e5e7eb",
//     background: "#ffffff",
//     display: "block",
//   },
//   noBannerImage: {
//     width: "150px",
//     height: "78px",
//     borderRadius: "10px",
//     border: "1px dashed #d0d5dd",
//     background: "#f9fafb",
//     color: "#98a2b3",
//     fontSize: "11px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   bannerTitle: {
//     marginTop: "6px",
//     fontSize: "12px",
//     fontWeight: 700,
//     color: "#344054",
//     lineHeight: 1.35,
//     maxWidth: "150px",
//   },
//   moreBannerText: {
//     fontSize: "12px",
//     color: "#667085",
//     fontWeight: 700,
//     paddingTop: "28px",
//   },
//   idBadge: {
//     display: "inline-block",
//     background: "#f2f4f7",
//     color: "#344054",
//     borderRadius: "999px",
//     padding: "6px 10px",
//     fontSize: "12px",
//     fontWeight: 700,
//   },
//   productImage: {
//     width: "64px",
//     height: "64px",
//     objectFit: "cover",
//     borderRadius: "12px",
//     border: "1px solid #e5e7eb",
//     background: "#fff",
//   },
//   noImage: {
//     width: "64px",
//     height: "64px",
//     borderRadius: "12px",
//     border: "1px dashed #d0d5dd",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "11px",
//     color: "#98a2b3",
//     background: "#f9fafb",
//   },
//   productTitle: {
//     fontSize: "14px",
//     fontWeight: 800,
//     color: "#101828",
//     lineHeight: 1.5,
//     maxWidth: "280px",
//     whiteSpace: "normal",
//   },
//   productCategory: {
//     marginTop: "4px",
//     fontSize: "12px",
//     color: "#667085",
//   },
//   priceWrap: {
//     display: "grid",
//     gap: "4px",
//   },
//   priceText: {
//     fontWeight: 800,
//     color: "#111827",
//   },
//   discountText: {
//     color: "#cc0c39",
//     fontSize: "13px",
//     fontWeight: 800,
//   },
//   mrpText: {
//     color: "#667085",
//     fontSize: "12px",
//     textDecoration: "line-through",
//   },
//   stockBadge: {
//     display: "inline-block",
//     minWidth: "42px",
//     textAlign: "center",
//     padding: "6px 10px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 700,
//     background: "#ecfdf3",
//     color: "#027a48",
//   },
//   jsonPreview: {
//     margin: 0,
//     maxHeight: "150px",
//     overflow: "auto",
//     whiteSpace: "pre-wrap",
//     wordBreak: "break-word",
//     background: "#f8fafc",
//     border: "1px solid #e5e7eb",
//     borderRadius: "10px",
//     padding: "10px",
//     color: "#344054",
//     fontSize: "12px",
//     lineHeight: 1.5,
//     fontFamily:
//       "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
//   },
//   emptyTextSmall: {
//     color: "#98a2b3",
//     fontSize: "13px",
//   },
//   link: {
//     color: "#2563eb",
//     fontWeight: 700,
//     textDecoration: "underline",
//   },
//   statusBadge: {
//     display: "inline-block",
//     padding: "6px 12px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 800,
//   },
//   actionGroup: {
//     display: "flex",
//     gap: "8px",
//     flexWrap: "wrap",
//   },
//   editButton: {
//     background: "#ffffff",
//     color: "#344054",
//     border: "1px solid #d0d5dd",
//     borderRadius: "10px",
//     padding: "10px 14px",
//     fontSize: "13px",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   archiveButton: {
//     background: "#fff7ed",
//     color: "#b54708",
//     border: "1px solid #fed7aa",
//     borderRadius: "10px",
//     padding: "10px 14px",
//     fontSize: "13px",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   loadingBox: {
//     padding: "60px 20px",
//     textAlign: "center",
//     color: "#667085",
//   },
//   emptyBox: {
//     padding: "70px 20px",
//     textAlign: "center",
//     color: "#667085",
//   },
// };


























// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAdminProducts,
//   deleteProduct,
// } from "@/features/adminProducts/adminProductThunks";
// import { useRouter } from "next/navigation";

// export default function AdminProductsPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();

//   const products = useSelector((state) => state.adminProducts.products || []);
//   console.log("ADMIN PRODUCTS =", products);
//   const loading = useSelector((state) => state.adminProducts.loading);

//   useEffect(() => {
//     dispatch(fetchAdminProducts());
//   }, [dispatch]);

//   const handleArchive = async (id) => {
//     const ok = window.confirm(
//       "Archive this product?\n\nIt will be hidden from customers but kept for order history."
//     );

//     if (!ok) return;

//     const resultAction = await dispatch(deleteProduct(id));

//     if (deleteProduct.fulfilled.match(resultAction)) {
//       dispatch(fetchAdminProducts());
//     } else {
//       alert(resultAction.payload || "Archive failed");
//     }
//   };

//   const hasValue = (value) =>
//     value !== null && value !== undefined && String(value).trim() !== "";

//   const shortText = (value, limit = 120) => {
//     if (!hasValue(value)) return "—";
//     const text = String(value);
//     return text.length > limit ? `${text.slice(0, limit)}...` : text;
//   };

//   const getCategoryName = (category) => {
//     if (!category) return "No category";
//     if (typeof category === "object") return category?.name || "No category";
//     return category;
//   };

//   const getImageSrc = (image) => {
//     if (!image) return "";

//     const img =
//       typeof image === "string"
//         ? image
//         : image?.imageUrl ||
//           image?.url ||
//           image?.mediaUrl ||
//           image?.videoUrl ||
//           "";

//     if (!img) return "";

//     if (img.startsWith("http")) return img;

//     const base =
//       process.env.NEXT_PUBLIC_API_BASE ||
//       process.env.NEXT_PUBLIC_API_BASE_URL ||
//       process.env.NEXT_PUBLIC_API_URL ||
//       "";

//     return `${base}${img}`;
//   };

//   const parseJsonArray = (value) => {
//     if (!hasValue(value)) return [];

//     try {
//       const parsed = JSON.parse(value);
//       return Array.isArray(parsed) ? parsed : [];
//     } catch {
//       return [];
//     }
//   };

//   const renderBannerPreview = (value) => {
//     const banners = parseJsonArray(value);

//     if (banners.length === 0) {
//       return <span style={styles.emptyTextSmall}>—</span>;
//     }

//     return (
//       <div style={styles.bannerPreviewWrap}>
//         {banners.slice(0, 4).map((banner, index) => {
//           const img = getImageSrc(
//             banner.imageUrl || banner.url || banner.mediaUrl
//           );

//           return (
//             <div key={`${img}-${index}`} style={styles.bannerItem}>
//               {img ? (
//                 <img
//                   src={img}
//                   alt={banner.title || "PDP Banner"}
//                   style={styles.bannerImage}
//                 />
//               ) : (
//                 <div style={styles.noBannerImage}>No Image</div>
//               )}

//               <div style={styles.bannerTitle}>
//                 {banner.title || `Banner ${index + 1}`}
//               </div>
//             </div>
//           );
//         })}

//         {banners.length > 4 && (
//           <div style={styles.moreBannerText}>+{banners.length - 4} more</div>
//         )}
//       </div>
//     );
//   };

//   const renderJsonPreview = (value) => {
//     if (!hasValue(value)) return <span style={styles.emptyTextSmall}>—</span>;

//     return (
//       <pre style={styles.jsonPreview}>
//         {String(value).length > 280
//           ? `${String(value).slice(0, 280)}...`
//           : String(value)}
//       </pre>
//     );
//   };

//   const renderPriceBlock = (product) => {
//     const sellingPrice = Number(product.priceInr || 0);
//     const mrp = Number(product.mrpInr || 0);
//     const discountPercent = Number(product.discountPercent || 0);

//     return (
//       <div style={styles.priceWrap}>
//         <span style={styles.priceText}>
//           ₹{sellingPrice.toLocaleString("en-IN")}
//         </span>

//         {discountPercent > 0 && mrp > sellingPrice && (
//           <>
//             <span style={styles.discountText}>-{discountPercent}%</span>
//             <span style={styles.mrpText}>
//               MRP ₹{mrp.toLocaleString("en-IN")}
//             </span>
//           </>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.container}>
//         <div style={styles.headerCard}>
//           <div>
//             <p style={styles.overline}>Admin Dashboard</p>
//             <h1 style={styles.heading}>Products Management</h1>
//             <p style={styles.subtext}>
//               View all products with complete advanced PDP content.
//             </p>
//           </div>

//           <button
//             onClick={() => router.push("/admin/products/create")}
//             style={styles.primaryButton}
//           >
//             + Create Product
//           </button>
//         </div>

//         <div style={styles.tableCard}>
//           <div style={styles.tableHeader}>
//             <h2 style={styles.tableTitle}>All Products With PDP Details</h2>
//             <p style={styles.tableSubtitle}>
//               Scroll horizontally to view all product PDP fields.
//             </p>
//           </div>

//           {loading ? (
//             <div style={styles.loadingBox}>Loading products...</div>
//           ) : products.length === 0 ? (
//             <div style={styles.emptyBox}>No products found.</div>
//           ) : (
//             <div style={styles.tableWrapper}>
//               <table style={styles.table}>
//                 <thead>
//                   <tr>
//                     <th style={styles.th}>Order</th>
//                     <th style={styles.th}>ID</th>
//                     <th style={styles.th}>Image</th>
//                     <th style={styles.th}>Title</th>
//                     <th style={styles.th}>Price</th>
//                     <th style={styles.th}>Stock</th>
//                     <th style={styles.th}>Short Highlights</th>
//                     <th style={styles.th}>Specifications</th>
//                     <th style={styles.th}>Feature Highlights</th>
//                     <th style={styles.th}>PDP Banner Images</th>
//                     <th style={styles.th}>PDP Banners JSON</th>
//                     <th style={styles.th}>FAQ</th>
//                     <th style={styles.th}>Warranty</th>
//                     <th style={styles.th}>Box Contents</th>
//                     <th style={styles.th}>Compatibility</th>
//                     <th style={styles.th}>Demo Video</th>
//                     <th style={styles.th}>Status</th>
//                     <th style={styles.th}>Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {products.map((p) => {
//                     const firstImage = p.images?.[0];
//                     const img = getImageSrc(firstImage);
//                     const isArchived = p.deleted === true || p.active === false;

//                     return (
//                       <tr key={p.id} style={styles.tr}>
//                         <td style={styles.td}>
//                           <span style={styles.orderBadge}>
//                             {p.displayOrder ?? 0}
//                           </span>
//                         </td>

//                         <td style={styles.td}>
//                           <span style={styles.idBadge}>#{p.id}</span>
//                         </td>

//                         <td style={styles.td}>
//                           {img ? (
//                             <img
//                               src={img}
//                               alt={p.title}
//                               style={styles.productImage}
//                             />
//                           ) : (
//                             <div style={styles.noImage}>No Image</div>
//                           )}
//                         </td>

//                         <td style={styles.td}>
//                           <div style={styles.productTitle}>{p.title}</div>
//                           <div style={styles.productCategory}>
//                             {getCategoryName(p.category)}
//                           </div>
//                         </td>

//                         <td style={styles.td}>{renderPriceBlock(p)}</td>

//                         <td style={styles.td}>
//                           <span style={styles.stockBadge}>{p.stock}</span>
//                         </td>

//                         <td style={styles.tdWide}>
//                           {shortText(p.shortHighlights)}
//                         </td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.specificationsJson)}
//                         </td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.featureHighlightsJson)}
//                         </td>

//                         <td style={styles.tdBanner}>
//                           {renderBannerPreview(p.pdpBannersJson)}
//                         </td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.pdpBannersJson)}
//                         </td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.faqJson)}
//                         </td>

//                         <td style={styles.tdWide}>
//                           {shortText(p.warrantyInfo)}
//                         </td>

//                         <td style={styles.tdJson}>
//                           {renderJsonPreview(p.boxContentsJson)}
//                         </td>

//                         <td style={styles.tdWide}>
//                           {shortText(p.compatibility)}
//                         </td>

//                         <td style={styles.tdWide}>
//                           {hasValue(p.demoVideoUrl) ? (
//                             <a
//                               href={p.demoVideoUrl}
//                               target="_blank"
//                               rel="noreferrer"
//                               style={styles.link}
//                             >
//                               Open Video
//                             </a>
//                           ) : (
//                             "—"
//                           )}
//                         </td>

//                         <td style={styles.td}>
//                           <span
//                             style={{
//                               ...styles.statusBadge,
//                               background: isArchived ? "#f2f4f7" : "#ecfdf3",
//                               color: isArchived ? "#475467" : "#027a48",
//                             }}
//                           >
//                             {isArchived ? "Archived" : "Active"}
//                           </span>
//                         </td>

//                         <td style={styles.td}>
//                           <div style={styles.actionGroup}>
//                             <button
//                               onClick={() =>
//                                 router.push(`/admin/products/edit/${p.id}`)
//                               }
//                               style={styles.editButton}
//                             >
//                               Edit
//                             </button>

//                             {!isArchived && (
//                               <button
//                                 onClick={() => handleArchive(p.id)}
//                                 style={styles.archiveButton}
//                               >
//                                 Archive
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   page: {
//     minHeight: "100vh",
//     background: "#f8fafc",
//     padding: "32px 20px",
//   },
//   container: {
//     maxWidth: "1600px",
//     margin: "0 auto",
//   },
//   headerCard: {
//     background: "#ffffff",
//     borderRadius: "20px",
//     padding: "28px 32px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     gap: "20px",
//     border: "1px solid #e5e7eb",
//     marginBottom: "24px",
//     flexWrap: "wrap",
//   },
//   overline: {
//     margin: 0,
//     fontSize: "12px",
//     fontWeight: 700,
//     letterSpacing: "0.08em",
//     textTransform: "uppercase",
//     color: "#667085",
//   },
//   heading: {
//     margin: "8px 0 10px",
//     fontSize: "32px",
//     fontWeight: 800,
//     color: "#101828",
//   },
//   subtext: {
//     margin: 0,
//     fontSize: "15px",
//     color: "#667085",
//   },
//   primaryButton: {
//     background: "#111827",
//     color: "#fff",
//     border: "none",
//     borderRadius: "12px",
//     padding: "14px 18px",
//     fontSize: "14px",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   tableCard: {
//     background: "#ffffff",
//     borderRadius: "20px",
//     border: "1px solid #e5e7eb",
//     overflow: "hidden",
//   },
//   tableHeader: {
//     padding: "24px",
//     borderBottom: "1px solid #eaecf0",
//   },
//   tableTitle: {
//     margin: 0,
//     fontSize: "20px",
//     fontWeight: 800,
//     color: "#101828",
//   },
//   tableSubtitle: {
//     margin: "6px 0 0",
//     fontSize: "14px",
//     color: "#667085",
//   },
//   tableWrapper: {
//     width: "100%",
//     overflowX: "auto",
//   },
//   table: {
//     width: "100%",
//     minWidth: "3350px",
//     borderCollapse: "separate",
//     borderSpacing: 0,
//   },
//   th: {
//     textAlign: "left",
//     padding: "14px 16px",
//     background: "#f9fafb",
//     color: "#475467",
//     fontSize: "13px",
//     fontWeight: 800,
//     borderBottom: "1px solid #eaecf0",
//     whiteSpace: "nowrap",
//   },
//   tr: {
//     background: "#ffffff",
//   },
//   td: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "top",
//     fontSize: "14px",
//     color: "#101828",
//     whiteSpace: "nowrap",
//   },
//   tdWide: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "top",
//     fontSize: "13px",
//     color: "#344054",
//     width: "240px",
//     minWidth: "240px",
//     lineHeight: 1.5,
//     whiteSpace: "normal",
//   },
//   tdJson: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "top",
//     width: "320px",
//     minWidth: "320px",
//   },
//   tdBanner: {
//     padding: "14px 16px",
//     borderBottom: "1px solid #f2f4f7",
//     verticalAlign: "top",
//     width: "360px",
//     minWidth: "360px",
//   },
//   bannerPreviewWrap: {
//     display: "flex",
//     gap: "10px",
//     flexWrap: "wrap",
//     alignItems: "flex-start",
//   },
//   bannerItem: {
//     width: "150px",
//   },
//   bannerImage: {
//     width: "150px",
//     height: "78px",
//     objectFit: "cover",
//     borderRadius: "10px",
//     border: "1px solid #e5e7eb",
//     background: "#ffffff",
//     display: "block",
//   },
//   noBannerImage: {
//     width: "150px",
//     height: "78px",
//     borderRadius: "10px",
//     border: "1px dashed #d0d5dd",
//     background: "#f9fafb",
//     color: "#98a2b3",
//     fontSize: "11px",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   bannerTitle: {
//     marginTop: "6px",
//     fontSize: "12px",
//     fontWeight: 700,
//     color: "#344054",
//     lineHeight: 1.35,
//     maxWidth: "150px",
//   },
//   moreBannerText: {
//     fontSize: "12px",
//     color: "#667085",
//     fontWeight: 700,
//     paddingTop: "28px",
//   },
//   orderBadge: {
//     display: "inline-block",
//     background: "#111827",
//     color: "#ffffff",
//     borderRadius: "999px",
//     padding: "6px 10px",
//     fontSize: "12px",
//     fontWeight: 800,
//     minWidth: "36px",
//     textAlign: "center",
//   },
//   idBadge: {
//     display: "inline-block",
//     background: "#f2f4f7",
//     color: "#344054",
//     borderRadius: "999px",
//     padding: "6px 10px",
//     fontSize: "12px",
//     fontWeight: 700,
//   },
//   productImage: {
//     width: "64px",
//     height: "64px",
//     objectFit: "cover",
//     borderRadius: "12px",
//     border: "1px solid #e5e7eb",
//     background: "#fff",
//   },
//   noImage: {
//     width: "64px",
//     height: "64px",
//     borderRadius: "12px",
//     border: "1px dashed #d0d5dd",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: "11px",
//     color: "#98a2b3",
//     background: "#f9fafb",
//   },
//   productTitle: {
//     fontSize: "14px",
//     fontWeight: 800,
//     color: "#101828",
//     lineHeight: 1.5,
//     maxWidth: "280px",
//     whiteSpace: "normal",
//   },
//   productCategory: {
//     marginTop: "4px",
//     fontSize: "12px",
//     color: "#667085",
//   },
//   priceWrap: {
//     display: "grid",
//     gap: "4px",
//   },
//   priceText: {
//     fontWeight: 800,
//     color: "#111827",
//   },
//   discountText: {
//     color: "#cc0c39",
//     fontSize: "13px",
//     fontWeight: 800,
//   },
//   mrpText: {
//     color: "#667085",
//     fontSize: "12px",
//     textDecoration: "line-through",
//   },
//   stockBadge: {
//     display: "inline-block",
//     minWidth: "42px",
//     textAlign: "center",
//     padding: "6px 10px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 700,
//     background: "#ecfdf3",
//     color: "#027a48",
//   },
//   jsonPreview: {
//     margin: 0,
//     maxHeight: "150px",
//     overflow: "auto",
//     whiteSpace: "pre-wrap",
//     wordBreak: "break-word",
//     background: "#f8fafc",
//     border: "1px solid #e5e7eb",
//     borderRadius: "10px",
//     padding: "10px",
//     color: "#344054",
//     fontSize: "12px",
//     lineHeight: 1.5,
//     fontFamily:
//       "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
//   },
//   emptyTextSmall: {
//     color: "#98a2b3",
//     fontSize: "13px",
//   },
//   link: {
//     color: "#2563eb",
//     fontWeight: 700,
//     textDecoration: "underline",
//   },
//   statusBadge: {
//     display: "inline-block",
//     padding: "6px 12px",
//     borderRadius: "999px",
//     fontSize: "12px",
//     fontWeight: 800,
//   },
//   actionGroup: {
//     display: "flex",
//     gap: "8px",
//     flexWrap: "wrap",
//   },
//   editButton: {
//     background: "#ffffff",
//     color: "#344054",
//     border: "1px solid #d0d5dd",
//     borderRadius: "10px",
//     padding: "10px 14px",
//     fontSize: "13px",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   archiveButton: {
//     background: "#fff7ed",
//     color: "#b54708",
//     border: "1px solid #fed7aa",
//     borderRadius: "10px",
//     padding: "10px 14px",
//     fontSize: "13px",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   loadingBox: {
//     padding: "60px 20px",
//     textAlign: "center",
//     color: "#667085",
//   },
//   emptyBox: {
//     padding: "70px 20px",
//     textAlign: "center",
//     color: "#667085",
//   },
// };
























































"use client";

import { useEffect, useMemo } from "react";
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
  console.log("ADMIN PRODUCTS =", products);

  const loading = useSelector((state) => state.adminProducts.loading);

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const hasValue = (value) =>
    value !== null && value !== undefined && String(value).trim() !== "";

  const getDisplayOrder = (product) => {
    const value =
      product?.displayOrder ??
      product?.display_order ??
      product?.displayorder ??
      null;

    if (!hasValue(value)) return null;

    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const orderA = getDisplayOrder(a);
      const orderB = getDisplayOrder(b);

      const safeOrderA = orderA === null ? 999999 : orderA;
      const safeOrderB = orderB === null ? 999999 : orderB;

      if (safeOrderA !== safeOrderB) {
        return safeOrderA - safeOrderB;
      }

      return Number(a.id || 0) - Number(b.id || 0);
    });
  }, [products]);

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

  const shortText = (value, limit = 120) => {
    if (!hasValue(value)) return "—";
    const text = String(value);
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  };

  const getCategoryName = (category) => {
    if (!category) return "No category";
    if (typeof category === "object") return category?.name || "No category";
    return category;
  };

  const getImageSrc = (image) => {
    if (!image) return "";

    const img =
      typeof image === "string"
        ? image
        : image?.imageUrl ||
          image?.url ||
          image?.mediaUrl ||
          image?.videoUrl ||
          "";

    if (!img) return "";

    if (img.startsWith("http")) return img;

    const base =
      process.env.NEXT_PUBLIC_API_BASE ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "";

    return `${base}${img}`;
  };

  const parseJsonArray = (value) => {
    if (!hasValue(value)) return [];

    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const renderBannerPreview = (value) => {
    const banners = parseJsonArray(value);

    if (banners.length === 0) {
      return <span style={styles.emptyTextSmall}>—</span>;
    }

    return (
      <div style={styles.bannerPreviewWrap}>
        {banners.slice(0, 4).map((banner, index) => {
          const img = getImageSrc(
            banner.imageUrl || banner.url || banner.mediaUrl
          );

          return (
            <div key={`${img}-${index}`} style={styles.bannerItem}>
              {img ? (
                <img
                  src={img}
                  alt={banner.title || "PDP Banner"}
                  style={styles.bannerImage}
                />
              ) : (
                <div style={styles.noBannerImage}>No Image</div>
              )}

              <div style={styles.bannerTitle}>
                {banner.title || `Banner ${index + 1}`}
              </div>
            </div>
          );
        })}

        {banners.length > 4 && (
          <div style={styles.moreBannerText}>+{banners.length - 4} more</div>
        )}
      </div>
    );
  };

  const renderJsonPreview = (value) => {
    if (!hasValue(value)) return <span style={styles.emptyTextSmall}>—</span>;

    return (
      <pre style={styles.jsonPreview}>
        {String(value).length > 280
          ? `${String(value).slice(0, 280)}...`
          : String(value)}
      </pre>
    );
  };

  const renderPriceBlock = (product) => {
    const sellingPrice = Number(product.priceInr || 0);
    const mrp = Number(product.mrpInr || 0);
    const discountPercent = Number(product.discountPercent || 0);

    return (
      <div style={styles.priceWrap}>
        <span style={styles.priceText}>
          ₹{sellingPrice.toLocaleString("en-IN")}
        </span>

        {discountPercent > 0 && mrp > sellingPrice && (
          <>
            <span style={styles.discountText}>-{discountPercent}%</span>
            <span style={styles.mrpText}>
              MRP ₹{mrp.toLocaleString("en-IN")}
            </span>
          </>
        )}
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
              View all products with complete advanced PDP content.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/products/create")}
            style={styles.primaryButton}
          >
            + Create Product
          </button>
        </div>

        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>All Products With PDP Details</h2>
            <p style={styles.tableSubtitle}>
              Products are arranged by display_order first, then product ID.
            </p>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>Loading products...</div>
          ) : sortedProducts.length === 0 ? (
            <div style={styles.emptyBox}>No products found.</div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Display Order</th>
                    <th style={styles.th}>ID</th>
                    <th style={styles.th}>Image</th>
                    <th style={styles.th}>Title</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Short Highlights</th>
                    <th style={styles.th}>Specifications</th>
                    <th style={styles.th}>Feature Highlights</th>
                    <th style={styles.th}>PDP Banner Images</th>
                    <th style={styles.th}>PDP Banners JSON</th>
                    <th style={styles.th}>FAQ</th>
                    <th style={styles.th}>Warranty</th>
                    <th style={styles.th}>Box Contents</th>
                    <th style={styles.th}>Compatibility</th>
                    <th style={styles.th}>Demo Video</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {sortedProducts.map((p) => {
                    const firstImage = p.images?.[0];
                    const img = getImageSrc(firstImage);
                    const isArchived = p.deleted === true || p.active === false;
                    const displayOrder = getDisplayOrder(p);

                    return (
                      <tr key={p.id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.orderBadge}>
                            {displayOrder ?? "—"}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.idBadge}>#{p.id}</span>
                        </td>

                        <td style={styles.td}>
                          {img ? (
                            <img
                              src={img}
                              alt={p.title}
                              style={styles.productImage}
                            />
                          ) : (
                            <div style={styles.noImage}>No Image</div>
                          )}
                        </td>

                        <td style={styles.td}>
                          <div style={styles.productTitle}>{p.title}</div>
                          <div style={styles.productCategory}>
                            {getCategoryName(p.category)}
                          </div>
                        </td>

                        <td style={styles.td}>{renderPriceBlock(p)}</td>

                        <td style={styles.td}>
                          <span style={styles.stockBadge}>{p.stock}</span>
                        </td>

                        <td style={styles.tdWide}>
                          {shortText(p.shortHighlights)}
                        </td>

                        <td style={styles.tdJson}>
                          {renderJsonPreview(p.specificationsJson)}
                        </td>

                        <td style={styles.tdJson}>
                          {renderJsonPreview(p.featureHighlightsJson)}
                        </td>

                        <td style={styles.tdBanner}>
                          {renderBannerPreview(p.pdpBannersJson)}
                        </td>

                        <td style={styles.tdJson}>
                          {renderJsonPreview(p.pdpBannersJson)}
                        </td>

                        <td style={styles.tdJson}>
                          {renderJsonPreview(p.faqJson)}
                        </td>

                        <td style={styles.tdWide}>
                          {shortText(p.warrantyInfo)}
                        </td>

                        <td style={styles.tdJson}>
                          {renderJsonPreview(p.boxContentsJson)}
                        </td>

                        <td style={styles.tdWide}>
                          {shortText(p.compatibility)}
                        </td>

                        <td style={styles.tdWide}>
                          {hasValue(p.demoVideoUrl) ? (
                            <a
                              href={p.demoVideoUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={styles.link}
                            >
                              Open Video
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>

                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              background: isArchived ? "#f2f4f7" : "#ecfdf3",
                              color: isArchived ? "#475467" : "#027a48",
                            }}
                          >
                            {isArchived ? "Archived" : "Active"}
                          </span>
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
    background: "#f8fafc",
    padding: "32px 20px",
  },
  container: {
    maxWidth: "1600px",
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
    fontWeight: 800,
    color: "#101828",
  },
  subtext: {
    margin: 0,
    fontSize: "15px",
    color: "#667085",
  },
  primaryButton: {
    background: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "14px 18px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  tableCard: {
    background: "#ffffff",
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  tableHeader: {
    padding: "24px",
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
    minWidth: "3350px",
    borderCollapse: "separate",
    borderSpacing: 0,
  },
  th: {
    textAlign: "left",
    padding: "14px 16px",
    background: "#f9fafb",
    color: "#475467",
    fontSize: "13px",
    fontWeight: 800,
    borderBottom: "1px solid #eaecf0",
    whiteSpace: "nowrap",
  },
  tr: {
    background: "#ffffff",
  },
  td: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    verticalAlign: "top",
    fontSize: "14px",
    color: "#101828",
    whiteSpace: "nowrap",
  },
  tdWide: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    verticalAlign: "top",
    fontSize: "13px",
    color: "#344054",
    width: "240px",
    minWidth: "240px",
    lineHeight: 1.5,
    whiteSpace: "normal",
  },
  tdJson: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    verticalAlign: "top",
    width: "320px",
    minWidth: "320px",
  },
  tdBanner: {
    padding: "14px 16px",
    borderBottom: "1px solid #f2f4f7",
    verticalAlign: "top",
    width: "360px",
    minWidth: "360px",
  },
  bannerPreviewWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  bannerItem: {
    width: "150px",
  },
  bannerImage: {
    width: "150px",
    height: "78px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    display: "block",
  },
  noBannerImage: {
    width: "150px",
    height: "78px",
    borderRadius: "10px",
    border: "1px dashed #d0d5dd",
    background: "#f9fafb",
    color: "#98a2b3",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    marginTop: "6px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#344054",
    lineHeight: 1.35,
    maxWidth: "150px",
  },
  moreBannerText: {
    fontSize: "12px",
    color: "#667085",
    fontWeight: 700,
    paddingTop: "28px",
  },
  orderBadge: {
    display: "inline-block",
    background: "#111827",
    color: "#ffffff",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "12px",
    fontWeight: 800,
    minWidth: "36px",
    textAlign: "center",
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
    fontWeight: 800,
    color: "#101828",
    lineHeight: 1.5,
    maxWidth: "280px",
    whiteSpace: "normal",
  },
  productCategory: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#667085",
  },
  priceWrap: {
    display: "grid",
    gap: "4px",
  },
  priceText: {
    fontWeight: 800,
    color: "#111827",
  },
  discountText: {
    color: "#cc0c39",
    fontSize: "13px",
    fontWeight: 800,
  },
  mrpText: {
    color: "#667085",
    fontSize: "12px",
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
    background: "#ecfdf3",
    color: "#027a48",
  },
  jsonPreview: {
    margin: 0,
    maxHeight: "150px",
    overflow: "auto",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    background: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "10px",
    color: "#344054",
    fontSize: "12px",
    lineHeight: 1.5,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
  emptyTextSmall: {
    color: "#98a2b3",
    fontSize: "13px",
  },
  link: {
    color: "#2563eb",
    fontWeight: 700,
    textDecoration: "underline",
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
    color: "#667085",
  },
  emptyBox: {
    padding: "70px 20px",
    textAlign: "center",
    color: "#667085",
  },
};