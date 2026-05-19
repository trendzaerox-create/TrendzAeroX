
// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";

// import { fetchProduct } from "@/features/products/productSlice";
// import { addToCart } from "@/features/cart/cartSlice";

// function getImageUrl(imageUrl) {
//   if (!imageUrl) return "/placeholder.png";
//   if (imageUrl.startsWith("http")) return imageUrl;

//   const base = (
//     process.env.NEXT_PUBLIC_API_BASE ||
//     process.env.NEXT_PUBLIC_API_BASE_URL ||
//     process.env.NEXT_PUBLIC_API_URL ||
//     ""
//   ).replace(/\/$/, "");

//   const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
//   return base ? `${base}${path}` : path;
// }

// function getCleanUrl(url = "") {
//   return String(url).split("?")[0].split("#")[0].toLowerCase();
// }

// function isVideoUrl(url) {
//   return /\.(mp4|webm|ogg|mov|m4v)$/i.test(getCleanUrl(url));
// }

// function isImageUrl(url) {
//   return /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(getCleanUrl(url));
// }

// function getMediaType(url) {
//   if (isVideoUrl(url)) return "video";
//   if (isImageUrl(url)) return "image";
//   return "image";
// }

// const MIN_ZOOM = 1;
// const MAX_ZOOM = 3.4;
// const TAP_ZOOM_STEP = 0.45;

// function clampValue(value, min, max) {
//   return Math.min(Math.max(value, min), max);
// }

// function getTouchDistance(touch1, touch2) {
//   const dx = touch1.clientX - touch2.clientX;
//   const dy = touch1.clientY - touch2.clientY;
//   return Math.sqrt(dx * dx + dy * dy);
// }

// export default function ProductPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const params = useParams();

//   const id = params?.id;
//   const product = useSelector((state) => state.products.product);

//   const [selectedMedia, setSelectedMedia] = useState("");
//   const [zoomScale, setZoomScale] = useState(1);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

//   const zoomStageRef = useRef(null);
//   const videoRef = useRef(null);

//   const isZoomed = zoomScale > 1.01;

//   const dragDataRef = useRef({
//     isDragging: false,
//     startX: 0,
//     startY: 0,
//     startPosX: 0,
//     startPosY: 0,
//     moved: false,
//   });

//   const swipeDataRef = useRef({
//     startX: 0,
//     startY: 0,
//     endX: 0,
//     endY: 0,
//     isSwiping: false,
//     moved: false,
//   });

//   const touchZoomRef = useRef({
//     mode: "none",
//     startDistance: 0,
//     startScale: 1,
//     startX: 0,
//     startY: 0,
//     startPosX: 0,
//     startPosY: 0,
//     moved: false,
//   });

//   useEffect(() => {
//     if (!id) return;
//     dispatch(fetchProduct(id));
//   }, [id, dispatch]);

//   const galleryMedia = useMemo(() => {
//     if (!product?.images?.length) return [];

//     return product.images
//       .map((item) => {
//         const rawUrl =
//           typeof item === "string"
//             ? item
//             : item?.imageUrl || item?.url || item?.mediaUrl || item?.videoUrl;

//         if (!rawUrl) return null;

//         const url = getImageUrl(rawUrl);
//         const type =
//           typeof item === "object" && item?.mediaType
//             ? String(item.mediaType).toLowerCase().includes("video")
//               ? "video"
//               : "image"
//             : getMediaType(url);

//         return {
//           url,
//           type,
//           alt: item?.alt || product?.title || "Product media",
//         };
//       })
//       .filter(Boolean);
//   }, [product]);

//   useEffect(() => {
//     if (!galleryMedia.length) {
//       setSelectedMedia("");
//       return;
//     }

//     setSelectedMedia((prev) =>
//       galleryMedia.some((media) => media.url === prev)
//         ? prev
//         : galleryMedia[0].url,
//     );
//   }, [galleryMedia]);

//   const activeMedia = galleryMedia.find(
//     (media) => media.url === selectedMedia,
//   ) ||
//     galleryMedia[0] || {
//       url: "/placeholder.png",
//       type: "image",
//       alt: product?.title || "Product image",
//     };

//   const activeMediaIndex = Math.max(
//     0,
//     galleryMedia.findIndex((media) => media.url === activeMedia.url),
//   );

//   const isActiveVideo = activeMedia.type === "video";

//   const clampZoomPosition = (x, y, scale = zoomScale) => {
//     const stage = zoomStageRef.current;

//     if (!stage || scale <= 1.01 || isActiveVideo) {
//       return { x: 0, y: 0 };
//     }

//     const rect = stage.getBoundingClientRect();
//     const maxX = (rect.width * (scale - 1)) / 2;
//     const maxY = (rect.height * (scale - 1)) / 2;

//     return {
//       x: clampValue(x, -maxX, maxX),
//       y: clampValue(y, -maxY, maxY),
//     };
//   };

//   const resetZoom = () => {
//     setZoomScale(1);
//     setZoomPosition({ x: 0, y: 0 });

//     dragDataRef.current = {
//       isDragging: false,
//       startX: 0,
//       startY: 0,
//       startPosX: 0,
//       startPosY: 0,
//       moved: false,
//     };

//     touchZoomRef.current = {
//       mode: "none",
//       startDistance: 0,
//       startScale: 1,
//       startX: 0,
//       startY: 0,
//       startPosX: 0,
//       startPosY: 0,
//       moved: false,
//     };
//   };

//   const setSmoothZoom = (nextScale) => {
//     if (isActiveVideo) return;

//     const cleanScale = clampValue(nextScale, MIN_ZOOM, MAX_ZOOM);

//     if (cleanScale <= 1.01) {
//       setZoomScale(1);
//       setZoomPosition({ x: 0, y: 0 });
//       return;
//     }

//     setZoomScale(cleanScale);
//     setZoomPosition((prev) => clampZoomPosition(prev.x, prev.y, cleanScale));
//   };

//   const goToPreviousImage = () => {
//     if (galleryMedia.length <= 1) return;

//     resetZoom();

//     const previousIndex =
//       activeMediaIndex <= 0 ? galleryMedia.length - 1 : activeMediaIndex - 1;

//     setSelectedMedia(galleryMedia[previousIndex].url);
//   };

//   const goToNextImage = () => {
//     if (galleryMedia.length <= 1) return;

//     resetZoom();

//     const nextIndex =
//       activeMediaIndex >= galleryMedia.length - 1 ? 0 : activeMediaIndex + 1;

//     setSelectedMedia(galleryMedia[nextIndex].url);
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.key === "ArrowLeft") goToPreviousImage();
//       if (event.key === "ArrowRight") goToNextImage();
//       if (event.key === "Escape") resetZoom();
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [activeMediaIndex, galleryMedia]);

//   useEffect(() => {
//     resetZoom();

//     if (videoRef.current) {
//       videoRef.current.currentTime = 0;

//       if (isActiveVideo) {
//         videoRef.current.play().catch(() => {});
//       } else {
//         videoRef.current.pause();
//       }
//     }
//   }, [activeMedia.url, isActiveVideo]);

//   const handleAddToCart = async () => {
//     if (!product || product.stock <= 0) return;

//     try {
//       await dispatch(addToCart({ product, quantity: 1 })).unwrap();
//       router.push("/cart");
//     } catch (err) {
//       console.error("Add to cart failed:", err);
//       alert("Failed to add product to cart");
//     }
//   };

//   const handleBuyNow = async () => {
//     if (!product || product.stock <= 0) return;

//     try {
//       const result = await dispatch(
//         addToCart({ product, quantity: 1 }),
//       ).unwrap();

//       if (!result.cartId) {
//         router.push("/checkout?guest=true");
//       } else {
//         router.push("/checkout");
//       }
//     } catch (err) {
//       console.error("Buy now failed:", err);
//       alert("Failed to proceed to checkout");
//     }
//   };

//   const handleMainThumbClick = (media) => {
//     setSelectedMedia(media.url);
//     resetZoom();
//   };

//   const handleZoomToggle = () => {
//     if (isActiveVideo) return;

//     if (dragDataRef.current.moved || touchZoomRef.current.moved) {
//       dragDataRef.current.moved = false;
//       touchZoomRef.current.moved = false;
//       return;
//     }

//     if (zoomScale >= MAX_ZOOM - 0.05) {
//       resetZoom();
//       return;
//     }

//     setSmoothZoom(zoomScale <= 1.01 ? 1.65 : zoomScale + TAP_ZOOM_STEP);
//   };

//   const handleZoomStageMouseDown = (event) => {
//     if (isActiveVideo || !isZoomed || !zoomStageRef.current) return;

//     dragDataRef.current = {
//       isDragging: true,
//       startX: event.clientX,
//       startY: event.clientY,
//       startPosX: zoomPosition.x,
//       startPosY: zoomPosition.y,
//       moved: false,
//     };
//   };

//   const handleZoomStageMouseMove = (event) => {
//     if (isActiveVideo || !isZoomed || !dragDataRef.current.isDragging) return;

//     event.preventDefault();

//     const deltaX = event.clientX - dragDataRef.current.startX;
//     const deltaY = event.clientY - dragDataRef.current.startY;

//     if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
//       dragDataRef.current.moved = true;
//     }

//     const next = clampZoomPosition(
//       dragDataRef.current.startPosX + deltaX,
//       dragDataRef.current.startPosY + deltaY,
//       zoomScale,
//     );

//     setZoomPosition(next);
//   };

//   const handleZoomStageMouseUp = () => {
//     dragDataRef.current.isDragging = false;
//   };

//   const handleZoomStageMouseLeave = () => {
//     dragDataRef.current.isDragging = false;
//   };

