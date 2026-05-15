

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";

import { logout } from "@/features/auth/authSlice";
import { fetchCart } from "@/features/cart/cartSlice";
import { fetchGiftSetCart } from "@/features/giftSet/giftSetSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const { user, token } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { summary } = useSelector((state) => state.giftSet);

  const giftSetCount = summary?.totalProducts || 0;
  const combinedCartCount = (totalItems || 0) + giftSetCount;

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchGiftSetCart());
  }, [dispatch, token]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchQuery(window.location.search || "");
    }
  }, [pathname]);

  const loginHref = useMemo(() => {
    const fullPath = `${pathname}${searchQuery}`;
    return `/login?next=${encodeURIComponent(fullPath)}`;
  }, [pathname, searchQuery]);

  const handleLogout = async () => {
    dispatch(logout());
    dispatch(fetchCart());
    dispatch(fetchGiftSetCart());
    router.replace("/");
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/bestsellers", label: "BESTSELLERS" },
    { href: "/giftsets", label: "GIFTSETS" },
    { href: "/bulk-order", label: "CORPORATE ORDER" },
  ];

  const iconButtonClass =
    "group relative inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-900 transition-all duration-300 ease-out hover:bg-neutral-100 hover:-translate-y-[1px]";

  const textButtonClass =
    "hidden rounded-md border border-transparent px-3 py-2 text-[12px] font-medium tracking-[0.08em] text-neutral-900 transition-all duration-300 ease-out hover:border-neutral-200 hover:bg-neutral-100 md:inline-flex";

  const accountHref =
    user?.role === "ADMIN" ? "/admin/dashboard" : "/account/profile";

  return (
    <header className="sticky top-0 z-[1000] w-full border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-[74px] max-w-[1280px] items-center justify-between px-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 lg:gap-5">
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="group inline-flex h-10 w-10 items-center justify-center rounded-md text-neutral-800 transition-all duration-300 ease-out hover:bg-neutral-100 lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 7h16M4 12h16M4 17h16"
              />
            </svg>
          </button>

          <Link href="/" className="group relative flex shrink-0 items-center">
  <div className="relative -my-2 scale-[1.05] sm:scale-[1.1]">
    {/* <Image
      src="/images/logo/TrendzAeroxLogo.png"
      alt="Trendz Aerox"
      width={220}
      height={80}
      priority
      className="h-[52px] w-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.03] group-hover:opacity-90 sm:h-[58px]"
    /> */}

    <Link href="/" className="group relative flex shrink-0 items-center">
  <img
    src="/images/logo/TrendzAeroXLogo.png"
    alt="Trendz AeroX"
    className="h-[52px] w-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.05] group-hover:opacity-90 sm:h-[56px]"
  />
</Link>
  </div>
</Link>
        </div>

        <nav className="hidden items-center gap-6 xl:gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group relative text-[11px] font-medium tracking-[0.14em] text-neutral-900 transition-colors duration-300 hover:text-black xl:text-[12px]"
            >
              <span>{item.label}</span>
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 bg-black transition-all duration-300 ease-out group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {!mounted ? (
            <>
              <div className={`${textButtonClass} opacity-0`}>LOADING</div>
              <div className={`${iconButtonClass} opacity-0`} />
            </>
          ) : user && token ? (
            <>
              <Link href={accountHref} className={textButtonClass}>
                {user.role === "ADMIN" ? "DASHBOARD" : "ACCOUNT"}
              </Link>

              <Link href="/cart" className={iconButtonClass} aria-label="Cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7V6a6 6 0 1112 0v1m-13 0h14l-1 12H6L5 7z"
                  />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white shadow-sm">
                  {combinedCartCount}
                </span>
              </Link>

              <button onClick={handleLogout} className={textButtonClass}>
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link href={loginHref} className={textButtonClass}>
                LOGIN
              </Link>

              <Link
                href="/register"
                className="hidden rounded-md border border-neutral-300 px-3 py-2 text-[12px] font-medium tracking-[0.08em] text-neutral-900 transition-all duration-300 ease-out hover:bg-neutral-100 md:inline-flex"
              >
                REGISTER
              </Link>

              <Link
                href="/account/profile"
                className={iconButtonClass}
                aria-label="Account"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                  />
                </svg>
              </Link>

              <button type="button" className={iconButtonClass} aria-label="Search">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              <Link href="/cart" className={iconButtonClass} aria-label="Cart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[22px] w-[22px] transition-transform duration-300 group-hover:scale-105"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 7V6a6 6 0 1112 0v1m-13 0h14l-1 12H6L5 7z"
                  />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-black px-1 text-[10px] font-semibold text-white shadow-sm">
                  {combinedCartCount}
                </span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-neutral-200 bg-white transition-all duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-3">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="border-b border-neutral-100 py-3 text-[12px] font-medium tracking-[0.14em] text-neutral-900 transition-colors duration-300 hover:text-black"
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-3">
            {!mounted ? null : user && token ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={accountHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md border border-neutral-300 px-4 py-3 text-center text-[12px] font-medium tracking-[0.08em] text-neutral-900 transition-colors duration-300 hover:bg-neutral-100"
                >
                  {user.role === "ADMIN" ? "DASHBOARD" : "MY ACCOUNT"}
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md border border-neutral-300 px-4 py-3 text-center text-[12px] font-medium tracking-[0.08em] text-neutral-900 transition-colors duration-300 hover:bg-neutral-100"
                >
                  CART ({combinedCartCount})
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-md bg-black px-4 py-3 text-[12px] font-medium tracking-[0.08em] text-white transition-opacity duration-300 hover:opacity-90"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href={loginHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md border border-neutral-300 px-4 py-3 text-center text-[12px] font-medium tracking-[0.08em] text-neutral-900 transition-colors duration-300 hover:bg-neutral-100"
                >
                  LOGIN
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md bg-black px-4 py-3 text-center text-[12px] font-medium tracking-[0.08em] text-white transition-opacity duration-300 hover:opacity-90"
                >
                  REGISTER
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}