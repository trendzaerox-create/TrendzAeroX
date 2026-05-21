// src/app/(shop)/warranty-policy/page.js

import Link from "next/link";
import {
  FiShield,
  FiClock,
  FiPackage,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
  FiZap,
  FiTool,
  FiFileText,
} from "react-icons/fi";

export const metadata = {
  title: "Warranty Policy | Trendz AeroX",
  description:
    "Read the Trendz AeroX warranty policy, including 6 months warranty coverage from the date of purchase.",
};

const warrantySections = [
  {
    icon: FiClock,
    title: "Warranty Period",
    items: [
      "Trendz AeroX products come with a 6-month warranty from the date of purchase.",
      "Warranty is valid only for the original buyer with valid purchase proof.",
    ],
  },
  {
    icon: FiShield,
    title: "Warranty Coverage",
    items: [
      "Covers manufacturing defects only.",
      "Covers functional defects in electronic components under normal usage.",
      "Covers charging, display, button, speaker, sensor, or connectivity issues caused by manufacturing faults.",
      "Warranty support is provided after product inspection and approval.",
    ],
  },
  {
    icon: FiAlertCircle,
    title: "Not Covered",
    items: [
      "Physical damage, scratches, dents, breakage, or accidental damage.",
      "Water damage, liquid damage, burn damage, or damage due to voltage fluctuation.",
      "Damage caused by misuse, unauthorized repair, modification, or improper handling.",
      "Accessories, straps, cables, packaging, and cosmetic wear are not covered.",
    ],
  },
  {
    icon: FiPackage,
    title: "Warranty Claim Process",
    items: [
      "Contact our support team with your order ID and purchase invoice.",
      "Share clear photos or videos showing the issue.",
      "Our team will review the request and guide you with repair, replacement, or resolution.",
    ],
  },
];

const claimPoints = [
  "Warranty starts from the original date of purchase.",
  "Original invoice or order confirmation is required.",
  "Product must be inspected before claim approval.",
  "Approved claims may be repaired, replaced, or resolved as per company policy.",
];

export default function WarrantyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(120,120,120,0.18),transparent_38%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <div className="relative mx-auto max-w-[1280px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="animate-[fadeUp_0.7s_ease-out]">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur">
                <FiZap className="text-[14px]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                  Trendz AeroX Warranty
                </p>
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
                6-month protection for your tech.
              </h1>

              <div className="mt-8 max-w-2xl space-y-5 text-[15px] leading-8 text-white/68 sm:text-[16px]">
                <p>
                  Trendz AeroX products are covered by a 6-month warranty from
                  the date of purchase against approved manufacturing defects.
                </p>

                <p>
                  This policy explains what is covered, what is not covered,
                  and how customers can raise a warranty claim.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="group inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black transition hover:bg-white/90"
                >
                  Shop AeroX Products
                  <FiArrowRight className="ml-2 text-[16px] transition group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white/5 px-6 py-3 text-[14px] font-medium text-white transition hover:bg-white/10"
                >
                  Contact Support
                </Link>
              </div>
            </div>

            <div className="animate-[fadeIn_0.9s_ease-out] rounded-[28px] border border-white/12 bg-white/[0.06] p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                  <FiShield className="text-[20px]" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                    Warranty Overview
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-white">
                    Manufacturing defect support
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {warrantySections.map((section, index) => {
                  const Icon = section.icon;

                  return (
                    <div
                      key={section.title}
                      className="animate-[fadeUp_0.7s_ease-out] rounded-2xl border border-white/10 bg-black/35 p-5 transition hover:border-white/20 hover:bg-black/50"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                          <Icon className="text-[17px]" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                            {section.title}
                          </p>

                          <ul className="mt-3 space-y-2">
                            {section.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-2 text-[14px] leading-7 text-white/72"
                              >
                                <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-white" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#0b0b0b]">
        <div className="mx-auto max-w-[1280px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="animate-[fadeUp_0.7s_ease-out]">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/5">
                <FiTool className="text-[20px]" />
              </div>

              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Claim Requirements
              </p>

              <h2 className="mt-3 text-[30px] font-semibold tracking-[-0.03em] text-white sm:text-[36px]">
                Fast support. Clear process.
              </h2>

              <p className="mt-4 max-w-xl text-[15px] leading-7 text-white/60">
                To raise a warranty claim, please contact our support team with
                your order details, invoice, and clear proof of the issue.
              </p>
            </div>

            <div className="animate-[fadeIn_0.9s_ease-out] rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-7">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                  <FiFileText className="text-[20px]" />
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    Important Notes
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-white">
                    Before raising a claim
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                {claimPoints.map((item, index) => (
                  <div
                    key={item}
                    className="animate-[fadeUp_0.7s_ease-out] flex items-start gap-3 rounded-2xl border border-white/10 bg-black/35 px-4 py-4 transition hover:border-white/20 hover:bg-black/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-black">
                      {index + 1}
                    </span>

                    <p className="text-[14px] leading-7 text-white/72">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-start gap-3">
                  <FiCheckCircle className="mt-1 shrink-0 text-[18px] text-white" />
                  <p className="text-[14px] leading-7 text-white/65">
                    Final warranty approval depends on inspection by the Trendz
                    AeroX support team. Resolution may include repair,
                    replacement, or another suitable solution as per company
                    policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeUp {
          0% {
            opacity: 0;
            transform: translateY(24px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}