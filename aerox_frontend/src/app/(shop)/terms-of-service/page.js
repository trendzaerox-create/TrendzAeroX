import Link from "next/link";
import {
  FiFileText,
  FiSettings,
  FiBox,
  FiShoppingBag,
  FiCreditCard,
  FiTruck,
  FiRefreshCcw,
  FiShield,
  FiAlertCircle,
  FiMail,
  FiPhone,
  FiArrowRight,
} from "react-icons/fi";

export const metadata = {
  title: "Terms of Service | Trendz Firenze",
  description:
    "Read the Trendz Firenze Terms of Service covering website usage, products, pricing, orders, payments, shipping, refunds, intellectual property, and liability.",
};

const serviceSections = [
  {
    icon: FiSettings,
    title: "General",
    items: [
      "Trendz Firenze reserves the right to update or modify these terms at any time",
      "Continued use of the website constitutes acceptance of updated terms",
    ],
  },
  {
    icon: FiBox,
    title: "Products & Pricing",
    items: [
      "All products are subject to availability",
      "Prices may change without prior notice",
      "We strive for accuracy but do not guarantee that product descriptions or images are error-free",
    ],
  },
  {
    icon: FiShoppingBag,
    title: "Orders",
    items: [
      "We reserve the right to accept or cancel any order",
      "Orders may be canceled due to product unavailability",
      "Orders may be canceled due to pricing errors",
      "Orders may be canceled due to suspicious or fraudulent activity",
    ],
  },
  {
    icon: FiCreditCard,
    title: "Payments",
    items: [
      "We accept multiple payment methods including online payments and Cash on Delivery (COD)",
      "All transactions are processed securely",
    ],
  },
  {
    icon: FiTruck,
    title: "Shipping",
    items: [
      "Shipping timelines are estimates and may vary due to external factors",
      "Delays caused by courier partners or unforeseen circumstances are not the responsibility of Trendz Firenze",
    ],
  },
  {
    icon: FiRefreshCcw,
    title: "Returns & Refunds",
    items: [
      "Returns and refunds are governed by our Refund Policy",
      "Customers must follow the defined process for eligibility",
    ],
  },
  {
    icon: FiShield,
    title: "Intellectual Property",
    items: [
      "All content on this website (images, logos, text, designs) is the property of Trendz Firenze",
      "Unauthorized use or reproduction is strictly prohibited",
    ],
  },
  {
    icon: FiAlertCircle,
    title: "Limitation of Liability",
    items: [
      "Trendz Firenze shall not be liable for any indirect or incidental damages arising from the use of our website or products",
    ],
  },
];

const contactItems = [
  {
    icon: FiMail,
    label: "Email Support",
    value: "support@trendzfirenze.com",
    href: "mailto:support@trendzfirenze.com",
  },
  {
    icon: FiPhone,
    label: "Phone Support",
    value: "+91 91233 15539",
    href: "tel:+919123315539",
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="bg-white text-[#111111]">
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
              Terms of Service
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Terms for using our website and services.
            </h1>

            <div className="mt-8 max-w-2xl space-y-5 text-[15px] leading-8 text-[#555555] sm:text-[16px]">
              <p>
                Welcome to Trendz Firenze. By accessing or using our website, you
                agree to comply with the following terms and conditions.
              </p>

              <p>
                These terms are intended to provide a clear framework for website
                usage, purchases, payments, shipping, returns, and customer
                responsibilities.
              </p>
            </div>

            <div className="mt-10 mb-14 flex flex-wrap gap-4 sm:mb-16">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[14px] font-medium text-white transition hover:bg-[#222222]"
              >
                Contact Us
                <FiArrowRight className="ml-2 text-[16px]" />
              </Link>

              <Link
                href="/refund-policy"
                className="inline-flex items-center justify-center rounded-full border border-[#d9d9d9] px-6 py-3 text-[14px] font-medium text-[#111111] transition hover:bg-[#f8f8f8]"
              >
                Refund Policy
              </Link>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 animate-[fadeIn_0.9s_ease-out] rounded-[24px] border border-[#ececec] bg-[#fafafa] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-white">
                <FiFileText className="text-[18px]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
                  Service Overview
                </p>
                <p className="mt-1 text-[18px] font-semibold text-[#111111]">
                  Clear policies and fair use
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {serviceSections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.title}
                    className="animate-[fadeUp_0.7s_ease-out] rounded-2xl border border-[#ededed] bg-white p-5"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
                        <Icon className="text-[17px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
                          {section.title}
                        </p>

                        <ul className="mt-3 space-y-2">
                          {section.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-[15px] leading-7 text-[#333333]"
                            >
                              <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#111111]" />
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
      </section>

      <section className="border-t border-[#efefef] bg-[#fcfcfc]">
        <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="animate-[fadeUp_0.7s_ease-out]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]">
                Contact Information
              </p>
              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
                Questions about these terms?
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#5a5a5a]">
                For any questions regarding these Terms of Service, you can reach
                our support team through the contact details below.
              </p>
            </div>

            <div className="animate-[fadeIn_0.9s_ease-out] rounded-[24px] border border-[#ececec] bg-white p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
                Support Details
              </p>

              <div className="mt-5 space-y-3">
                {contactItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className="animate-[fadeUp_0.7s_ease-out] flex items-center gap-4 rounded-2xl border border-[#ededed] bg-[#fafafa] px-4 py-4 transition hover:bg-white"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
                        <Icon className="text-[17px]" />
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7a7a7a]">
                          {item.label}
                        </p>
                        <p className="mt-1 text-[15px] font-medium text-[#222222]">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  );
                })}
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