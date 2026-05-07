import { useState } from "react";
import { Check, ShieldCheck, History, Zap } from "lucide-react";

type BillingPeriod = "bulanan" | "3bulan" | "6bulan" | "12bulan";

const billingOptions: { key: BillingPeriod; label: string; discount: number }[] = [
  { key: "bulanan", label: "BULANAN", discount: 0 },
  { key: "3bulan", label: "3 BULAN", discount: 5 },
  { key: "6bulan", label: "6 BULAN", discount: 15 },
  { key: "12bulan", label: "12 BULAN", discount: 25 },
];

const plans = [
  {
    id: "pro",
    badge: "BEST VALUE",
    badgeStyle: "dark",
    name: "PRO",
    basePrice: 799000,
    isFree: false,
    tagline: "Untuk agensi besar & tim sales profesional",
    features: [
      "Unlimited campaigns & leads",
      "AI draft WA personal per bisnis",
      "CRM Pipeline Kanban",
      "WA Blast Template",
      "Multi Workspace",
      "White-label Report PDF",
      "API Access",
      "Priority Support 24 jam",
    ],
    cta: "Maksimalkan dengan PRO",
    ctaStyle: "dark",
    highlight: false,
  },
  {
    id: "growth",
    badge: "PALING POPULER",
    badgeStyle: "indigo",
    name: "GROWTH",
    basePrice: 349000,
    isFree: false,
    tagline: "Untuk agensi kecil & tim sales aktif",
    features: [
      "Unlimited campaigns",
      "100 leads berkualitas per bulan",
      "AI draft WA personal per bisnis",
      "CRM Pipeline Kanban",
      "WA Blast Template",
      "Sentiment Tracker",
      "Email + WA Support",
    ],
    cta: "Pilih Growth",
    ctaStyle: "indigo",
    highlight: true,
  },
  {
    id: "starter",
    badge: null,
    badgeStyle: null,
    name: "STARTER",
    basePrice: 149000,
    isFree: false,
    tagline: "Untuk freelancer & sales solo",
    features: [
      "10 campaigns per bulan",
      "50 leads berkualitas per bulan",
      "AI draft WA personal per bisnis",
      "Lead score + pain detection",
      "Export CSV tanpa watermark",
      "Email Support",
    ],
    cta: "Mulai dengan Starter",
    ctaStyle: "outline",
    highlight: false,
  },
  {
    id: "free",
    badge: "COBA GRATIS",
    badgeStyle: "muted",
    name: "COBA GRATIS",
    basePrice: 0,
    isFree: true,
    tagline: "Rasakan kualitas intelligence kami",
    features: [
      "1 campaign gratis selamanya",
      "10 leads dengan score & pain detection",
      "Tanpa batas waktu trial",
    ],
    cta: "Coba 1 Campaign Gratis",
    ctaStyle: "outline",
    highlight: false,
  },
];

function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}

function getDiscountedPrice(base: number, discount: number) {
  return Math.round((base * (100 - discount)) / 100 / 1000) * 1000;
}