//   const handleZoomStageTouchStart = (event) => {
//     if (isActiveVideo) return;

//     if (event.touches.length === 2) {
//       const distance = getTouchDistance(event.touches[0], event.touches[1]);

//       touchZoomRef.current = {
//         mode: "pinch",
//         startDistance: distance,
//         startScale: zoomScale,
//         startX: 0,
//         startY: 0,
//         startPosX: zoomPosition.x,
//         startPosY: zoomPosition.y,
//         moved: false,
//       };

//       return;
//     }

//     const touch = event.touches[0];
//     if (!touch) return;

//     if (!isZoomed) {
//       swipeDataRef.current = {
//         startX: touch.clientX,
//         startY: touch.clientY,
//         endX: touch.clientX,
//         endY: touch.clientY,
//         isSwiping: true,
//         moved: false,
//       };

//       touchZoomRef.current.mode = "swipe";
//       return;
//     }

//     touchZoomRef.current = {
//       mode: "drag",
//       startDistance: 0,
//       startScale: zoomScale,
//       startX: touch.clientX,
//       startY: touch.clientY,
//       startPosX: zoomPosition.x,
//       startPosY: zoomPosition.y,
//       moved: false,
//     };
//   };

//   const handleZoomStageTouchMove = (event) => {
//     if (isActiveVideo) return;

//     if (event.touches.length === 2 && touchZoomRef.current.mode === "pinch") {
//       event.preventDefault();

//       const distance = getTouchDistance(event.touches[0], event.touches[1]);

//       if (!touchZoomRef.current.startDistance) return;

//       const pinchRatio = distance / touchZoomRef.current.startDistance;
//       const nextScale = clampValue(
//         touchZoomRef.current.startScale * pinchRatio,
//         MIN_ZOOM,
//         MAX_ZOOM,
//       );

//       if (Math.abs(nextScale - touchZoomRef.current.startScale) > 0.03) {
//         touchZoomRef.current.moved = true;
//       }

//       if (nextScale <= 1.01) {
//         setZoomScale(1);
//         setZoomPosition({ x: 0, y: 0 });
//       } else {
//         setZoomScale(nextScale);
//         setZoomPosition((prev) => clampZoomPosition(prev.x, prev.y, nextScale));
//       }

//       return;
//     }

//     const touch = event.touches[0];
//     if (!touch) return;

//     if (!isZoomed) {
//       if (!swipeDataRef.current.isSwiping) return;

//       const deltaX = touch.clientX - swipeDataRef.current.startX;
//       const deltaY = touch.clientY - swipeDataRef.current.startY;

//       swipeDataRef.current.endX = touch.clientX;
//       swipeDataRef.current.endY = touch.clientY;

//       if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
//         swipeDataRef.current.moved = true;
//         touchZoomRef.current.moved = true;
//       }

//       if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
//         event.preventDefault();
//       }

//       return;
//     }

//     if (touchZoomRef.current.mode !== "drag") return;

//     event.preventDefault();

//     const deltaX = touch.clientX - touchZoomRef.current.startX;
//     const deltaY = touch.clientY - touchZoomRef.current.startY;

//     if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
//       touchZoomRef.current.moved = true;
//       dragDataRef.current.moved = true;
//     }

//     const next = clampZoomPosition(
//       touchZoomRef.current.startPosX + deltaX,
//       touchZoomRef.current.startPosY + deltaY,
//       zoomScale,
//     );

//     setZoomPosition(next);
//   };

//   const handleZoomStageTouchEnd = () => {
//     if (isActiveVideo) return;

//     if (!isZoomed && swipeDataRef.current.isSwiping) {
//       const deltaX = swipeDataRef.current.endX - swipeDataRef.current.startX;
//       const deltaY = swipeDataRef.current.endY - swipeDataRef.current.startY;

//       const isHorizontalSwipe =
//         Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY);

//       if (galleryMedia.length > 1 && isHorizontalSwipe) {
//         if (deltaX < 0) {
//           goToNextImage();
//         } else {
//           goToPreviousImage();
//         }

//         touchZoomRef.current.moved = true;
//       }

//       swipeDataRef.current = {
//         startX: 0,
//         startY: 0,
//         endX: 0,
//         endY: 0,
//         isSwiping: false,
//         moved: false,
//       };

//       touchZoomRef.current.mode = "none";
//       return;
//     }

//     dragDataRef.current.isDragging = false;
//     touchZoomRef.current.mode = "none";
//   };

//   const handleZoomStageClick = () => {
//     if (isActiveVideo) return;
//     handleZoomToggle();
//   };

//   if (!product) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           background: "#f6f7fb",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           fontSize: "18px",
//           color: "#444",
//           padding: "20px",
//           textAlign: "center",
//         }}
//       >
//         Loading product...
//       </div>
//     );
//   }

//   const reviewCount = product.reviews?.length || 0;

//   const averageRating =
//     reviewCount > 0
//       ? (
//           product.reviews.reduce((sum, review) => sum + review.rating, 0) /
//           reviewCount
//         ).toFixed(1)
//       : 0;

//   const roundedAverage =
//     reviewCount > 0 ? Math.round(Number(averageRating)) : 0;

//   const stockStatus =
//     product.stock > 0
//       ? product.stock > 10
//         ? "In Stock"
//         : `Only ${product.stock} left`
//       : "Out of Stock";

//   const showThumbRail = galleryMedia.length > 1;

//   const sellingPrice = Number(product.priceInr || 0);
//   const mrp = Number(product.mrpInr || 0);

//   const discountPercent =
//     mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
//       ? Math.round(((mrp - sellingPrice) / mrp) * 100)
//       : 0;

//   return (
//     <>
//       <div
//         style={{
//           background: "#f6f7fb",
//           minHeight: "100vh",
//           padding: "32px 20px 60px",
//         }}
//       >
//         <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
//           <div className="product-breadcrumb">
//             <span>Home</span>
//             <span>/</span>
//             <span>Products</span>
//             <span>/</span>
//             <span className="breadcrumb-current">{product.title}</span>
//           </div>

//           <div className="product-main-layout">
//             <div className="product-gallery-card">
//               <div
//                 className={`product-gallery-grid ${
//                   showThumbRail ? "has-thumbs" : "no-thumbs"
//                 }`}
//               >
//                 {showThumbRail && (
//                   <div className="thumbnail-rail">
//                     <div className="thumbnail-list">
//                       {galleryMedia.map((media, i) => {
//                         const isActive = activeMedia.url === media.url;

//                         return (
//                           <button
//                             key={`${media.url}-${i}`}
//                             type="button"
//                             onClick={() => handleMainThumbClick(media)}
//                             className={`thumbnail-btn ${
//                               isActive ? "active-thumb" : ""
//                             }`}
//                             aria-label={`View product media ${i + 1}`}
//                           >
//                             {media.type === "video" ? (
//                               <div className="thumbnail-video-wrap">
//                                 <video
//                                   src={media.url}
//                                   muted
//                                   playsInline
//                                   preload="metadata"
//                                   className="thumbnail-img"
//                                 />
//                                 <span className="thumb-play-icon">▶</span>
//                               </div>
//                             ) : (
//                               <img
//                                 src={media.url}
//                                 alt={`${product.title} thumbnail ${i + 1}`}
//                                 className="thumbnail-img"
//                                 loading="lazy"
//                               />
//                             )}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}

//                 <div className="main-image-column">
//                   <div className="main-image-wrapper">
//                     <div className="main-image-badges">
//                       <span className="badge-dark">PREMIUM</span>

//                       {galleryMedia.length > 1 && (
//                         <span className="badge-light">
//                           {activeMediaIndex + 1} / {galleryMedia.length}
//                         </span>
//                       )}

                     
//                     </div>

//                     {galleryMedia.length > 1 && !isZoomed && (
//                       <button
//                         type="button"
//                         className="main-arrow-btn main-arrow-left"
//                         onClick={goToPreviousImage}
//                         aria-label="Previous media"
//                       >
//                         ‹
//                       </button>
//                     )}

//                     <div
//                       ref={zoomStageRef}
//                       role={isActiveVideo ? "region" : "button"}
//                       tabIndex={isActiveVideo ? -1 : 0}
//                       className={`main-zoom-stage ${
//                         isZoomed ? "main-zoomed" : ""
//                       } ${isActiveVideo ? "video-stage" : ""}`}
//                       onClick={handleZoomStageClick}
//                       onMouseDown={handleZoomStageMouseDown}
//                       onMouseMove={handleZoomStageMouseMove}
//                       onMouseUp={handleZoomStageMouseUp}
//                       onMouseLeave={handleZoomStageMouseLeave}
//                       onTouchStart={handleZoomStageTouchStart}
//                       onTouchMove={handleZoomStageTouchMove}
//                       onTouchEnd={handleZoomStageTouchEnd}
//                       aria-label={
//                         isActiveVideo
//                           ? "Product video"
//                           : isZoomed
//                             ? "Drag or pinch to zoom product image"
//                             : "Tap to zoom product image"
//                       }
//                     >
//                       {isActiveVideo ? (
//                         <video
//                           ref={videoRef}
//                           src={activeMedia.url}
//                           controls
//                           autoPlay
//                           muted
//                           loop
//                           playsInline
//                           preload="metadata"
//                           controlsList="nodownload"
//                           className="main-product-video"
//                         >
//                           Your browser does not support product video.
//                         </video>
//                       ) : (
//                         <img
//                           src={activeMedia.url}
//                           alt={activeMedia.alt || product.title}
//                           className="main-product-image"
//                           draggable={false}
//                           style={{
//                             transform: `translate3d(${zoomPosition.x}px, ${zoomPosition.y}px, 0) scale(${zoomScale})`,
//                           }}
//                         />
//                       )}
//                     </div>

