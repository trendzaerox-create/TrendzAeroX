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

  const getCategoryName = (product) => {
    if (product.category?.name) return product.category.name;
    if (typeof product.category === "string") return product.category;
    if (selectedCategory?.name) return selectedCategory.name;
    return "Trendz AeroX";
  };

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
          <ProductCard
            product={{
              ...product,
              displayCategoryName: getCategoryName(product),
            }}
          />
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-white py-10">
      {selectedCategory?.thinBannerImageUrl && (
        <div className="mb-6 w-full overflow-hidden bg-neutral-100">
          <img
            src={selectedCategory.thinBannerImageUrl}
            alt={`${selectedCategory.name} thin banner`}
            className="h-[90px] w-full object-cover sm:h-[120px]"
          />
        </div>
      )}

      {selectedCategory?.bannerImageUrl && (
        <div className="mb-8 w-full overflow-hidden bg-neutral-100 shadow-[0_14px_35px_rgba(0,0,0,0.08)]">
          <img
            src={selectedCategory.bannerImageUrl}
            alt={`${selectedCategory.name} banner`}
            className="h-[180px] w-full object-cover sm:h-[260px] lg:h-[340px]"
          />
        </div>
      )}

      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {selectedCategory?.imageUrl && (
              <img
                src={selectedCategory.imageUrl}
                alt={selectedCategory.name}
                className="h-16 w-16 rounded-2xl border border-neutral-200 bg-neutral-100 object-cover"
              />
            )}

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Trendz AeroX
              </p>

              <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.03em] text-black sm:text-[34px]">
                {selectedCategory ? selectedCategory.name : "Products"}
              </h1>

              {selectedCategory && (
                <p className="mt-1 text-sm text-neutral-500">
                  {selectedCategoryProducts.length} products available
                </p>
              )}
            </div>
          </div>
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