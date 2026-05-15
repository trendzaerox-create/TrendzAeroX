"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const customerServiceLinks = [
  { label: "My Account", href: "/account" },
  { label: "My Orders", href: "/account/orders" },
  { label: "Corporate/Bulk Orders", href: "/bulk-orders" },
  { label: "Returns & Exchanges", href: "/returns-exchanges" },
  { label: "Contact Us", href: "/contact" },
];

const trendzWorldLinks = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Our Stores", href: "/stores" },
  { label: "Our Handbags", href: "/products" },
];

const policyLinks = [
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Terms Of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Shipping Policy", href: "/shipping-policy" },
];

const addressInfo = {
  corporateAddress:
    "1, Ho Chi Minh Sarani, Kankaria Estates, Park Street Area, Kolkata, West Bengal 700071, India",
  helpline: "+91 9123315539",
  timing: "10:00am to 6:00pm (Mon-Sat)",
  email: "support@trendzfirenze.com",
};

const socialLinks = [
  { icon: FaFacebookF, href: "https://www.facebook.com/trendzfirenze", label: "Facebook" },
  { icon: FaXTwitter, href: "https://x.com/trendzfirenze", label: "X" },
  { icon: FaInstagram, href: "https://www.instagram.com/trendzfirenze/", label: "Instagram" },
  { icon: FaYoutube, href: "https://www.youtube.com/@trendzfirenze", label: "YouTube" },
];

function FooterColumn({ title, links }) {
  return (
    <div className="min-w-0">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white sm:mb-5">
        {title}
      </h3>

      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="inline-flex items-center text-[13px] leading-[1.5] text-gray-400 transition-colors duration-200 hover:text-white sm:text-[14px]"
            >
              <span className="border-b border-transparent pb-[1px] transition-all duration-200 hover:border-white/40">
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddressColumn() {
  return (
    <div className="min-w-0">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-white sm:mb-5">
        Address
      </h3>

      <div className="space-y-4 text-[13px] leading-[1.6] text-gray-400 sm:text-[14px]">

        <div>
          <span className="block font-semibold text-white mb-1">
            Corporate Address
          </span>
          <p>{addressInfo.corporateAddress}</p>
        </div>

        <div>
          <span className="block font-semibold text-white mb-1">
            Helpline Number
          </span>
          <a
            href={`tel:${addressInfo.helpline.replace(/\s/g, "")}`}
            className="border-b border-white/30 transition-colors duration-200 hover:text-white"
          >
            {addressInfo.helpline}
          </a>
        </div>

        <div>
          <span className="block font-semibold text-white mb-1">
            Operational Timing
          </span>
          <p>{addressInfo.timing}</p>
        </div>

        <div>
          <span className="block font-semibold text-white mb-1">
            Support Email
          </span>
          <a
            href={`mailto:${addressInfo.email}`}
            className="border-b border-white/30 transition-colors duration-200 hover:text-white"
          >
            {addressInfo.email}
          </a>
        </div>

      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-white/10 bg-black">

      {/* subtle premium gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.03),transparent_40%)]" />

      <div className="relative w-full px-4 py-8 sm:px-6 sm:py-10 md:px-8 lg:px-10 xl:px-14 2xl:px-20">

        <div className="grid grid-cols-[1fr_1fr] gap-x-5 gap-y-8 border-b border-white/10 pb-8 sm:gap-x-10 lg:grid-cols-4 lg:gap-14 xl:gap-20">

          <div className="flex min-w-0 flex-col gap-8 lg:contents">
            <FooterColumn title="Customer Service" links={customerServiceLinks} />
            <FooterColumn title="Trendz World" links={trendzWorldLinks} />
            <FooterColumn title="Policies" links={policyLinks} />
          </div>

          <AddressColumn />
        </div>

        <div className="flex flex-col gap-5 pt-6 sm:gap-6 sm:pt-7">

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-[14px] text-gray-300 transition-all duration-200 hover:border-white hover:bg-white hover:text-black"
                >
                  <Icon />
                </a>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] font-medium tracking-[0.08em] text-gray-400">
              <Link href="/test" className="transition duration-300 hover:text-white">
                ©
              </Link>{" "}
              2026 — Trendz Firenze
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}