//                     {galleryMedia.length > 1 && !isZoomed && (
//                       <button
//                         type="button"
//                         className="main-arrow-btn main-arrow-right"
//                         onClick={goToNextImage}
//                         aria-label="Next media"
//                       >
//                         ›
//                       </button>
//                     )}

//                     {!isActiveVideo && (
//                       <div className="main-zoom-hint">
//                         {isZoomed
//                           ? "Drag to move • Pinch to zoom • Tap to zoom more"
//                           : "Tap to zoom • Swipe image"}
//                       </div>
//                     )}
//                   </div>

//                   {galleryMedia.length > 1 && !isActiveVideo && (
//                     <button
//                       type="button"
//                       className="full-view-trigger"
//                       onClick={handleZoomToggle}
//                       aria-label="Zoom product image"
//                     >
//                       {isZoomed
//                         ? "Tap / pinch to zoom more"
//                         : "Tap to see full view"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="product-info-card">
//               <div className="top-label">PREMIUM COLLECTION</div>

//               <h1 className="product-title">{product.title}</h1>

//               <div className="rating-row">
//                 <div className="stars">
//                   {"★".repeat(roundedAverage)}
//                   {"☆".repeat(5 - roundedAverage)}
//                 </div>

//                 <div className="rating-text">
//                   {reviewCount > 0
//                     ? `${averageRating} rating • ${reviewCount} review${
//                         reviewCount > 1 ? "s" : ""
//                       }`
//                     : "No ratings yet"}
//                 </div>
//               </div>

//               <div className="price-stock-row">
//                 <div className="price-block">
//                   <div className="price-display-row">
//                     {discountPercent > 0 && (
//                       <span className="discount-badge">
//                         -{discountPercent}%
//                       </span>
//                     )}

//                     <h2 className="price-text">
//                       ₹{sellingPrice.toLocaleString("en-IN")}
//                     </h2>
//                   </div>

//                   {mrp > 0 && (
//                     <div className="mrp-line">
//                       <span className="mrp-label">M.R.P.:</span>{" "}
//                       <span className="mrp-value">
//                         ₹{mrp.toLocaleString("en-IN")}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 <span
//                   className="stock-pill"
//                   style={{
//                     background: product.stock > 0 ? "#ecfdf5" : "#fef2f2",
//                     color: product.stock > 0 ? "#047857" : "#b91c1c",
//                   }}
//                 >
//                   {stockStatus}
//                 </span>
//               </div>

//               <div className="description-box">
//                 <p className="description-text">{product.description}</p>
//               </div>

//               <div className="action-buttons">
//                 <button
//                   onClick={handleAddToCart}
//                   disabled={product.stock <= 0}
//                   className="add-to-cart-btn"
//                   style={{
//                     background:
//                       product.stock > 0
//                         ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
//                         : "#9ca3af",
//                     cursor: product.stock > 0 ? "pointer" : "not-allowed",
//                     boxShadow:
//                       product.stock > 0
//                         ? "0 12px 24px rgba(17,24,39,0.18)"
//                         : "none",
//                   }}
//                 >
//                   {product.stock > 0 ? "Add To Cart" : "Out of Stock"}
//                 </button>

//                 <button
//                   onClick={handleBuyNow}
//                   disabled={product.stock <= 0}
//                   className="buy-now-btn"
//                 >
//                   Buy Now
//                 </button>
//               </div>

//               <div className="trust-grid">
//                 <div className="trust-box">
//                   Secure checkout and trusted shopping experience
//                 </div>
//                 <div className="trust-box">
//                   Premium quality product with customer satisfaction focus
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="reviews-card">
//             <div className="reviews-head">
//               <h2 className="reviews-title">Customer Reviews</h2>

//               {reviewCount > 0 && (
//                 <div className="reviews-summary">
//                   <span className="summary-stars">
//                     {"★".repeat(roundedAverage)}
//                     {"☆".repeat(5 - roundedAverage)}
//                   </span>
//                   <span className="summary-text">
//                     {averageRating} / 5 from {reviewCount} review
//                     {reviewCount > 1 ? "s" : ""}
//                   </span>
//                 </div>
//               )}
//             </div>

//             {!product.reviews || product.reviews.length === 0 ? (
//               <div className="no-reviews-box">No reviews yet.</div>
//             ) : (
//               <div className="reviews-list">
//                 {product.reviews.map((review) => (
//                   <div key={review.id} className="review-card">
//                     <div className="review-top">
//                       <div>
//                         <div className="reviewer-name">
//                           {review.reviewerName}
//                         </div>
//                         <div className="review-subtext">
//                           Verified customer review
//                         </div>
//                       </div>

//                       <div className="review-stars">
//                         {"★".repeat(review.rating)}
//                         {"☆".repeat(5 - review.rating)}
//                       </div>
//                     </div>

//                     {review.featured && (
//                       <div className="featured-review-badge">
//                         Featured Review
//                       </div>
//                     )}

//                     <p className="review-text">{review.reviewText}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .product-breadcrumb {
//           font-size: 14px;
//           color: #6b7280;
//           margin-bottom: 18px;
//           display: flex;
//           gap: 8px;
//           flex-wrap: wrap;
//         }

//         .breadcrumb-current {
//           color: #111827;
//           font-weight: 700;
//           word-break: break-word;
//         }

//         .product-main-layout {
//           display: grid;
//           grid-template-columns: minmax(0, 1.2fr) minmax(360px, 440px);
//           gap: 32px;
//           align-items: start;
//         }

//         .product-gallery-card {
//           background: #fff;
//           border-radius: 20px;
//           padding: 24px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
//           border: 1px solid #ececec;
//           min-width: 0;
//           overflow: visible;
//         }

//         .product-gallery-grid {
//           display: grid;
//           gap: 18px;
//           align-items: start;
//           min-width: 0;
//         }

//         .product-gallery-grid.has-thumbs {
//           grid-template-columns: 92px minmax(0, 1fr);
//         }

//         .product-gallery-grid.no-thumbs {
//           grid-template-columns: 1fr;
//         }

//         .thumbnail-rail {
//           min-width: 0;
//           overflow: hidden;
//         }

//         .thumbnail-list {
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//           max-width: 100%;
//           max-height: 680px;
//           overflow-y: auto;
//           padding-right: 2px;
//           scrollbar-width: thin;
//         }

//         .thumbnail-btn {
//           width: 100%;
//           border: 1px solid #dbe1ea;
//           background: #fff;
//           border-radius: 14px;
//           overflow: hidden;
//           padding: 6px;
//           cursor: pointer;
//           transition: all 0.25s ease;
//           flex: 0 0 auto;
//           position: relative;
//         }

//         .thumbnail-btn:hover {
//           border-color: #94a3b8;
//           transform: translateY(-1px);
//         }

//         .thumbnail-btn.active-thumb {
//           border: 2px solid #111827;
//           box-shadow: 0 6px 18px rgba(17, 24, 39, 0.12);
//         }

//         .thumbnail-video-wrap {
//           position: relative;
//           width: 100%;
//           height: 88px;
//           border-radius: 10px;
//           overflow: hidden;
//           background: #000;
//         }

//         .thumbnail-img {
//           width: 100%;
//           height: 88px;
//           object-fit: contain;
//           border-radius: 10px;
//           display: block;
//           background: #fff;
//         }

//         .thumbnail-video-wrap .thumbnail-img {
//           background: #000;
//         }

//         .thumb-play-icon {
//           position: absolute;
//           left: 50%;
//           top: 50%;
//           transform: translate(-50%, -50%);
//           width: 30px;
//           height: 30px;
//           border-radius: 999px;
//           background: rgba(17, 24, 39, 0.85);
//           color: #fff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 12px;
//           padding-left: 2px;
//           box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
//           pointer-events: none;
//         }

//         .main-image-column {
//           min-width: 0;
//           display: flex;
//           flex-direction: column;
//         }

//         .main-image-wrapper {
//           position: relative;
//           background: #fff;
//           border: 1px solid #e5e7eb;
//           border-radius: 18px;
//           overflow: hidden;
//           padding: 14px;
//         }

//         .main-image-badges {
//           position: absolute;
//           top: 22px;
//           left: 22px;
//           z-index: 5;
//           display: flex;
//           gap: 10px;
//           flex-wrap: wrap;
//           pointer-events: none;
//         }

//         .badge-dark {
//           background: #111827;
//           color: #fff;
//           padding: 7px 12px;
//           border-radius: 999px;
//           font-size: 11px;
//           font-weight: 800;
//           letter-spacing: 0.5px;
//         }

//         .badge-light {
//           background: #ffffff;
//           color: #111827;
//           padding: 7px 12px;
//           border-radius: 999px;
//           font-size: 11px;
//           font-weight: 800;
//           border: 1px solid #e5e7eb;
//         }

//         .main-zoom-stage {
//           width: 100%;
//           aspect-ratio: 1 / 1;
//           max-height: 680px;
//           border: none;
//           background: #fff;
//           padding: 0;
//           margin: 0;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: zoom-in;
//           overflow: hidden;
//           border-radius: 14px;
//           outline: none;
//           overscroll-behavior: contain;
//           touch-action: pan-y;
//           user-select: none;
//         }

//         .main-zoom-stage.video-stage {
//           cursor: default;
//           background: #000;
//           touch-action: auto;
//         }

//         .main-zoom-stage.main-zoomed {
//           cursor: grab;
//           touch-action: none;
//         }

