import Link from "next/link";
import {
  FiShield,
  FiLock,
  FiMessageSquare,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";

export const metadata = {
  title: "Privacy Policy | Trendz Firenze",
  description:
    "Read the Trendz Firenze privacy policy and learn how we protect your personal data and use your information responsibly.",
};

const privacySections = [
  {
    icon: FiLock,
    title: "Data Security",
    items: ["Your personal data is kept secure."],
  },
  {
    icon: FiMessageSquare,
    title: "How Information Is Used",
    items: [
      "Information is only used for order processing and communication.",
    ],
  },
  {
    icon: FiUsers,
    title: "Third-Party Sharing",
    items: [
      "We do not sell or share your data with third parties.",
    ],
  },
];

const privacyPoints = [
  "We collect only the information necessary to support your orders and communication.",
  "We take reasonable measures to protect your information from unauthorized access.",
  "Your privacy remains a priority throughout your experience with Trendz Firenze.",
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-[#111111]">
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="animate-[fadeUp_0.7s_ease-out]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
              Privacy Policy
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Your privacy matters.
            </h1>

            <div className="mt-8 max-w-2xl space-y-5 text-[15px] leading-8 text-[#555555] sm:text-[16px]">
              <p>
                Your privacy is important to us. We are committed to handling
                your personal information responsibly and with care.
              </p>

              <p>
                Trendz Firenze is focused on maintaining trust by using customer
                information only where necessary to support orders,
                communication, and service-related assistance.
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
                href="/shipping-policy"
                className="inline-flex items-center justify-center rounded-full border border-[#d9d9d9] px-6 py-3 text-[14px] font-medium text-[#111111] transition hover:bg-[#f8f8f8]"
              >
                Shipping Policy
              </Link>
            </div>
          </div>

          <div className="mt-6 lg:mt-0 animate-[fadeIn_0.9s_ease-out] rounded-[24px] border border-[#ececec] bg-[#fafafa] p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-white">
                <FiShield className="text-[18px]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7a7a7a]">
                  Privacy Overview
                </p>
                <p className="mt-1 text-[18px] font-semibold text-[#111111]">
                  Responsible data handling
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {privacySections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.title}
                    className="animate-[fadeUp_0.7s_ease-out] rounded-2xl border border-[#ededed] bg-white p-5"
                    style={{ animationDelay: `${index * 100}ms` }}
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
                Our Commitment
              </p>
              <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
                Simple, clear, and respectful privacy practices.
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#5a5a5a]">
                We believe customer trust is built through transparency and
                responsible handling of personal information.
              </p>
            </div>

            <div className="animate-[fadeIn_0.9s_ease-out] rounded-[24px] border border-[#ececec] bg-white p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7a7a]">
                Key Privacy Points
              </p>

              <div className="mt-5 grid gap-3">
                {privacyPoints.map((item, index) => (
                  <div
                    key={item}
                    className="animate-[fadeUp_0.7s_ease-out] flex items-start gap-3 rounded-2xl border border-[#ededed] bg-[#fafafa] px-4 py-4"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-[12px] font-medium text-white">
                      {index + 1}
                    </span>
                    <p className="text-[15px] leading-7 text-[#222222]">{item}</p>
                  </div>
                ))}
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