import React from "react";
import { useNavigate } from "react-router";
import {
  Database,
  BrainCircuit,
  Send,
  TrendingUp,
  BarChart2,
  CreditCard,
  Settings,
  ArrowRight,
  Construction,
} from "lucide-react";

const iconMap: Record<string, React.FC<{ size?: number; style?: React.CSSProperties }>> = {
  database: Database,
  brain: BrainCircuit,
  send: Send,
  "trending-up": TrendingUp,
  "bar-chart": BarChart2,
  "credit-card": CreditCard,
  settings: Settings,
};

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  const navigate = useNavigate();
  const IconComponent = iconMap[icon] || Construction;

  return (
    <div className="p-8" style={{ color: "#0F1F3D" }}>
      {/* Header */}
      <div className="mb-8">
        <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 600, marginBottom: "4px" }}>
          {title}
        </h1>
        <p style={{ color: "#8A97A8", fontSize: "14px" }}>{description}</p>
      </div>

      {/* Empty State */}
      <div
        className="flex flex-col items-center justify-center py-28"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
        }}
      >
        <div
          className="w-16 h-16 flex items-center justify-center mb-5"
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "12px",
          }}
        >
          <IconComponent size={26} style={{ color: "#8A97A8" }} />
        </div>
        <p
          style={{
            color: "#0F1F3D",
            fontSize: "16px",
            fontWeight: 600,
            marginBottom: "8px",
          }}
        >
          {title} — Segera Hadir
        </p>
        <p
          style={{
            color: "#8A97A8",
            fontSize: "14px",
            textAlign: "center",
            maxWidth: "400px",
            lineHeight: 1.6,
          }}
        >
          Fitur ini sedang dalam pengembangan aktif. Tim kami bekerja keras untuk menghadirkan pengalaman terbaik bagi Anda.
        </p>

        <div className="flex items-center gap-3 mt-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2.5 transition-all hover:opacity-80"
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#4A5568",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Kembali ke Dashboard
          </button>
          <button
            onClick={() => navigate("/new-search")}
            className="flex items-center gap-2 px-4 py-2.5 transition-all hover:opacity-80"
            style={{
              background: "#0F1F3D",
              color: "#FFFFFF",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            Coba Pencarian Leads
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}