//         .main-zoom-stage.main-zoomed:active {
//           cursor: grabbing;
//         }

//         .main-product-image {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           padding: 30px;
//           border-radius: 14px;
//           display: block;
//           background: #fff;
//           transition: transform 0.18s ease-out;
//           transform-origin: center center;
//           user-select: none;
//           -webkit-user-drag: none;
//           pointer-events: none;
//           will-change: transform;
//         }

//         .main-product-video {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           display: block;
//           background: #000;
//           border-radius: 14px;
//           outline: none;
//         }

//         .main-zoomed .main-product-image {
//           transition: transform 0.06s linear;
//         }

//         .main-arrow-btn {
//           position: absolute;
//           top: 50%;
//           transform: translateY(-50%);
//           width: 46px;
//           height: 46px;
//           border-radius: 999px;
//           border: 1px solid #e5e7eb;
//           background: rgba(255, 255, 255, 0.94);
//           color: #111827;
//           font-size: 38px;
//           line-height: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           cursor: pointer;
//           z-index: 6;
//           box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
//           transition: all 0.2s ease;
//         }

//         .main-arrow-btn:hover {
//           background: #111827;
//           color: #fff;
//           border-color: #111827;
//         }

//         .main-arrow-left {
//           left: 18px;
//         }

//         .main-arrow-right {
//           right: 18px;
//         }

//         .main-zoom-hint {
//           position: absolute;
//           right: 18px;
//           bottom: 18px;
//           z-index: 6;
//           background: rgba(255, 255, 255, 0.92);
//           color: #111827;
//           padding: 6px 10px;
//           border-radius: 999px;
//           border: 1px solid #e5e7eb;
//           font-size: 12px;
//           font-weight: 700;
//           pointer-events: none;
//         }

//         .full-view-trigger {
//           align-self: center;
//           margin-top: 12px;
//           border: none;
//           background: transparent;
//           color: #2563eb;
//           font-size: 14px;
//           font-weight: 500;
//           line-height: 1.2;
//           text-align: center;
//           cursor: pointer;
//           padding: 0;
//           transition: color 0.2s ease;
//         }

//         .full-view-trigger:hover {
//           color: #1d4ed8;
//           text-decoration: underline;
//         }

//         .product-info-card {
//           background: #fff;
//           border-radius: 20px;
//           padding: 30px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
//           border: 1px solid #ececec;
//           position: sticky;
//           top: 20px;
//           min-width: 0;
//         }

//         .top-label {
//           display: inline-block;
//           background: #111827;
//           color: #fff;
//           padding: 6px 12px;
//           border-radius: 999px;
//           font-size: 12px;
//           font-weight: 700;
//           letter-spacing: 0.4px;
//           margin-bottom: 16px;
//         }

//         .product-title {
//           font-size: 34px;
//           line-height: 1.25;
//           margin: 0 0 14px;
//           color: #111827;
//           font-weight: 800;
//           word-break: break-word;
//           overflow-wrap: anywhere;
//         }

//         .rating-row {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           flex-wrap: wrap;
//           margin-bottom: 20px;
//         }

//         .stars {
//           color: #f59e0b;
//           font-weight: 700;
//           font-size: 20px;
//           letter-spacing: 1px;
//         }

//         .rating-text {
//           color: #374151;
//           font-size: 15px;
//           font-weight: 600;
//         }

//         .price-stock-row {
//           margin-bottom: 22px;
//           display: flex;
//           align-items: flex-start;
//           justify-content: space-between;
//           gap: 14px;
//           flex-wrap: wrap;
//         }

//         .price-block {
//           display: flex;
//           flex-direction: column;
//           gap: 4px;
//           min-width: 0;
//         }

//         .price-display-row {
//           display: flex;
//           align-items: baseline;
//           gap: 10px;
//           flex-wrap: wrap;
//         }

//         .discount-badge {
//           color: #cc0c39;
//           font-size: 32px;
//           font-weight: 500;
//           line-height: 1;
//           letter-spacing: -0.02em;
//         }

//         .price-text {
//           color: #111111;
//           font-size: 48px;
//           font-weight: 500;
//           line-height: 1;
//           margin: 0;
//           letter-spacing: -0.03em;
//         }

//         .mrp-line {
//           color: #6b7280;
//           font-size: 18px;
//           font-weight: 500;
//           line-height: 1.3;
//           margin-top: 4px;
//         }

//         .mrp-value {
//           text-decoration: line-through;
//           color: #6b7280;
//         }

//         .stock-pill {
//           padding: 6px 12px;
//           border-radius: 999px;
//           font-size: 13px;
//           font-weight: 700;
//         }

//         .description-box {
//           border-top: 1px solid #f0f0f0;
//           border-bottom: 1px solid #f0f0f0;
//           padding: 18px 0;
//           margin-bottom: 22px;
//         }

//         .description-text {
//           margin: 0;
//           color: #4b5563;
//           font-size: 16px;
//           line-height: 1.8;
//           word-break: break-word;
//           overflow-wrap: anywhere;
//         }

//         .action-buttons {
//           display: grid;
//           gap: 12px;
//         }

//         .add-to-cart-btn,
//         .buy-now-btn {
//           width: 100%;
//           padding: 16px 24px;
//           border-radius: 14px;
//           font-weight: 800;
//           font-size: 16px;
//           transition: 0.3s ease;
//         }

//         .add-to-cart-btn {
//           color: #fff;
//           border: none;
//         }

//         .buy-now-btn {
//           background: #fff;
//           color: #111827;
//           border: 1.5px solid #111827;
//           cursor: pointer;
//         }

//         .buy-now-btn:hover {
//           background: #111827;
//           color: #fff;
//           box-shadow: 0 12px 24px rgba(17, 24, 39, 0.12);
//         }

//         .buy-now-btn:disabled {
//           background: #f3f4f6;
//           color: #9ca3af;
//           border-color: #d1d5db;
//           cursor: not-allowed;
//           box-shadow: none;
//         }

//         .trust-grid {
//           margin-top: 18px;
//           display: grid;
//           gap: 10px;
//         }

//         .trust-box {
//           background: #f9fafb;
//           border-radius: 12px;
//           padding: 12px 14px;
//           color: #374151;
//           font-size: 14px;
//           border: 1px solid #eceff3;
//         }

//         .reviews-card {
//           margin-top: 42px;
//           background: #fff;
//           border-radius: 18px;
//           padding: 30px;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
//           border: 1px solid #ececec;
//         }

//         .reviews-head {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           flex-wrap: wrap;
//           gap: 12px;
//           margin-bottom: 24px;
//         }

//         .reviews-title {
//           margin: 0;
//           font-size: 28px;
//           color: #111827;
//           font-weight: 800;
//         }

//         .reviews-summary {
//           background: #f9fafb;
//           border: 1px solid #e5e7eb;
//           border-radius: 12px;
//           padding: 10px 14px;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           flex-wrap: wrap;
//         }

//         .summary-stars {
//           color: #f59e0b;
//           font-size: 18px;
//           font-weight: 700;
//         }

//         .summary-text {
//           color: #374151;
//           font-size: 14px;
//           font-weight: 600;
//         }

//         .no-reviews-box {
//           text-align: center;
//           padding: 32px 20px;
//           background: #f9fafb;
//           border-radius: 14px;
//           border: 1px dashed #d1d5db;
//           color: #6b7280;
//           font-size: 16px;
//         }

//         .reviews-list {
//           display: grid;
//           gap: 18px;
//         }

//         .review-card {
//           border: 1px solid #e5e7eb;
//           border-radius: 14px;
//           padding: 20px;
//           background: #fcfcfd;
//           box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
//         }

//         .review-top {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 10px;
//           flex-wrap: wrap;
//           gap: 10px;
//         }

//         .reviewer-name {
//           font-weight: 800;
//           color: #111827;
//           font-size: 16px;
//           margin-bottom: 4px;
//         }

//         .review-subtext {
//           color: #6b7280;
//           font-size: 13px;
//         }

//         .review-stars {
//           color: #f59e0b;
//           font-weight: 800;
//           font-size: 16px;
//           letter-spacing: 1px;
//         }

//         .featured-review-badge {
//           display: inline-block;
//           margin-bottom: 12px;
//           padding: 6px 10px;
//           border-radius: 999px;
//           background: #eef2ff;
//           color: #4338ca;
//           font-size: 12px;
//           font-weight: 800;
//         }

//         .review-text {
//           margin: 0;
//           line-height: 1.8;
//           color: #374151;
//           font-size: 15px;
//           word-break: break-word;
//           overflow-wrap: anywhere;
//         }

//         @media (max-width: 1199px) {
//           .product-main-layout {
//             grid-template-columns: 1fr;
//             gap: 24px;
//           }

//           .product-info-card {
//             position: static;
//             top: unset;
//           }
//         }

//         @media (max-width: 767px) {
//           .product-breadcrumb {
//             font-size: 12px;
//             gap: 6px;
//             margin-bottom: 14px;
//           }

//           .product-gallery-card,
//           .product-info-card,
//           .reviews-card {
//             padding: 16px;
//             border-radius: 16px;
//           }

//           .product-gallery-grid.has-thumbs {
//             grid-template-columns: 1fr;
//           }

//           .thumbnail-list {
//             order: 2;
//             flex-direction: row;
//             overflow-x: auto;
//             overflow-y: hidden;
//             gap: 10px;
//             padding-bottom: 4px;
//             max-height: none;
//           }

//           .thumbnail-btn {
//             min-width: 72px;
//             width: 72px;
//             flex: 0 0 72px;
//             padding: 4px;
//           }

//           .thumbnail-img,
//           .thumbnail-video-wrap {
//             height: 72px;
//           }

