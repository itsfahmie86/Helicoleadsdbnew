import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  FileText,
  TrendingUp,
  Flame,
  Thermometer,
  Snowflake,
  Star,
} from "lucide-react";
import { AddToCampaignModal } from "./AddToCampaignModal";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Lead {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  reviews: number;
  painScore: number;
  badge: string;
  potential: string;
  initials: string;
  color: string;
  colorBg: string;
}

interface AIData {
  sentiment: "Negatif" | "Campuran" | "Positif";
  aspects: { name: string; score: number; emoji: string }[];
  painPoints: string[];
  opportunities: string[];
  narrative: string;
}

// ─── AI Intelligence Data per Lead ────────────────────────────────────────────
const AI_DATA: Record<number, AIData> = {
  1: {
    sentiment: "Negatif",
    aspects: [
      { name: "Sistem Antrian", score: 12, emoji: "👥" },
      { name: "Kecepatan Pelayanan", score: 18, emoji: "⚡" },
      { name: "Ketersediaan Menu", score: 42, emoji: "🍽️" },
      { name: "Kebersihan", score: 70, emoji: "🧹" },
      { name: "Harga", score: 78, emoji: "💰" },
      { name: "Rasa & Kualitas", score: 85, emoji: "⭐" },
    ],
    painPoints: [
      "Antrian panjang tanpa sistem nomor atau estimasi waktu yang jelas",
      "Menu andalan sering habis sebelum jam 11 siang",
      "Tidak ada pemesanan online atau WhatsApp pre-order",
      "Waktu tunggu bisa mencapai 30–45 menit saat jam makan siang",
      "Tidak ada informasi real-time stok menu kepada pelanggan",
    ],
    opportunities: [
      "Implementasi sistem pre-order via WhatsApp Business untuk menu harian",
      "Pasang papan digital + WA broadcast informasi ketersediaan menu pagi hari",
      "Tambahkan layanan pesan antar area sekitar radius 2 km",
      "Buat sistem antrian digital dengan notifikasi perkiraan waktu siap",
      "Tawarkan paket katering harian untuk kantor-kantor terdekat",
    ],
    narrative:
      "Warung Nasi Bu Imas memiliki fondasi produk yang kuat — rasa dan harga diakui baik oleh mayoritas pelanggan. Namun operasional yang tidak terstruktur menciptakan gesekan tinggi pada pengalaman pelanggan. Antrian yang tidak terkelola dan kehabisan menu adalah sinyal kuat bahwa demand melebihi kapasitas manajerial, bukan fisik. Bisnis ini adalah kandidat ideal untuk solusi manajemen pesanan digital yang sederhana dan cepat diterapkan.",
  },
  2: {
    sentiment: "Negatif",
    aspects: [
      { name: "Sistem Notifikasi", score: 18, emoji: "🔔" },
      { name: "Ketepatan Pakaian", score: 22, emoji: "👕" },
      { name: "Pelayanan Staff", score: 40, emoji: "🤝" },
      { name: "Kebersihan Hasil", score: 65, emoji: "✨" },
      { name: "Kecepatan Proses", score: 55, emoji: "⚡" },
      { name: "Harga", score: 68, emoji: "💰" },
    ],
    painPoints: [
      "Pakaian pelanggan sering tertukar — menyebabkan ketidakpercayaan serius",
      "Tidak ada sistem notifikasi saat laundry selesai diproses",
      "Pelanggan harus datang sendiri untuk mengecek status cucian",
      "Tidak ada label atau kode unik per order untuk identifikasi pakaian",
      "Komplain tertukar pakaian membutuhkan waktu lama untuk diselesaikan",
    ],
    opportunities: [
      "Implementasi label barcode / QR unik per pelanggan untuk setiap order",
      "Aktifkan notifikasi WhatsApp otomatis saat cucian selesai & siap diambil",
      "Buat chatbot WA sederhana untuk tracking status laundry secara mandiri",
      "Sediakan layanan pickup & delivery dengan slot waktu yang bisa dipilih pelanggan",
      "Tawarkan garansi 'pakaian tertukar = gratis' untuk membangun kepercayaan ulang",
    ],
    narrative:
      "Laundry Cepat Express menghadapi krisis kepercayaan yang bisa mengancam retensi pelanggan jangka panjang. Masalah pakaian tertukar bukan sekadar keluhan operasional — ini sinyal kelemahan sistem identifikasi yang fundamental. Peluang terbesar ada di digitalisasi proses tracking dan komunikasi proaktif melalui WhatsApp, yang dapat mengubah pengalaman pelanggan secara drastis tanpa investasi infrastruktur yang besar.",
  },
  3: {
    sentiment: "Negatif",
    aspects: [
      { name: "Waktu Tunggu", score: 12, emoji: "⏱️" },
      { name: "Sistem Booking", score: 18, emoji: "📅" },
      { name: "Harga Terjangkau", score: 52, emoji: "💰" },
      { name: "Lokasi & Akses", score: 68, emoji: "📍" },
      { name: "Kualitas Medis", score: 80, emoji: "💊" },
      { name: "Kebersihan Klinik", score: 85, emoji: "🏥" },
    ],
    painPoints: [
      "Waktu tunggu rata-rata 2–3 jam membuat pasien frustasi dan meninggalkan klinik",
      "Tidak tersedia sistem booking online atau via aplikasi apapun",
      "Tidak ada estimasi waktu antrian yang diberikan kepada pasien saat mendaftar",
      "Pasien harus datang fisik hanya untuk mendaftar nomor antrian",
      "Tidak ada pembagian jadwal dokter yang transparan untuk diakses pasien",
    ],
    opportunities: [
      "Implementasi sistem booking online via WhatsApp atau form Google sederhana",
      "Pasang display antrian digital dengan estimasi waktu tunggu di ruang tunggu",
      "Buat layanan konsultasi online / telemedicine untuk kasus non-darurat",
      "Kirim reminder otomatis H-1 dan H-3 jam sebelum jadwal konsultasi pasien",
      "Tawarkan paket medical check-up dengan booking prioritas untuk klien korporat",
    ],
    narrative:
      "Klinik Sehat Utama memiliki kualitas medis dan fasilitas yang diakui baik oleh pasien, namun sistem manajemen antrian yang primitif menciptakan pengalaman pra dan pasca pelayanan yang sangat buruk. Dengan potensi revenue tertinggi di antara leads Anda (Rp 32 juta), klinik ini adalah prioritas tinggi. Solusi booking digital bahkan yang sederhana sekalipun akan berdampak langsung pada rating dan retensi pasien.",
  },
  4: {
    sentiment: "Campuran",
    aspects: [
      { name: "Update Status Servis", score: 28, emoji: "📱" },
      { name: "Transparansi Harga", score: 30, emoji: "💰" },
      { name: "Komunikasi", score: 38, emoji: "💬" },
      { name: "Kecepatan Kerja", score: 60, emoji: "⚡" },
      { name: "Lokasi & Akses", score: 72, emoji: "📍" },
      { name: "Kualitas Servis", score: 75, emoji: "🔧" },
    ],
    painPoints: [
      "Estimasi biaya diberikan di awal tapi sering berubah tanpa pemberitahuan",
      "Pelanggan tidak mendapat update status perbaikan selama kendaraan di bengkel",
      "Tidak ada struk digital atau invoice yang detail dan transparan",
      "Penjelasan teknis ke pelanggan awam sering tidak memadai",
      "Tidak ada sistem penjadwalan yang bisa diakses dari luar bengkel",
    ],
    opportunities: [
      "Kirim update status servis via WhatsApp di setiap tahap pengerjaan",
      "Sediakan estimasi harga digital yang bisa disetujui pelanggan sebelum dikerjakan",
      "Buat paket servis berkala (tune-up, ganti oli) dengan harga transparan + booking online",
      "Implementasi invoice digital yang dikirim ke WhatsApp pelanggan setelah selesai",
      "Tawarkan layanan antar-jemput kendaraan untuk area radius 5 km",
    ],
    narrative:
      "Bengkel Maju Bersama memiliki kualitas teknis yang cukup baik namun kehilangan kepercayaan akibat lemahnya komunikasi dan transparansi harga. Di industri otomotif, trust adalah currency utama. Pelanggan yang merasa tidak diinformasikan soal harga atau status kendaraan cenderung tidak kembali meski kualitas servisnya bagus. Peluang terbesar ada di membangun transparency layer sederhana melalui WhatsApp.",
  },
  5: {
    sentiment: "Campuran",
    aspects: [
      { name: "Konsistensi Jam Buka", score: 32, emoji: "🕐" },
      { name: "Sistem Booking", score: 38, emoji: "📅" },
      { name: "Harga", score: 65, emoji: "💰" },
      { name: "Keramahan Staff", score: 75, emoji: "😊" },
      { name: "Kualitas Layanan", score: 80, emoji: "✂️" },
      { name: "Kebersihan Alat", score: 82, emoji: "🧹" },
    ],
    painPoints: [
      "Jam operasional tidak konsisten — sering tutup mendadak tanpa pemberitahuan",
      "Tidak ada sistem booking yang bisa dilakukan dari luar salon",
      "Stylist favorit pelanggan sering tidak available karena tidak ada manajemen jadwal",
      "Pelanggan datang jauh-jauh hanya untuk diberitahu penuh atau tutup",
      "Tidak ada update promosi atau slot kosong yang disebarkan secara aktif",
    ],
    opportunities: [
      "Buat sistem booking online sederhana via WhatsApp Business atau form Google",
      "Jadwalkan broadcast mingguan ke pelanggan loyal soal slot kosong & promo spesial",
      "Update jadwal buka/tutup dan jadwal stylist di Google Business secara real-time",
      "Tawarkan membership bulanan dengan prioritas booking untuk pelanggan tetap",
      "Aktifkan Instagram/TikTok untuk showcase hasil kerja dan drive booking organik",
    ],
    narrative:
      "Salon Cantik Permata memiliki kualitas layanan yang solid — pelanggan yang berhasil mendapat pelayanan puas dengan hasilnya. Problem utama bukan pada skill, melainkan pada aksesibilitas dan prediktabilitas. Pelanggan tidak bisa mempercayakan waktu mereka ke bisnis yang jam bukanya tidak dapat diandalkan. Solusi scheduling dan komunikasi proaktif akan langsung meningkatkan frekuensi kunjungan dan retensi pelanggan setia.",
  },
  6: {
    sentiment: "Campuran",
    aspects: [
      { name: "Layanan Pengiriman", score: 18, emoji: "🚚" },
      { name: "Stok Online vs Fisik", score: 25, emoji: "📦" },
      { name: "Pelayanan Staff", score: 68, emoji: "🤝" },
      { name: "Harga Kompetitif", score: 72, emoji: "💰" },
      { name: "Kelengkapan Produk", score: 78, emoji: "🏪" },
      { name: "Kualitas Produk", score: 85, emoji: "⭐" },
    ],
    painPoints: [
      "Data stok di toko online tidak sinkron dengan stok fisik toko",
      "Tidak tersedia layanan pengiriman ke lokasi proyek pelanggan",
      "Pelanggan harus datang fisik untuk mengecek ketersediaan material",
      "Tidak ada sistem pre-order untuk material yang akan segera datang",
      "Tidak ada konsultasi material online untuk pelanggan yang merancang renovasi",
    ],
    opportunities: [
      "Sinkronisasi stok real-time antara sistem fisik dan marketplace / toko online",
      "Luncurkan layanan antar material dengan pick-up untuk area radius 10 km",
      "Buat channel konsultasi material via WhatsApp untuk kontraktor & individu",
      "Tawarkan kontrak supply untuk kontraktor dengan harga khusus + pengiriman terjadwal",
      "Aktifkan fitur pre-order untuk material habis dengan estimasi stok masuk",
    ],
    narrative:
      "Toko Bangunan Surya memiliki keunggulan kompetitif yang jelas — kualitas dan kelengkapan produk diakui baik. Namun mereka kehilangan transaksi secara masif akibat tidak adanya layanan pengiriman dan ketidakakuratan informasi stok online. Di era kontraktor dan DIY renovator yang memutuskan pembelian lewat smartphone, absennya delivery dan stok digital real-time adalah peluang yang sudah siap dimonetisasi sekarang.",
  },
  7: {
    sentiment: "Campuran",
    aspects: [
      { name: "Ketersediaan Obat", score: 38, emoji: "💊" },
      { name: "Kecepatan Kasir", score: 42, emoji: "⚡" },
      { name: "Jam Operasional", score: 70, emoji: "🕐" },
      { name: "Harga", score: 72, emoji: "💰" },
      { name: "Pelayanan Apoteker", score: 78, emoji: "👨‍⚕️" },
      { name: "Kebersihan", score: 88, emoji: "🧹" },
    ],
    painPoints: [
      "Obat umum (paracetamol, vitamin C) sering kosong di jam sibuk",
      "Antrian kasir lambat terutama saat proses klaim BPJS / asuransi",
      "Tidak ada sistem pengecekan ketersediaan obat via telepon atau WhatsApp",
      "Pelanggan harus mencari apotek lain saat stok kosong tanpa referensi apotek terdekat",
      "Tidak ada program loyalitas untuk pembelian rutin / obat kronis",
    ],
    opportunities: [
      "Aktifkan layanan pengecekan stok obat via WhatsApp sebelum pelanggan datang",
      "Implementasi sistem reservasi obat untuk pelanggan rutin dengan resep berulang",
      "Tawarkan layanan antar obat ke rumah untuk radius 2–3 km dengan ongkir ringan",
      "Buat program loyalty points untuk pembelian rutin, terutama obat kronis",
      "Sediakan konsultasi singkat via WhatsApp dengan apoteker untuk pertanyaan umum",
    ],
    narrative:
      "Apotek Sehat Selalu memiliki keunggulan di kebersihan dan kualitas pelayanan apoteker yang konsisten diakui pelanggan. Friction utama ada di manajemen stok dan kecepatan kasir yang mengurangi kemudahan akses. Dengan tren healthcare-at-home yang meningkat, apotek yang bisa menawarkan kemudahan reservasi dan pengiriman obat memiliki keunggulan kompetitif signifikan di area Jakarta Timur.",
  },
  8: {
    sentiment: "Campuran",
    aspects: [
      { name: "Koneksi WiFi", score: 28, emoji: "📶" },
      { name: "Menu Digital", score: 38, emoji: "📱" },
      { name: "Harga", score: 68, emoji: "💰" },
      { name: "Pelayanan", score: 80, emoji: "🤝" },
      { name: "Kualitas Minuman", score: 85, emoji: "☕" },
      { name: "Suasana & Ambiance", score: 90, emoji: "🌿" },
    ],
    painPoints: [
      "WiFi yang tidak stabil mengganggu pelanggan yang bekerja remote",
      "Tidak ada menu digital atau QR code — menu fisik sering kotor dan tidak update",
      "Tidak ada sistem reservasi meja untuk peak hours (weekend & sore hari)",
      "Tidak memanfaatkan ulasan positif sebagai konten marketing di media sosial",
      "Tidak ada loyalty program meskipun memiliki basis pelanggan regular yang solid",
    ],
    opportunities: [
      "Upgrade infrastruktur WiFi dan jadikan 'WiFi Kencang' sebagai selling point utama",
      "Implementasi menu digital via QR code yang mudah diupdate dan menarik secara visual",
      "Buat sistem reservasi meja sederhana via WhatsApp untuk weekend dan event",
      "Aktifkan user-generated content — dorong pelanggan posting dengan hashtag unik",
      "Luncurkan loyalty card digital: setelah 10 kunjungan, dapatkan 1 minuman gratis",
    ],
    narrative:
      "Kafe Daun Hijau adalah bisnis dengan produk inti yang sangat kuat — suasana dan kualitas minuman mendapat pujian konsisten. Pain score yang relatif rendah (42) mencerminkan bahwa masalahnya bukan fundamental, melainkan absennya lapisan digital yang bisa mengamplifikasi kelebihan yang sudah ada. Investasi pada WiFi berkualitas dan marketing digital organik akan memberikan ROI yang sangat tinggi di segmen remote workers.",
  },
  9: {
    sentiment: "Campuran",
    aspects: [
      { name: "Menu Online", score: 22, emoji: "📱" },
      { name: "Metode Pembayaran", score: 28, emoji: "💳" },
      { name: "Kecepatan Saji", score: 72, emoji: "⚡" },
      { name: "Harga", score: 85, emoji: "💰" },
      { name: "Porsi & Value", score: 90, emoji: "🍽️" },
      { name: "Rasa & Autentisitas", score: 95, emoji: "⭐" },
    ],
    painPoints: [
      "Tidak memiliki kehadiran online — tidak bisa ditemukan di GoFood / GrabFood",
      "Hanya menerima pembayaran tunai, menghalangi pelanggan milenial",
      "Tidak ada dokumentasi menu dengan foto profesional untuk promosi",
      "Tidak memanfaatkan rating Google yang tinggi untuk mendatangkan pelanggan baru",
      "Tidak ada informasi jam buka yang akurat dan terupdate di Google Maps",
    ],
    opportunities: [
      "Daftarkan ke GoFood & GrabFood — rasa yang sudah bagus akan langsung viral",
      "Aktifkan QRIS untuk pembayaran non-tunai dengan biaya setup yang minimal",
      "Optimasi profil Google Business dengan foto menu dan update jam operasional",
      "Manfaatkan rating 4.1 yang solid sebagai social proof dalam konten media sosial",
      "Buat paket catering nasi padang untuk kantor — segmen underserved di Jakarta Pusat",
    ],
    narrative:
      "Warung Padang Sederhana adalah 'hidden gem' dengan produk yang sudah sangat kuat. Rasa dan value for money yang diberikan sudah menciptakan basis pelanggan loyal — namun terjebak dalam jangkauan terbatas karena absennya kehadiran digital. Dengan modal reputasi offline yang solid, bisnis ini bisa mengalami pertumbuhan 2–3× hanya dengan onboarding ke platform delivery dan mengaktifkan pembayaran digital.",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const badgeConfig = {
  hot:  { label: "Hot",  bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", Icon: Flame },
  warm: { label: "Warm", bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", Icon: Thermometer },
  cold: { label: "Cold", bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE", Icon: Snowflake },
};

const sentimentConfig = {
  Negatif:  { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", emoji: "😰" },
  Campuran: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", emoji: "😐" },
  Positif:  { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0", emoji: "😊" },
};

const aspectColor = (s: number) =>
  s >= 65 ? "#16A34A" : s >= 40 ? "#D97706" : "#DC2626";
const aspectBg = (s: number) =>
  s >= 65 ? "#F0FDF4" : s >= 40 ? "#FFFBEB" : "#FEF2F2";
const painColor = (s: number) =>
  s >= 75 ? "#DC2626" : s >= 50 ? "#D97706" : "#2563EB";

// ─── Component ────────────────────────────────────────────────────────────────
interface Props {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

export function LeadAIDetailSheet({ lead, open, onClose }: Props) {
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);

  // Lock body scroll & handle ESC key
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!lead) return null;

  const ai = AI_DATA[lead.id] ?? AI_DATA[1];
  const badge = badgeConfig[lead.badge as keyof typeof badgeConfig];
  const BadgeIcon = badge.Icon;
  const senti = sentimentConfig[ai.sentiment];
  const pc = painColor(lead.painScore);

  // WA link (dummy number)
  const waMsg = encodeURIComponent(
    `Halo, saya dari HelicoLeads. Saya tertarik mendiskusikan solusi untuk ${lead.name}. Apakah Anda ada waktu untuk ngobrol sebentar?`
  );
  const waLink = `https://wa.me/6281234567890?text=${waMsg}`;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        {/* ── Backdrop ── */}
        <div
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(15, 31, 61, 0.45)",
            opacity: open ? 1 : 0,
            transition: "opacity 0.25s ease",
          }}
        />

        {/* ── Sheet Panel ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: "min(540px, 100vw)",
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            borderLeft: "1px solid #E2E8F0",
          }}
        >
          {/* ──────────────── STICKY HEADER ──────────────── */}
          <div
            style={{
              padding: "20px 24px 18px",
              borderBottom: "1px solid #F1F5F9",
              background: "#FFFFFF",
              flexShrink: 0,
            }}
          >
            {/* Top row: label + close */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 flex items-center justify-center"
                  style={{ background: "#EEF2FF", borderRadius: "6px" }}
                >
                  <Sparkles size={12} style={{ color: "#4F46E5" }} />
                </div>
                <span style={{ color: "#4F46E5", fontSize: "11px", fontWeight: 700, letterSpacing: "0.5px" }}>
                  AI INTELLIGENCE REPORT
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center transition-all"
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F1F5F9")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
              >
                <X size={13} style={{ color: "#64748B" }} />
              </button>
            </div>

            {/* Business identity */}
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                style={{ background: lead.colorBg, borderRadius: "8px" }}
              >
                <span style={{ color: lead.color, fontSize: "15px", fontWeight: 700 }}>
                  {lead.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 style={{ color: "#0F1F3D", fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
                  {lead.name}
                </h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <MapPin size={11} style={{ color: "#94A3B8" }} />
                    <span style={{ color: "#64748B", fontSize: "12px" }}>{lead.location}</span>
                  </div>
                  <span
                    style={{
                      background: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      color: "#64748B",
                      fontSize: "11px",
                      padding: "1px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {lead.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={11} style={{ color: "#F59E0B" }} />
                    <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
                      {lead.rating}
                    </span>
                    <span style={{ color: "#94A3B8", fontSize: "11px" }}>({lead.reviews})</span>
                  </div>
                </div>
              </div>
              {/* Badge */}
              <div
                className="flex items-center gap-1 px-2.5 py-1.5 flex-shrink-0"
                style={{ background: badge.bg, border: `1px solid ${badge.border}`, borderRadius: "6px" }}
              >
                <BadgeIcon size={11} style={{ color: badge.color }} />
                <span style={{ color: badge.color, fontSize: "11px", fontWeight: 700 }}>
                  {badge.label}
                </span>
              </div>
            </div>
          </div>

          {/* ──────────────── SCROLLABLE BODY ──────────────── */}
          <div className="flex-1 overflow-y-auto" style={{ padding: "20px 24px" }}>

            {/* ── 1. Pain Score ── */}
            <div
              style={{
                background: "#FAFBFC",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "16px 18px",
                marginBottom: "16px",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} style={{ color: "#64748B" }} />
                  <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.4px" }}>
                    PAIN SCORE
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span style={{ color: pc, fontSize: "32px", fontWeight: 800, lineHeight: 1 }}>
                    {lead.painScore}
                  </span>
                  <span style={{ color: "#94A3B8", fontSize: "13px" }}>/100</span>
                </div>
              </div>
              <div style={{ background: "#E2E8F0", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${lead.painScore}%`,
                    height: "100%",
                    background: pc,
                    borderRadius: "4px",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span style={{ color: "#94A3B8", fontSize: "10px" }}>Rendah</span>
                <span
                  style={{
                    color: pc,
                    fontSize: "11px",
                    fontWeight: 600,
                    background: lead.painScore >= 75 ? "#FEF2F2" : lead.painScore >= 50 ? "#FFFBEB" : "#EFF6FF",
                    padding: "1px 8px",
                    borderRadius: "4px",
                  }}
                >
                  {lead.painScore >= 75 ? "Prioritas Tinggi" : lead.painScore >= 50 ? "Perlu Perhatian" : "Monitor"}
                </span>
                <span style={{ color: "#94A3B8", fontSize: "10px" }}>Tinggi</span>
              </div>
            </div>

            {/* ── 2. Overall Sentiment ── */}
            <div className="flex items-center justify-between mb-4">
              <span style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.4px" }}>
                OVERALL SENTIMENT
              </span>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5"
                style={{
                  background: senti.bg,
                  border: `1px solid ${senti.border}`,
                  borderRadius: "6px",
                }}
              >
                <span style={{ fontSize: "13px" }}>{senti.emoji}</span>
                <span style={{ color: senti.color, fontSize: "12px", fontWeight: 700 }}>
                  {ai.sentiment}
                </span>
              </div>
            </div>

            {/* ── 3. Aspect-Based Analysis ── */}
            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: "#64748B", fontSize: "11px", fontWeight: 600, letterSpacing: "0.4px", marginBottom: "12px" }}>
                ANALISIS PER ASPEK
              </p>
              <div className="flex flex-col gap-2.5">
                {ai.aspects.map((asp) => {
                  const ac = aspectColor(asp.score);
                  const ab = aspectBg(asp.score);
                  return (
                    <div key={asp.name}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span style={{ fontSize: "13px" }}>{asp.emoji}</span>
                          <span style={{ color: "#374151", fontSize: "12px", fontWeight: 500 }}>
                            {asp.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span style={{ color: ac, fontSize: "11px", fontWeight: 700 }}>
                            {asp.score}%
                          </span>
                          <span
                            style={{
                              background: ab,
                              color: ac,
                              fontSize: "9px",
                              fontWeight: 700,
                              padding: "1px 5px",
                              borderRadius: "3px",
                            }}
                          >
                            {asp.score >= 65 ? "BAIK" : asp.score >= 40 ? "SEDANG" : "BURUK"}
                          </span>
                        </div>
                      </div>
                      <div style={{ background: "#F1F5F9", borderRadius: "3px", height: "5px", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${asp.score}%`,
                            height: "100%",
                            background: ac,
                            borderRadius: "3px",
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── 4. Pain Points ── */}
            <div
              style={{
                background: "#FFF8F8",
                border: "1px solid #FECACA",
                borderRadius: "8px",
                padding: "14px 16px",
                marginBottom: "14px",
              }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <AlertTriangle size={13} style={{ color: "#DC2626" }} />
                <span style={{ color: "#DC2626", fontSize: "11px", fontWeight: 700, letterSpacing: "0.4px" }}>
                  PAIN POINTS UTAMA
                </span>
              </div>
              <ul className="flex flex-col gap-2">
                {ai.painPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: "#DC2626" }}
                    />
                    <span style={{ color: "#374151", fontSize: "12.5px", lineHeight: 1.5 }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── 5. Opportunity Recommendations ── */}
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #BBF7D0",
                borderRadius: "8px",
                padding: "14px 16px",
                marginBottom: "14px",
              }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <Lightbulb size={13} style={{ color: "#16A34A" }} />
                <span style={{ color: "#16A34A", fontSize: "11px", fontWeight: 700, letterSpacing: "0.4px" }}>
                  REKOMENDASI PELUANG
                </span>
              </div>
              <ol className="flex flex-col gap-2.5">
                {ai.opportunities.map((op, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span
                      style={{
                        background: "#16A34A",
                        color: "#FFFFFF",
                        fontSize: "9px",
                        fontWeight: 800,
                        width: "17px",
                        height: "17px",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ color: "#374151", fontSize: "12.5px", lineHeight: 1.5 }}>{op}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* ── 6. AI Narrative Summary ── */}
            <div
              style={{
                background: "#F8FAFF",
                border: "1px solid #C7D2FE",
                borderRadius: "8px",
                padding: "14px 16px",
                marginBottom: "14px",
              }}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <FileText size={13} style={{ color: "#4F46E5" }} />
                <span style={{ color: "#4F46E5", fontSize: "11px", fontWeight: 700, letterSpacing: "0.4px" }}>
                  AI NARRATIVE SUMMARY
                </span>
              </div>
              <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.65 }}>
                {ai.narrative}
              </p>
            </div>

            {/* ── 7. Estimasi Revenue ── */}
            <div
              style={{
                background: "#0F1F3D",
                borderRadius: "8px",
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.5px", marginBottom: "4px" }}>
                  ESTIMASI POTENSI REVENUE
                </p>
                <p style={{ color: "#FFFFFF", fontSize: "26px", fontWeight: 800, lineHeight: 1 }}>
                  {lead.potential}
                </p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "3px" }}>
                  berdasarkan analisis market & pain level
                </p>
              </div>
              <div
                style={{
                  background: "rgba(79,70,229,0.3)",
                  borderRadius: "8px",
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TrendingUp size={20} style={{ color: "#A5B4FC" }} />
              </div>
            </div>
          </div>

          {/* ──────────────── STICKY FOOTER ──────────────── */}
          <div
            style={{
              padding: "14px 24px",
              borderTop: "1px solid #E2E8F0",
              background: "#FFFFFF",
              display: "flex",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            {/* WA Button */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 transition-all"
              style={{
                background: "#25D366",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#1ebe5d")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#25D366")}
            >
              <MessageCircle size={14} />
              Kirim Pesan WA
            </a>

            {/* Add to Campaign */}
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2.5 transition-all"
              style={{
                background: "#4F46E5",
                color: "#FFFFFF",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#4338CA")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#4F46E5")}
              onClick={() => setCampaignModalOpen(true)}
            >
              <Plus size={14} />
              Tambah ke Campaign
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex items-center justify-center px-4 py-2.5 transition-all"
              style={{
                background: "#FFFFFF",
                color: "#64748B",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: 500,
                border: "1.5px solid #E2E8F0",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#F8FAFC")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#FFFFFF")}
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      <AddToCampaignModal
        open={campaignModalOpen}
        onClose={() => setCampaignModalOpen(false)}
        leadName={lead?.name}
      />
    </>
  );
}