export function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("bulanan");

  const currentBilling = billingOptions.find((b) => b.key === billing)!;

  return (
    <div
      className="min-h-full w-full"
      style={{ background: "#FAFBFC", color: "#0F1F3D" }}
    >
      {/* ── Top Bar ── */}
      <div className="flex justify-end px-8 pt-6">
        <button
          className="flex items-center gap-2 px-4 py-2 transition-colors"
          style={{
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            background: "#FFFFFF",
            color: "#0F1F3D",
            fontSize: "13px",
            fontWeight: 500,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.background = "#FFFFFF")
          }
        >
          <History size={14} style={{ color: "#64748B" }} />
          Riwayat Pembayaran
        </button>
      </div>

      {/* ── Hero ── */}
      <div className="text-center px-8 pt-8 pb-6">
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: "#0F1F3D",
            lineHeight: 1.25,
            marginBottom: "14px",
          }}
        >
          Investasi yang Menghasilkan,
          <br />
          Bukan Pengeluaran
        </h1>
        <p style={{ color: "#64748B", fontSize: "15px", maxWidth: "480px", margin: "0 auto" }}>
          Satu hot lead yang closing sudah menutup biaya langganan satu tahun.
          Sisanya adalah profit murni.
        </p>
      </div>

      {/* ── Billing Toggle ── */}
      <div className="flex flex-col items-center gap-2 pb-8">
        <div
          className="flex items-center p-1"
          style={{
            background: "#F1F5F9",
            borderRadius: "8px",
            border: "1px solid #E2E8F0",
          }}
        >
          {billingOptions.map((opt) => {
            const active = billing === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setBilling(opt.key)}
                className="relative flex items-center gap-1.5 px-4 py-2 transition-all"
                style={{
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.4px",
                  background: active ? "#0F1F3D" : "transparent",
                  color: active ? "#FFFFFF" : "#64748B",
                  border: "none",
                }}
              >
                {opt.label}
                {opt.discount > 0 && (
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      background: active ? "#4F46E5" : "#DBEAFE",
                      color: active ? "#FFFFFF" : "#3B82F6",
                      borderRadius: "4px",
                      padding: "1px 5px",
                    }}
                  >
                    -{opt.discount}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Pricing Cards ── */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const discountedPrice = plan.isFree
              ? 0
              : getDiscountedPrice(plan.basePrice, currentBilling.discount);
            const saving =
              !plan.isFree && currentBilling.discount > 0
                ? plan.basePrice - discountedPrice
                : 0;

            return (
              <div
                key={plan.id}
                className="flex flex-col relative"
                style={{
                  background: "#FFFFFF",
                  border: plan.highlight
                    ? "2px solid #4F46E5"
                    : "1px solid #E2E8F0",
                  borderRadius: "8px",
                  padding: "0",
                  overflow: "visible",
                }}
              >
                {/* Badge */}
                <div className="flex justify-center" style={{ height: "28px" }}>
                  {plan.badge && (
                    <div
                      className="flex items-center justify-center px-3"
                      style={{
                        position: "relative",
                        top: "-14px",
                        height: "26px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.5px",
                        background:
                          plan.badgeStyle === "dark"
                            ? "#0F1F3D"
                            : plan.badgeStyle === "indigo"
                            ? "#4F46E5"
                            : plan.badgeStyle === "muted"
                            ? "#F1F5F9"
                            : "#F1F5F9",
                        color:
                          plan.badgeStyle === "dark" || plan.badgeStyle === "indigo"
                            ? "#FFFFFF"
                            : "#64748B",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {plan.badgeStyle === "indigo" && (
                        <Zap size={10} className="mr-1" />
                      )}
                      {plan.badge}
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 px-5 pb-5">
                  {/* Plan label */}
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "0.6px",
                      color: plan.highlight ? "#4F46E5" : "#94A3B8",
                      marginBottom: "10px",
                    }}
                  >
                    {plan.name}
                  </p>

                  {/* Price */}
                  <div className="mb-1">
                    {plan.isFree ? (
                      <p
                        style={{
                          fontSize: "36px",
                          fontWeight: 700,
                          color: "#0F1F3D",
                          lineHeight: 1.1,
                        }}
                      >
                        Gratis
                      </p>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span
                          style={{
                            fontSize: "26px",
                            fontWeight: 700,
                            color: plan.highlight ? "#4F46E5" : "#0F1F3D",
                            lineHeight: 1.1,
                          }}
                        >
                          {formatRupiah(discountedPrice)}
                        </span>
                        <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 500 }}>
                          / bln
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Savings badge */}
                  {saving > 0 && (
                    <div className="mb-2">
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#16A34A",
                          background: "#F0FDF4",
                          borderRadius: "4px",
                          padding: "2px 7px",
                        }}
                      >
                        Hemat {formatRupiah(saving * (billing === "12bulan" ? 12 : billing === "6bulan" ? 6 : 3))} / tahun
                      </span>
                    </div>
                  )}

                  {/* Tagline */}
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#64748B",
                      marginBottom: "18px",
                      lineHeight: 1.4,
                      minHeight: "36px",
                    }}
                  >
                    {plan.tagline}
                  </p>

                  {/* Divider */}
                  <div
                    style={{
                      borderTop: "1px solid #F1F5F9",
                      marginBottom: "16px",
                    }}
                  />

                  {/* Features */}
                  <ul className="flex flex-col gap-2.5 flex-1 mb-5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2">
                        <div
                          className="flex-shrink-0 flex items-center justify-center mt-0.5"
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            background: plan.highlight ? "#EEF2FF" : "#F1F5F9",
                          }}
                        >
                          <Check
                            size={10}
                            strokeWidth={3}
                            style={{ color: plan.highlight ? "#4F46E5" : "#64748B" }}
                          />
                        </div>
                        <span style={{ fontSize: "12.5px", color: "#374151", lineHeight: 1.4 }}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className="w-full py-3 transition-all"
                    style={{
                      borderRadius: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.2px",
                      ...(plan.ctaStyle === "dark"
                        ? {
                            background: "#0F1F3D",
                            color: "#FFFFFF",
                            border: "none",
                          }
                        : plan.ctaStyle === "indigo"
                        ? {
                            background: "#4F46E5",
                            color: "#FFFFFF",
                            border: "none",
                          }
                        : {
                            background: "#FFFFFF",
                            color: "#0F1F3D",
                            border: "1.5px solid #CBD5E1",
                          }),
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      if (plan.ctaStyle === "dark") el.style.background = "#1a2f52";
                      else if (plan.ctaStyle === "indigo") el.style.background = "#4338CA";
                      else el.style.background = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      if (plan.ctaStyle === "dark") el.style.background = "#0F1F3D";
                      else if (plan.ctaStyle === "indigo") el.style.background = "#4F46E5";
                      else el.style.background = "#FFFFFF";
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Trust Section ── */}
      <div className="px-6 pb-6">
        <div
          className="flex items-center justify-between max-w-6xl mx-auto px-6 py-4"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width: "40px",
                height: "40px",
                background: "#EEF2FF",
                borderRadius: "8px",
              }}
            >
              <ShieldCheck size={20} style={{ color: "#4F46E5" }} />
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#0F1F3D", marginBottom: "2px" }}>
                Jaminan Transaksi Aman
              </p>
              <p style={{ fontSize: "12.5px", color: "#64748B" }}>
                Sistem pembayaran terenkripsi. Kontrak Enterprise tersedia atas permintaan melalui tim sales.
              </p>
            </div>
          </div>

          {/* Payment logos */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* GPN logo */}
            <div
              className="flex items-center justify-center px-3 py-1.5"
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                background: "#F8FAFC",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F1F3D", letterSpacing: "0.5px" }}>
                GPN
              </span>
            </div>
            {/* Mandiri logo */}
            <div
              className="flex items-center justify-center px-3 py-1.5"
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                background: "#F8FAFC",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#003087", letterSpacing: "0.5px" }}>
                Mandiri
              </span>
            </div>
            {/* BCA logo */}
            <div
              className="flex items-center justify-center px-3 py-1.5"
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                background: "#F8FAFC",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#0060AE", letterSpacing: "0.5px" }}>
                BCA
              </span>
            </div>
            {/* BNI logo */}
            <div
              className="flex items-center justify-center px-3 py-1.5"
              style={{
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                background: "#F8FAFC",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#F26522", letterSpacing: "0.5px" }}>
                BNI
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}