//           .main-image-wrapper {
//             padding: 10px;
//             border-radius: 14px;
//           }

//           .main-image-badges {
//             top: 14px;
//             left: 14px;
//             gap: 8px;
//           }

//           .badge-dark,
//           .badge-light {
//             font-size: 10px;
//             padding: 6px 10px;
//           }

//           .main-zoom-stage {
//             aspect-ratio: 4 / 5;
//             border-radius: 12px;
//           }

//           .main-product-image {
//             padding: 24px;
//             border-radius: 12px;
//           }

//           .main-product-video {
//             border-radius: 12px;
//           }

//           .main-arrow-btn {
//             width: 40px;
//             height: 40px;
//             font-size: 32px;
//           }

//           .main-arrow-left {
//             left: 12px;
//           }

//           .main-arrow-right {
//             right: 12px;
//           }

//           .main-zoom-hint {
//             right: 12px;
//             bottom: 12px;
//             font-size: 11px;
//           }

//           .full-view-trigger {
//             font-size: 17px;
//             margin-top: 12px;
//           }

//           .product-title {
//             font-size: 26px;
//             line-height: 1.3;
//           }

//           .price-display-row {
//             gap: 8px;
//           }

//           .discount-badge {
//             font-size: 24px;
//           }

//           .price-text {
//             font-size: 36px;
//           }

//           .mrp-line {
//             font-size: 15px;
//           }

//           .stars {
//             font-size: 18px;
//           }

//           .rating-text,
//           .description-text,
//           .review-text {
//             font-size: 14px;
//           }

//           .add-to-cart-btn,
//           .buy-now-btn {
//             padding: 15px 20px;
//             font-size: 15px;
//           }

//           .reviews-title {
//             font-size: 22px;
//           }

//           .reviews-summary {
//             width: 100%;
//           }
//         }

//         @media (max-width: 479px) {
//           .main-zoom-stage {
//             aspect-ratio: 1 / 1.15;
//           }

//           .product-title {
//             font-size: 22px;
//           }

//           .discount-badge {
//             font-size: 20px;
//           }

//           .price-text {
//             font-size: 30px;
//           }

//           .mrp-line {
//             font-size: 14px;
//           }

//           .top-label {
//             font-size: 11px;
//           }

//           .trust-box {
//             font-size: 13px;
//           }

//           .review-card {
//             padding: 16px;
//           }

//           .full-view-trigger {
//             font-size: 16px;
//           }

//           .main-zoom-hint {
//             display: none;
//           }
//         }
//       `}</style>
//     </>
//   );
// }



























"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { fetchProduct } from "@/features/products/productSlice";
import { addToCart } from "@/features/cart/cartSlice";

function getImageUrl(imageUrl) {
  if (!imageUrl) return "/placeholder.png";
  if (imageUrl.startsWith("http")) return imageUrl;

  const base = (
    process.env.NEXT_PUBLIC_API_BASE ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ""
  ).replace(/\/$/, "");

  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return base ? `${base}${path}` : path;
}

function getCleanUrl(url = "") {
  return String(url).split("?")[0].split("#")[0].toLowerCase();
}

function isVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov|m4v)$/i.test(getCleanUrl(url));
}

function isImageUrl(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(getCleanUrl(url));
}

function getMediaType(url) {
  if (isVideoUrl(url)) return "video";
  if (isImageUrl(url)) return "image";
  return "image";
}

function safeJsonParse(value, fallback = []) {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return value;

  try {
    const parsed = JSON.parse(value);
    return parsed || fallback;
  } catch {
    return fallback;
  }
}

function splitHighlights(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  return String(value)
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 3.4;
const TAP_ZOOM_STEP = 0.45;

function clampValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getTouchDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

export default function ProductPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();

  const id = params?.id;
  const product = useSelector((state) => state.products.product);

  const [selectedMedia, setSelectedMedia] = useState("");
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const zoomStageRef = useRef(null);
  const videoRef = useRef(null);

  const isZoomed = zoomScale > 1.01;

  const dragDataRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    moved: false,
  });

  const swipeDataRef = useRef({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    isSwiping: false,
    moved: false,
  });

  const touchZoomRef = useRef({
    mode: "none",
    startDistance: 0,
    startScale: 1,
    startX: 0,
    startY: 0,
    startPosX: 0,
    startPosY: 0,
    moved: false,
  });

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProduct(id));
  }, [id, dispatch]);

  const galleryMedia = useMemo(() => {
    if (!product?.images?.length) return [];

    return product.images
      .map((item) => {
        const rawUrl =
          typeof item === "string"
            ? item
            : item?.imageUrl || item?.url || item?.mediaUrl || item?.videoUrl;

        if (!rawUrl) return null;

        const url = getImageUrl(rawUrl);
        const type =
          typeof item === "object" && item?.mediaType
            ? String(item.mediaType).toLowerCase().includes("video")
              ? "video"
              : "image"
            : getMediaType(url);

        return {
          url,
          type,
          alt: item?.alt || product?.title || "Product media",
        };
      })
      .filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (!galleryMedia.length) {
      setSelectedMedia("");
      return;
    }

    setSelectedMedia((prev) =>
      galleryMedia.some((media) => media.url === prev)
        ? prev
        : galleryMedia[0].url,
    );
  }, [galleryMedia]);

  const activeMedia =
    galleryMedia.find((media) => media.url === selectedMedia) ||
    galleryMedia[0] || {
      url: "/placeholder.png",
      type: "image",
      alt: product?.title || "Product image",
    };

  const activeMediaIndex = Math.max(
    0,
    galleryMedia.findIndex((media) => media.url === activeMedia.url),
  );

  const isActiveVideo = activeMedia.type === "video";

  const clampZoomPosition = (x, y, scale = zoomScale) => {
    const stage = zoomStageRef.current;

    if (!stage || scale <= 1.01 || isActiveVideo) {
      return { x: 0, y: 0 };
    }

    const rect = stage.getBoundingClientRect();
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;

    return {
      x: clampValue(x, -maxX, maxX),
      y: clampValue(y, -maxY, maxY),
    };
  };

  const resetZoom = () => {
    setZoomScale(1);
    setZoomPosition({ x: 0, y: 0 });

    dragDataRef.current = {
      isDragging: false,
      startX: 0,
      startY: 0,
      startPosX: 0,
      startPosY: 0,
      moved: false,
    };

    touchZoomRef.current = {
      mode: "none",
      startDistance: 0,
      startScale: 1,
      startX: 0,
      startY: 0,
      startPosX: 0,
      startPosY: 0,
      moved: false,
    };
  };

  const setSmoothZoom = (nextScale) => {
    if (isActiveVideo) return;

    const cleanScale = clampValue(nextScale, MIN_ZOOM, MAX_ZOOM);

    if (cleanScale <= 1.01) {
      setZoomScale(1);
      setZoomPosition({ x: 0, y: 0 });
      return;
    }

    setZoomScale(cleanScale);
    setZoomPosition((prev) => clampZoomPosition(prev.x, prev.y, cleanScale));
  };

  const goToPreviousImage = () => {
    if (galleryMedia.length <= 1) return;

    resetZoom();

    const previousIndex =
      activeMediaIndex <= 0 ? galleryMedia.length - 1 : activeMediaIndex - 1;

    setSelectedMedia(galleryMedia[previousIndex].url);
  };

  const goToNextImage = () => {
    if (galleryMedia.length <= 1) return;

    resetZoom();

    const nextIndex =
      activeMediaIndex >= galleryMedia.length - 1 ? 0 : activeMediaIndex + 1;

    setSelectedMedia(galleryMedia[nextIndex].url);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") goToPreviousImage();
      if (event.key === "ArrowRight") goToNextImage();
      if (event.key === "Escape") resetZoom();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMediaIndex, galleryMedia]);

  useEffect(() => {
    resetZoom();

    if (videoRef.current) {
      videoRef.current.currentTime = 0;

      if (isActiveVideo) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [activeMedia.url, isActiveVideo]);

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;

    try {
      await dispatch(addToCart({ product, quantity: 1 })).unwrap();
      router.push("/cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add product to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) return;

    try {
      const result = await dispatch(addToCart({ product, quantity: 1 })).unwrap();

      if (!result.cartId) {
        router.push("/checkout?guest=true");
      } else {
        router.push("/checkout");
      }
    } catch (err) {
      console.error("Buy now failed:", err);
      alert("Failed to proceed to checkout");
    }
  };

  const handleMainThumbClick = (media) => {
    setSelectedMedia(media.url);
    resetZoom();
  };

  const handleZoomToggle = () => {
    if (isActiveVideo) return;

    if (dragDataRef.current.moved || touchZoomRef.current.moved) {
      dragDataRef.current.moved = false;
      touchZoomRef.current.moved = false;
      return;
    }

    if (zoomScale >= MAX_ZOOM - 0.05) {
      resetZoom();
      return;
    }

    setSmoothZoom(zoomScale <= 1.01 ? 1.65 : zoomScale + TAP_ZOOM_STEP);
  };

  const handleZoomStageMouseDown = (event) => {
    if (isActiveVideo || !isZoomed || !zoomStageRef.current) return;

    dragDataRef.current = {
      isDragging: true,
      startX: event.clientX,
      startY: event.clientY,
      startPosX: zoomPosition.x,
      startPosY: zoomPosition.y,
      moved: false,
    };
  };

  const handleZoomStageMouseMove = (event) => {
    if (isActiveVideo || !isZoomed || !dragDataRef.current.isDragging) return;

    event.preventDefault();

    const deltaX = event.clientX - dragDataRef.current.startX;
    const deltaY = event.clientY - dragDataRef.current.startY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragDataRef.current.moved = true;
    }

    const next = clampZoomPosition(
      dragDataRef.current.startPosX + deltaX,
      dragDataRef.current.startPosY + deltaY,
      zoomScale,
    );

    setZoomPosition(next);
  };

  const handleZoomStageMouseUp = () => {
    dragDataRef.current.isDragging = false;
  };

  const handleZoomStageMouseLeave = () => {
    dragDataRef.current.isDragging = false;
  };

  const handleZoomStageTouchStart = (event) => {
    if (isActiveVideo) return;

    if (event.touches.length === 2) {
      const distance = getTouchDistance(event.touches[0], event.touches[1]);

      touchZoomRef.current = {
        mode: "pinch",
        startDistance: distance,
        startScale: zoomScale,
        startX: 0,
        startY: 0,
        startPosX: zoomPosition.x,
        startPosY: zoomPosition.y,
        moved: false,
      };

      return;
    }

    const touch = event.touches[0];
    if (!touch) return;

    if (!isZoomed) {
      swipeDataRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        endX: touch.clientX,
        endY: touch.clientY,
        isSwiping: true,
        moved: false,
      };

      touchZoomRef.current.mode = "swipe";
      return;
    }

    touchZoomRef.current = {
      mode: "drag",
      startDistance: 0,
      startScale: zoomScale,
      startX: touch.clientX,
      startY: touch.clientY,
      startPosX: zoomPosition.x,
      startPosY: zoomPosition.y,
      moved: false,
    };
  };

  const handleZoomStageTouchMove = (event) => {
    if (isActiveVideo) return;

    if (event.touches.length === 2 && touchZoomRef.current.mode === "pinch") {
      event.preventDefault();

      const distance = getTouchDistance(event.touches[0], event.touches[1]);

      if (!touchZoomRef.current.startDistance) return;

      const pinchRatio = distance / touchZoomRef.current.startDistance;
      const nextScale = clampValue(
        touchZoomRef.current.startScale * pinchRatio,
        MIN_ZOOM,
        MAX_ZOOM,
      );

      if (Math.abs(nextScale - touchZoomRef.current.startScale) > 0.03) {
        touchZoomRef.current.moved = true;
      }

      if (nextScale <= 1.01) {
        setZoomScale(1);
        setZoomPosition({ x: 0, y: 0 });
      } else {
        setZoomScale(nextScale);
        setZoomPosition((prev) => clampZoomPosition(prev.x, prev.y, nextScale));
      }

      return;
    }

    const touch = event.touches[0];
    if (!touch) return;

    if (!isZoomed) {
      if (!swipeDataRef.current.isSwiping) return;

      const deltaX = touch.clientX - swipeDataRef.current.startX;
      const deltaY = touch.clientY - swipeDataRef.current.startY;

      swipeDataRef.current.endX = touch.clientX;
      swipeDataRef.current.endY = touch.clientY;

      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
        swipeDataRef.current.moved = true;
        touchZoomRef.current.moved = true;
      }

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        event.preventDefault();
      }

      return;
    }

    if (touchZoomRef.current.mode !== "drag") return;

    event.preventDefault();

    const deltaX = touch.clientX - touchZoomRef.current.startX;
    const deltaY = touch.clientY - touchZoomRef.current.startY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      touchZoomRef.current.moved = true;
      dragDataRef.current.moved = true;
    }

    const next = clampZoomPosition(
      touchZoomRef.current.startPosX + deltaX,
      touchZoomRef.current.startPosY + deltaY,
      zoomScale,
    );

    setZoomPosition(next);
  };

  const handleZoomStageTouchEnd = () => {
    if (isActiveVideo) return;

    if (!isZoomed && swipeDataRef.current.isSwiping) {
      const deltaX = swipeDataRef.current.endX - swipeDataRef.current.startX;
      const deltaY = swipeDataRef.current.endY - swipeDataRef.current.startY;

      const isHorizontalSwipe =
        Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY);

      if (galleryMedia.length > 1 && isHorizontalSwipe) {
        if (deltaX < 0) {
          goToNextImage();
        } else {
          goToPreviousImage();
        }

        touchZoomRef.current.moved = true;
      }

      swipeDataRef.current = {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
        isSwiping: false,
        moved: false,
      };

      touchZoomRef.current.mode = "none";
      return;
    }

    dragDataRef.current.isDragging = false;
    touchZoomRef.current.mode = "none";
  };

  const handleZoomStageClick = () => {
    if (isActiveVideo) return;
    handleZoomToggle();
  };

  if (!product) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f6f7fb",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          color: "#444",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Loading product...
      </div>
    );
  }

  const reviewCount = product.reviews?.length || 0;

  const averageRating =
    reviewCount > 0
      ? (
          product.reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviewCount
        ).toFixed(1)
      : 0;

  const roundedAverage = reviewCount > 0 ? Math.round(Number(averageRating)) : 0;

  const stockStatus =
    product.stock > 0
      ? product.stock > 10
        ? "In Stock"
        : `Only ${product.stock} left`
      : "Out of Stock";

  const showThumbRail = galleryMedia.length > 1;

  const sellingPrice = Number(product.priceInr || 0);
  const mrp = Number(product.mrpInr || 0);

  const discountPercent =
    mrp > 0 && sellingPrice > 0 && mrp > sellingPrice
      ? Math.round(((mrp - sellingPrice) / mrp) * 100)
      : 0;

  const shortHighlights = splitHighlights(product.shortHighlights);
  const specifications = safeJsonParse(
    product.specifications || product.specificationsJson,
    [],
  );
  const featureHighlights = safeJsonParse(
    product.featureHighlights || product.featureHighlightsJson,
    [],
  );
  const faqs = safeJsonParse(product.faq || product.faqJson, []);
  const boxContents = safeJsonParse(
    product.boxContents || product.boxContentsJson,
    [],
  );


  const pdpBanners = safeJsonParse(
  product.pdpBanners || product.pdpBannersJson || product.pdp_banners_json,
  [],
).filter((banner) => banner && banner.active !== false && banner.imageUrl);



  return (
    <>
      <div
        style={{
          background: "#f6f7fb",
          minHeight: "100vh",
          padding: "32px 20px 60px",
        }}
      >
        <div style={{ maxWidth: "1380px", margin: "0 auto" }}>
          <div className="product-breadcrumb">
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            <span>/</span>
            <span className="breadcrumb-current">{product.title}</span>
          </div>

          <div className="product-main-layout">
            <div className="product-gallery-card">
              <div
                className={`product-gallery-grid ${
                  showThumbRail ? "has-thumbs" : "no-thumbs"
                }`}
              >
                {showThumbRail && (
                  <div className="thumbnail-rail">
                    <div className="thumbnail-list">
                      {galleryMedia.map((media, i) => {
                        const isActive = activeMedia.url === media.url;

                        return (
                          <button
                            key={`${media.url}-${i}`}
                            type="button"
                            onClick={() => handleMainThumbClick(media)}
                            className={`thumbnail-btn ${
                              isActive ? "active-thumb" : ""
                            }`}
                            aria-label={`View product media ${i + 1}`}
                          >
                            {media.type === "video" ? (
                              <div className="thumbnail-video-wrap">
                                <video
                                  src={media.url}
                                  muted
                                  playsInline
                                  preload="metadata"
                                  className="thumbnail-img"
                                />
                                <span className="thumb-play-icon">▶</span>
                              </div>
                            ) : (
                              <img
                                src={media.url}
                                alt={`${product.title} thumbnail ${i + 1}`}
                                className="thumbnail-img"
                                loading="lazy"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="main-image-column">
                  <div className="main-image-wrapper">
                    <div className="main-image-badges">
                      <span className="badge-dark">PREMIUM</span>

                      {galleryMedia.length > 1 && (
                        <span className="badge-light">
                          {activeMediaIndex + 1} / {galleryMedia.length}
                        </span>
                      )}
                    </div>

                    {galleryMedia.length > 1 && !isZoomed && (
                      <button
                        type="button"
                        className="main-arrow-btn main-arrow-left"
                        onClick={goToPreviousImage}
                        aria-label="Previous media"
                      >
                        ‹
                      </button>
                    )}

                    <div
                      ref={zoomStageRef}
                      role={isActiveVideo ? "region" : "button"}
                      tabIndex={isActiveVideo ? -1 : 0}
                      className={`main-zoom-stage ${
                        isZoomed ? "main-zoomed" : ""
                      } ${isActiveVideo ? "video-stage" : ""}`}
                      onClick={handleZoomStageClick}
                      onMouseDown={handleZoomStageMouseDown}
                      onMouseMove={handleZoomStageMouseMove}
                      onMouseUp={handleZoomStageMouseUp}
                      onMouseLeave={handleZoomStageMouseLeave}
                      onTouchStart={handleZoomStageTouchStart}
                      onTouchMove={handleZoomStageTouchMove}
                      onTouchEnd={handleZoomStageTouchEnd}
                    >
                      {isActiveVideo ? (
                        <video
                          ref={videoRef}
                          src={activeMedia.url}
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          controlsList="nodownload"
                          className="main-product-video"
                        >
                          Your browser does not support product video.
                        </video>
                      ) : (
                        <img
                          src={activeMedia.url}
                          alt={activeMedia.alt || product.title}
                          className="main-product-image"
                          draggable={false}
                          style={{
                            transform: `translate3d(${zoomPosition.x}px, ${zoomPosition.y}px, 0) scale(${zoomScale})`,
                          }}
                        />
                      )}
                    </div>

                    {galleryMedia.length > 1 && !isZoomed && (
                      <button
                        type="button"
                        className="main-arrow-btn main-arrow-right"
                        onClick={goToNextImage}
                        aria-label="Next media"
                      >
                        ›
                      </button>
                    )}

                    {!isActiveVideo && (
                      <div className="main-zoom-hint">
                        {isZoomed
                          ? "Drag to move • Pinch to zoom • Tap to zoom more"
                          : "Tap to zoom • Swipe image"}
                      </div>
                    )}
                  </div>

                  {galleryMedia.length > 1 && !isActiveVideo && (
                    <button
                      type="button"
                      className="full-view-trigger"
                      onClick={handleZoomToggle}
                    >
                      {isZoomed
                        ? "Tap / pinch to zoom more"
                        : "Tap to see full view"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="product-info-card">
              <div className="top-label">PREMIUM COLLECTION</div>

              <h1 className="product-title">{product.title}</h1>

              <div className="rating-row">
                <div className="stars">
                  {"★".repeat(roundedAverage)}
                  {"☆".repeat(5 - roundedAverage)}
                </div>

                <div className="rating-text">
                  {reviewCount > 0
                    ? `${averageRating} rating • ${reviewCount} review${
                        reviewCount > 1 ? "s" : ""
                      }`
                    : "No ratings yet"}
                </div>
              </div>

              <div className="price-stock-row">
                <div className="price-block">
                  <div className="price-display-row">
                    {discountPercent > 0 && (
                      <span className="discount-badge">
                        -{discountPercent}%
                      </span>
                    )}

                    <h2 className="price-text">
                      ₹{sellingPrice.toLocaleString("en-IN")}
                    </h2>
                  </div>

                  {mrp > 0 && (
                    <div className="mrp-line">
                      <span className="mrp-label">M.R.P.:</span>{" "}
                      <span className="mrp-value">
                        ₹{mrp.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                <span
                  className="stock-pill"
                  style={{
                    background: product.stock > 0 ? "#ecfdf5" : "#fef2f2",
                    color: product.stock > 0 ? "#047857" : "#b91c1c",
                  }}
                >
                  {stockStatus}
                </span>
              </div>

              <div className="description-box">
                <p className="description-text">{product.description}</p>
              </div>

              {shortHighlights.length > 0 && (
                <div className="quick-highlights">
                  {shortHighlights.map((item, index) => (
                    <span key={`${item}-${index}`} className="quick-pill">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <div className="action-buttons">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="add-to-cart-btn"
                  style={{
                    background:
                      product.stock > 0
                        ? "linear-gradient(135deg, #111827 0%, #1f2937 100%)"
                        : "#9ca3af",
                    cursor: product.stock > 0 ? "pointer" : "not-allowed",
                    boxShadow:
                      product.stock > 0
                        ? "0 12px 24px rgba(17,24,39,0.18)"
                        : "none",
                  }}
                >
                  {product.stock > 0 ? "Add To Cart" : "Out of Stock"}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="buy-now-btn"
                >
                  Buy Now
                </button>
              </div>

              <div className="trust-grid">
                <div className="trust-box">
                  Secure checkout and trusted shopping experience
                </div>
                <div className="trust-box">
                  Premium quality product with customer satisfaction focus
                </div>
              </div>
            </div>
          </div>





          {pdpBanners.length > 0 && (
  <div className="pdp-banners-section">
    {pdpBanners
      .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0))
      .map((banner, index) => (
        <div key={`${banner.imageUrl}-${index}`} className="pdp-banner-card">
          <img
            src={getImageUrl(banner.imageUrl)}
            alt={banner.title || product.title || "Product banner"}
            className="pdp-banner-image"
            loading="lazy"
          />

          <div className="pdp-banner-overlay">
            {banner.subtitle && (
              <span className="pdp-banner-subtitle">{banner.subtitle}</span>
            )}

            {banner.title && (
              <h2 className="pdp-banner-title">{banner.title}</h2>
            )}

            {banner.description && (
              <p className="pdp-banner-description">{banner.description}</p>
            )}

            {banner.buttonText && banner.buttonLink && (
              <button
                type="button"
                className="pdp-banner-button"
                onClick={() => router.push(banner.buttonLink)}
              >
                {banner.buttonText}
              </button>
            )}
          </div>
        </div>
      ))}
  </div>
)}






          <div className="extra-details-grid">
            {featureHighlights.length > 0 && (
              <div className="details-card">
                <h2 className="details-title">Feature Highlights</h2>
                <div className="feature-grid">
                  {featureHighlights.map((item, index) => (
                    <div key={index} className="feature-box">
                      <h3>{item.title || item.label || "Feature"}</h3>
                      <p>{item.description || item.value || ""}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {specifications.length > 0 && (
              <div className="details-card">
                <h2 className="details-title">Specifications</h2>
                <div className="spec-list">
                  {specifications.map((item, index) => (
                    <div key={index} className="spec-row">
                      <span>{item.label || item.name || `Spec ${index + 1}`}</span>
                      <strong>{item.value || "-"}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(product.warrantyInfo || product.compatibility || boxContents.length > 0) && (
              <div className="details-card">
                <h2 className="details-title">Warranty & Box Contents</h2>

                {product.warrantyInfo && (
                  <div className="info-line">
                    <span>Warranty</span>
                    <p>{product.warrantyInfo}</p>
                  </div>
                )}

                {product.compatibility && (
                  <div className="info-line">
                    <span>Compatibility</span>
                    <p>{product.compatibility}</p>
                  </div>
                )}

                {boxContents.length > 0 && (
                  <div className="box-list">
                    {boxContents.map((item, index) => (
                      <div key={index} className="box-item">
                        ✓ {typeof item === "string" ? item : item?.value || item?.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {product.demoVideoUrl && (
              <div className="details-card">
                <h2 className="details-title">Product Demo</h2>
                <video
                  src={product.demoVideoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="demo-video"
                >
                  Your browser does not support product video.
                </video>
              </div>
            )}

            {faqs.length > 0 && (
              <div className="details-card full-details-card">
                <h2 className="details-title">Frequently Asked Questions</h2>
                <div className="faq-list">
                  {faqs.map((item, index) => (
                    <details key={index} className="faq-item">
                      <summary>{item.question || `Question ${index + 1}`}</summary>
                      <p>{item.answer || ""}</p>
                    </details>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="reviews-card">
            <div className="reviews-head">
              <h2 className="reviews-title">Customer Reviews</h2>

              {reviewCount > 0 && (
                <div className="reviews-summary">
                  <span className="summary-stars">
                    {"★".repeat(roundedAverage)}
                    {"☆".repeat(5 - roundedAverage)}
                  </span>
                  <span className="summary-text">
                    {averageRating} / 5 from {reviewCount} review
                    {reviewCount > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {!product.reviews || product.reviews.length === 0 ? (
              <div className="no-reviews-box">No reviews yet.</div>
            ) : (
              <div className="reviews-list">
                {product.reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    <div className="review-top">
                      <div>
                        <div className="reviewer-name">
                          {review.reviewerName}
                        </div>
                        <div className="review-subtext">
                          Verified customer review
                        </div>
                      </div>

                      <div className="review-stars">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                    </div>

                    {review.featured && (
                      <div className="featured-review-badge">
                        Featured Review
                      </div>
                    )}

                    <p className="review-text">{review.reviewText}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .product-breadcrumb {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 18px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .breadcrumb-current {
          color: #111827;
          font-weight: 700;
          word-break: break-word;
        }

        .product-main-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(360px, 440px);
          gap: 32px;
          align-items: start;
        }

        .product-gallery-card,
        .product-info-card,
        .reviews-card,
        .details-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          border: 1px solid #ececec;
        }

        .product-gallery-card {
          padding: 24px;
          min-width: 0;
          overflow: visible;
        }

        .product-gallery-grid {
          display: grid;
          gap: 18px;
          align-items: start;
          min-width: 0;
        }

        .product-gallery-grid.has-thumbs {
          grid-template-columns: 92px minmax(0, 1fr);
        }

        .product-gallery-grid.no-thumbs {
          grid-template-columns: 1fr;
        }

        .thumbnail-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 680px;
          overflow-y: auto;
        }

        .thumbnail-btn {
          width: 100%;
          border: 1px solid #dbe1ea;
          background: #fff;
          border-radius: 14px;
          overflow: hidden;
          padding: 6px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
        }

        .thumbnail-btn:hover {
          border-color: #94a3b8;
          transform: translateY(-1px);
        }

        .thumbnail-btn.active-thumb {
          border: 2px solid #111827;
          box-shadow: 0 6px 18px rgba(17, 24, 39, 0.12);
        }

        .thumbnail-video-wrap {
          position: relative;
          width: 100%;
          height: 88px;
          border-radius: 10px;
          overflow: hidden;
          background: #000;
        }

        .thumbnail-img {
          width: 100%;
          height: 88px;
          object-fit: contain;
          border-radius: 10px;
          display: block;
          background: #fff;
        }

        .thumb-play-icon {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 30px;
          height: 30px;
          border-radius: 999px;
          background: rgba(17, 24, 39, 0.85);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          padding-left: 2px;
          pointer-events: none;
        }

        .main-image-wrapper {
          position: relative;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          overflow: hidden;
          padding: 14px;
        }

        .main-image-badges {
          position: absolute;
          top: 22px;
          left: 22px;
          z-index: 5;
          display: flex;
          gap: 10px;
          pointer-events: none;
        }

        .badge-dark,
        .badge-light {
          padding: 7px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
        }

        .badge-dark {
          background: #111827;
          color: #fff;
        }

        .badge-light {
          background: #fff;
          color: #111827;
          border: 1px solid #e5e7eb;
        }

        .main-zoom-stage {
          width: 100%;
          aspect-ratio: 1 / 1;
          max-height: 680px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-in;
          overflow: hidden;
          border-radius: 14px;
          touch-action: pan-y;
          user-select: none;
        }

        .main-zoom-stage.video-stage {
          cursor: default;
          background: #000;
          touch-action: auto;
        }

        .main-zoom-stage.main-zoomed {
          cursor: grab;
          touch-action: none;
        }

        .main-product-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 30px;
          border-radius: 14px;
          display: block;
          background: #fff;
          transition: transform 0.18s ease-out;
          pointer-events: none;
        }

        .main-product-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #000;
          border-radius: 14px;
        }

        .main-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 46px;
          height: 46px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          background: rgba(255, 255, 255, 0.94);
          color: #111827;
          font-size: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 6;
        }

        .main-arrow-btn:hover {
          background: #111827;
          color: #fff;
        }

        .main-arrow-left {
          left: 18px;
        }

        .main-arrow-right {
          right: 18px;
        }

        .main-zoom-hint {
          position: absolute;
          right: 18px;
          bottom: 18px;
          z-index: 6;
          background: rgba(255, 255, 255, 0.92);
          color: #111827;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid #e5e7eb;
          font-size: 12px;
          font-weight: 700;
          pointer-events: none;
        }

        .full-view-trigger {
          align-self: center;
          margin-top: 12px;
          border: none;
          background: transparent;
          color: #2563eb;
          font-size: 14px;
          cursor: pointer;
        }

        .product-info-card {
          padding: 30px;
          position: sticky;
          top: 20px;
        }

        .top-label {
          display: inline-block;
          background: #111827;
          color: #fff;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .product-title {
          font-size: 34px;
          line-height: 1.25;
          margin: 0 0 14px;
          color: #111827;
          font-weight: 800;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .stars,
        .summary-stars,
        .review-stars {
          color: #f59e0b;
          font-weight: 700;
        }

        .price-stock-row {
          margin-bottom: 22px;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }

        .price-display-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .discount-badge {
          color: #cc0c39;
          font-size: 32px;
          font-weight: 500;
        }

        .price-text {
          color: #111;
          font-size: 48px;
          font-weight: 500;
          margin: 0;
        }

        .mrp-line {
          color: #6b7280;
          font-size: 18px;
        }

        .mrp-value {
          text-decoration: line-through;
        }

        .stock-pill {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
        }

        .description-box {
          border-top: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          padding: 18px 0;
          margin-bottom: 18px;
        }

        .description-text {
          margin: 0;
          color: #4b5563;
          font-size: 16px;
          line-height: 1.8;
        }

        .quick-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 22px;
        }

        .quick-pill {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          color: #111827;
          padding: 8px 11px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
        }

        .action-buttons {
          display: grid;
          gap: 12px;
        }

        .add-to-cart-btn,
        .buy-now-btn {
          width: 100%;
          padding: 16px 24px;
          border-radius: 14px;
          font-weight: 800;
          font-size: 16px;
          transition: 0.3s ease;
        }

        .add-to-cart-btn {
          color: #fff;
          border: none;
        }

        .buy-now-btn {
          background: #fff;
          color: #111827;
          border: 1.5px solid #111827;
          cursor: pointer;
        }

        .buy-now-btn:hover {
          background: #111827;
          color: #fff;
        }

        .trust-grid {
          margin-top: 18px;
          display: grid;
          gap: 10px;
        }

        .trust-box {
          background: #f9fafb;
          border-radius: 12px;
          padding: 12px 14px;
          color: #374151;
          font-size: 14px;
          border: 1px solid #eceff3;
        }

        .extra-details-grid {
          margin-top: 42px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        .details-card {
          padding: 28px;
        }

        .full-details-card {
          grid-column: 1 / -1;
        }

        .details-title {
          margin: 0 0 20px;
          font-size: 24px;
          color: #111827;
          font-weight: 800;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .feature-box {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 16px;
        }

        .feature-box h3 {
          margin: 0 0 8px;
          color: #111827;
          font-size: 16px;
          font-weight: 800;
        }

        .feature-box p {
          margin: 0;
          color: #4b5563;
          font-size: 14px;
          line-height: 1.7;
        }

        .spec-list {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
        }

        .spec-row {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 14px;
          padding: 14px 16px;
          border-bottom: 1px solid #e5e7eb;
          background: #fff;
        }

        .spec-row:last-child {
          border-bottom: none;
        }

        .spec-row span {
          color: #6b7280;
          font-size: 14px;
          font-weight: 700;
        }

        .spec-row strong {
          color: #111827;
          font-size: 14px;
          font-weight: 800;
        }

        .info-line {
          margin-bottom: 18px;
        }

        .info-line span {
          display: block;
          color: #111827;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .info-line p {
          margin: 0;
          color: #4b5563;
          line-height: 1.7;
        }

        .box-list {
          display: grid;
          gap: 10px;
        }

        .box-item {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px 14px;
          color: #374151;
          font-size: 14px;
          font-weight: 700;
        }

        .demo-video {
          width: 100%;
          max-height: 360px;
          border-radius: 16px;
          background: #000;
        }

        .faq-list {
          display: grid;
          gap: 12px;
        }

        .faq-item {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 16px;
          background: #f9fafb;
        }

        .faq-item summary {
          cursor: pointer;
          color: #111827;
          font-weight: 800;
        }

        .faq-item p {
          margin: 12px 0 0;
          color: #4b5563;
          line-height: 1.7;
        }

        .reviews-card {
          margin-top: 42px;
          padding: 30px;
        }

        .reviews-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }

        .reviews-title {
          margin: 0;
          font-size: 28px;
          color: #111827;
          font-weight: 800;
        }

        .reviews-summary {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 10px 14px;
          display: flex;
          gap: 10px;
        }

        .no-reviews-box {
          text-align: center;
          padding: 32px 20px;
          background: #f9fafb;
          border-radius: 14px;
          border: 1px dashed #d1d5db;
          color: #6b7280;
        }

        .reviews-list {
          display: grid;
          gap: 18px;
        }

        .review-card {
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 20px;
          background: #fcfcfd;
        }

        .review-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }

        .reviewer-name {
          font-weight: 800;
          color: #111827;
        }

        .review-subtext {
          color: #6b7280;
          font-size: 13px;
        }

        .featured-review-badge {
          display: inline-block;
          margin-bottom: 12px;
          padding: 6px 10px;
          border-radius: 999px;
          background: #eef2ff;
          color: #4338ca;
          font-size: 12px;
          font-weight: 800;
        }

        .review-text {
          margin: 0;
          line-height: 1.8;
          color: #374151;
        }















        .pdp-banners-section {
  margin-top: 42px;
  display: grid;
  gap: 22px;
}

.pdp-banner-card {
  position: relative;
  min-height: 360px;
  border-radius: 22px;
  overflow: hidden;
  background: #111827;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #ececec;
}

.pdp-banner-image {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  display: block;
}

.pdp-banner-overlay {
  position: absolute;
  inset: 0;
  padding: 42px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 560px;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.48) 45%,
    rgba(0, 0, 0, 0.08) 100%
  );
}

.pdp-banner-subtitle {
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.pdp-banner-title {
  margin: 0;
  color: #ffffff;
  font-size: 38px;
  line-height: 1.15;
  font-weight: 900;
}

.pdp-banner-description {
  margin: 14px 0 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: 16px;
  line-height: 1.8;
}

.pdp-banner-button {
  margin-top: 22px;
  width: fit-content;
  border: none;
  border-radius: 999px;
  background: #ffffff;
  color: #111827;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
}
















        @media (max-width: 1199px) {
          .product-main-layout {
            grid-template-columns: 1fr;
          }

          .product-info-card {
            position: static;
          }
        }

        @media (max-width: 767px) {
          .product-gallery-card,
          .product-info-card,
          .reviews-card,
          .details-card {
            padding: 16px;
            border-radius: 16px;
          }


















          .pdp-banner-card {
  min-height: 260px;
  border-radius: 16px;
}

.pdp-banner-image {
  min-height: 260px;
}

.pdp-banner-overlay {
  padding: 24px;
  max-width: 100%;
}

.pdp-banner-title {
  font-size: 26px;
}

.pdp-banner-description {
  font-size: 14px;
}













          .product-gallery-grid.has-thumbs {
            grid-template-columns: 1fr;
          }

          .thumbnail-list {
            flex-direction: row;
            overflow-x: auto;
            overflow-y: hidden;
            max-height: none;
          }

          .thumbnail-btn {
            min-width: 72px;
            width: 72px;
          }

          .thumbnail-img,
          .thumbnail-video-wrap {
            height: 72px;
          }

          .main-zoom-stage {
            aspect-ratio: 4 / 5;
          }

          .main-product-image {
            padding: 24px;
          }

          .product-title {
            font-size: 26px;
          }

          .discount-badge {
            font-size: 24px;
          }

          .price-text {
            font-size: 36px;
          }

          .extra-details-grid {
            grid-template-columns: 1fr;
          }

          .feature-grid {
            grid-template-columns: 1fr;
          }

          .spec-row {
            grid-template-columns: 1fr;
            gap: 6px;
          }

          .reviews-title,
          .details-title {
            font-size: 22px;
          }
        }

        @media (max-width: 479px) {
          .main-zoom-stage {
            aspect-ratio: 1 / 1.15;
          }

          .product-title {
            font-size: 22px;
          }

          .price-text {
            font-size: 30px;
          }

          .main-zoom-hint {
            display: none;
          }
        }
      `}</style>
    </>
  );
}