import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Flame,
  Thermometer,
  Snowflake,
  MapPin,
  Tag,
  Star,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Quote,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MessageCircle,
  Users,
  Clock,
  Target,
  X,
  ChevronDown,
  ArrowUpRight,
  BarChart3,
  Zap,
  ThumbsDown,
  ThumbsUp,
  Activity,
} from "lucide-react";
import { AddToCampaignModal } from "../AddToCampaignModal";
import { AIIntelligenceSkeleton } from "../Skeletons";

// ─── Types ────────────────────────────────────────────────────────────────────
type Badge = "hot" | "warm" | "cold";
type Sentiment = "negative" | "mixed" | "positive";

interface AspectScore {
  label: string;
  score: number;
  sentiment: Sentiment;
  sample: string;
}

interface LeadAI {
  id: number;
  name: string;
  location: string;
  category: string;
  rating: number;
  reviews: number;
  badge: Badge;
  painScore: number;
  initials: string;
  color: string;
  colorBg: string;
  overallSentiment: Sentiment;
  sentimentScore: number;
  aspects: AspectScore[];
  topQuotes: string[];
  aiSummary: string;
  opportunities: string[];
  riskLevel: "Tinggi" | "Sedang" | "Rendah";
  potential: string;
  lastAnalyzed: string;
  totalMentions: number;
  negativeMentions: number;
  positiveMentions: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const LEADS_DATA: LeadAI[] = [
  {
    id: 1,
    name: "Warung Nasi Bu Imas",
    location: "Bandung, Jawa Barat",
    category: "Kuliner",
    rating: 3.1,
    reviews: 412,
    badge: "hot",
    painScore: 91,
    initials: "WN",
    color: "#DC2626",
    colorBg: "#FEF2F2",
    overallSentiment: "negative",
    sentimentScore: 24,
    aspects: [
      { label: "Pelayanan", score: 18, sentiment: "negative", sample: "\"Kasir lambat banget, mau bayar aja ngantri 20 menit\"" },
      { label: "Kualitas Makanan", score: 71, sentiment: "positive", sample: "\"Rasanya enak dan porsi besar, worth it\"" },
      { label: "Sistem Antrian", score: 9, sentiment: "negative", sample: "\"Tidak ada nomor antri, kacau banget kalau rame\"" },
      { label: "Kebersihan", score: 48, sentiment: "mixed", sample: "\"Lumayan bersih tapi meja sering tidak langsung dibersihkan\"" },
      { label: "Harga", score: 62, sentiment: "mixed", sample: "\"Harga oke, tapi kadang tidak sesuai yang di papan menu\"" },
    ],
    topQuotes: [
      "\"Antriannya panjang sekali dan tidak ada sistemnya, sudah 30 menit belum dapat tempat duduk\"",
      "\"Menu favorit saya sering habis padahal baru jam 12 siang\"",
      "\"Pelayan tidak ramah dan lambat, tapi makanannya memang enak\"",
    ],
    aiSummary:
      "Warung Nasi Bu Imas memiliki kualitas makanan yang diakui pelanggan, namun sangat terhambat oleh masalah operasional sistem yang tidak terorganisir. Dari 412 ulasan, 68% menyebutkan masalah antrian dan sistem pengelolaan pelanggan. Bisnis ini memiliki potensi besar namun kehilangan pelanggan potensial akibat frustrasi di proses pemesanan dan pembayaran. Ini adalah peluang emas untuk solusi manajemen antrian dan reservasi digital.",
    opportunities: [
      "Tawarkan sistem manajemen antrian digital (nomor antrian via WA atau kiosk)",
      "Solusi pre-order atau reservasi online untuk jam makan siang",
      "Dashboard stok menu real-time agar pelanggan tahu ketersediaan sebelum datang",
      "Training staff pelayanan dengan script handling pelanggan antrean",
      "Integrasi kasir digital untuk percepat proses pembayaran",
    ],
    riskLevel: "Tinggi",
    potential: "Rp 14.200.000",
    lastAnalyzed: "2 jam lalu",
    totalMentions: 412,
    negativeMentions: 280,
    positiveMentions: 132,
  },
  {
    id: 2,
    name: "Laundry Cepat Express",
    location: "Jakarta Selatan",
    category: "Laundry",
    rating: 3.3,
    reviews: 287,
    badge: "hot",
    painScore: 85,
    initials: "LC",
    color: "#EA580C",
    colorBg: "#FFF7ED",
    overallSentiment: "negative",
    sentimentScore: 31,
    aspects: [
      { label: "Ketepatan Waktu", score: 15, sentiment: "negative", sample: "\"Janji 3 hari tapi nyatanya seminggu baru selesai\"" },
      { label: "Kerapian Cucian", score: 41, sentiment: "mixed", sample: "\"Bersih tapi sering kusut, kurang disetrika\"" },
      { label: "Komunikasi", score: 22, sentiment: "negative", sample: "\"Tidak ada notifikasi sama sekali kalau cucian sudah selesai\"" },
      { label: "Harga", score: 58, sentiment: "mixed", sample: "\"Harga standar, tapi kualitas tidak konsisten\"" },
      { label: "Keamanan Barang", score: 29, sentiment: "negative", sample: "\"Baju saya tertukar dengan pelanggan lain, sangat tidak profesional\"" },
    ],
    topQuotes: [
      "\"Pakaian saya tertukar dengan orang lain. Sangat mengecewakan dan tidak profesional\"",
      "\"Tidak pernah ada kabar kalau cucian sudah selesai, harus tanya sendiri tiap hari\"",
      "\"Janji express 1 hari tapi baru selesai 3 hari kemudian tanpa pemberitahuan\"",
    ],
    aiSummary:
      "Laundry Cepat Express menghadapi krisis kepercayaan pelanggan yang serius akibat kegagalan operasional berulang. Dua masalah utama yang muncul konsisten: pakaian tertukar (disebutkan 94 kali) dan ketiadaan sistem notifikasi otomatis. Nama brand 'Cepat' justru menjadi kontradiksi dengan pengalaman nyata pelanggan. Bisnis ini sangat rentan kehilangan pelanggan loyal dan membutuhkan solusi sistem tracking pesanan secara mendesak.",
    opportunities: [
      "Sistem tracking laundry berbasis nomor order dengan notifikasi WhatsApp otomatis",
      "Labeling QR code unik per pelanggan untuk eliminasi risiko tertukar",
      "Aplikasi atau chatbot WA untuk cek status cucian real-time",
      "SOP time commitment yang realistis disertai sistem reminder internal",
      "Program loyalty 'Express Guarantee' untuk rebuild trust pelanggan lama",
    ],
    riskLevel: "Tinggi",
    potential: "Rp 8.750.000",
    lastAnalyzed: "5 jam lalu",
    totalMentions: 287,
    negativeMentions: 198,
    positiveMentions: 89,
  },
  {
    id: 3,
    name: "Klinik Sehat Utama",
    location: "Jakarta Selatan",
    category: "Kesehatan",
    rating: 3.4,
    reviews: 198,
    badge: "hot",
    painScore: 88,
    initials: "KS",
    color: "#7C3AED",
    colorBg: "#F5F3FF",
    overallSentiment: "negative",
    sentimentScore: 28,
    aspects: [
      { label: "Waktu Tunggu", score: 8, sentiment: "negative", sample: "\"Sudah buat janji tapi masih nunggu 2 jam lebih di ruang tunggu\"" },
      { label: "Kompetensi Dokter", score: 74, sentiment: "positive", sample: "\"Dokternya sabar dan penjelasannya detail dan mudah dipahami\"" },
      { label: "Sistem Booking", score: 12, sentiment: "negative", sample: "\"Harus telepon dulu, tidak bisa booking online sama sekali\"" },
      { label: "Administrasi", score: 33, sentiment: "negative", sample: "\"Proses administrasi sangat lambat dan mempersulit\"" },
      { label: "Fasilitas", score: 55, sentiment: "mixed", sample: "\"Ruangan cukup bersih tapi pendingin udara sering mati\"" },
    ],
    topQuotes: [
      "\"Sudah booking tapi tetap harus nunggu 2.5 jam. Sistem booking-nya tidak berguna\"",
      "\"Tidak bisa cek hasil lab secara online, harus datang lagi ke klinik\"",
      "\"Dokternya bagus tapi sistem administrasinya sangat mengecewakan\"",
    ],
    aiSummary:
      "Klinik Sehat Utama mengalami disconnect besar antara kualitas medis yang baik dengan sistem operasional yang tertinggal jauh. Dari 198 ulasan, 71% menyoroti masalah waktu tunggu meski sudah booking dan ketidaktersediaan layanan digital. Ini memunculkan frustrasi yang tinggi karena ekspektasi pasien modern tidak terpenuhi. Potensi klinik ini sangat besar mengingat kompetensi dokter diakui positif — masalahnya murni ada di sistem.",
    opportunities: [
      "Platform booking online terintegrasi dengan manajemen antrean real-time",
      "Sistem notifikasi WA otomatis: 'Giliran Anda perkiraan 15 menit lagi'",
      "Portal pasien digital untuk akses hasil lab dan rekam medis",
      "Digitalisasi administrasi dengan form pendaftaran online pre-visit",
      "Dashboard manajemen dokter untuk optimasi jadwal dan kapasitas",
    ],
    riskLevel: "Tinggi",
    potential: "Rp 32.000.000",
    lastAnalyzed: "1 hari lalu",
    totalMentions: 198,
    negativeMentions: 141,
    positiveMentions: 57,
  },
  {
    id: 4,
    name: "Bengkel Maju Bersama",
    location: "Depok, Jawa Barat",
    category: "Otomotif",
    rating: 3.6,
    reviews: 154,
    badge: "warm",
    painScore: 74,
    initials: "BM",
    color: "#0284C7",
    colorBg: "#E0F2FE",
    overallSentiment: "mixed",
    sentimentScore: 48,
    aspects: [
      { label: "Transparansi Harga", score: 21, sentiment: "negative", sample: "\"Harga akhir beda jauh sama estimasi awal tanpa penjelasan\"" },
      { label: "Kualitas Perbaikan", score: 66, sentiment: "mixed", sample: "\"Hasil servis lumayan, tapi kadang harus balik lagi untuk masalah yang sama\"" },
      { label: "Update Status", score: 30, sentiment: "negative", sample: "\"Tidak ada kabar sama sekali, harus nelpon sendiri buat tanya sudah sampai mana\"" },
      { label: "Kecepatan Servis", score: 52, sentiment: "mixed", sample: "\"Kalau tidak ramai bisa cepat, tapi kalau lagi rame bisa seharian\"" },
      { label: "Kepercayaan", score: 38, sentiment: "negative", sample: "\"Sering ada suku cadang yang diganti padahal belum tentu perlu\"" },
    ],
    topQuotes: [
      "\"Estimasi Rp 200rb tapi bayar Rp 450rb. Tidak ada penjelasan kenapa bisa berbeda jauh\"",
      "\"Harus telepon berkali-kali untuk tahu status motor saya\"",
      "\"Teknisinya bilang perlu ganti part A, tapi di bengkel lain ternyata tidak perlu\"",
    ],
    aiSummary:
      "Bengkel Maju Bersama memiliki fundamental teknis yang cukup solid namun kehilangan kepercayaan pelanggan akibat transparansi yang rendah. Isu harga yang tidak sesuai estimasi (disebutkan 67 kali) dan ketiadaan update status menjadi dua keluhan utama. Dibanding kompetitor, bisnis ini memiliki lokasi strategis dan teknisi berpengalaman — hanya perlu sistem komunikasi dan transparansi yang lebih baik.",
    opportunities: [
      "Sistem estimasi digital dengan persetujuan pelanggan sebelum pengerjaan dimulai",
      "WhatsApp Business dengan update status otomatis tahap per tahap",
      "Invoice transparan dengan breakdown detail setiap item pekerjaan",
      "Program 'Servis Garansi 30 Hari' untuk membangun kepercayaan",
      "Review dan rating internal setelah setiap servis selesai",
    ],
    riskLevel: "Sedang",
    potential: "Rp 6.400.000",
    lastAnalyzed: "1 hari lalu",
    totalMentions: 154,
    negativeMentions: 80,
    positiveMentions: 74,
  },
  {
    id: 5,
    name: "Salon Cantik Permata",
    location: "Tangerang Selatan",
    category: "Kecantikan",
    rating: 3.5,
    reviews: 321,
    badge: "warm",
    painScore: 70,
    initials: "SC",
    color: "#DB2777",
    colorBg: "#FDF2F8",
    overallSentiment: "mixed",
    sentimentScore: 44,
    aspects: [
      { label: "Ketersediaan Jadwal", score: 25, sentiment: "negative", sample: "\"Susah banget mau booking, selalu penuh padahal datang di hari biasa\"" },
      { label: "Hasil Styling", score: 73, sentiment: "positive", sample: "\"Hasilnya bagus dan sesuai referensi yang saya kasih\"" },
      { label: "Jam Operasional", score: 31, sentiment: "negative", sample: "\"Tutup lebih cepat dari jam yang tertera di Google Maps\"" },
      { label: "Harga", score: 55, sentiment: "mixed", sample: "\"Harga oke tapi suka ada tambahan biaya yang tidak diinfokan sebelumnya\"" },
      { label: "Kebersihan Alat", score: 60, sentiment: "mixed", sample: "\"Alat kecantikannya bersih tapi perlu lebih sering disterilisasi\"" },
    ],
    topQuotes: [
      "\"Sudah telepon 5 kali untuk booking, selalu bilang penuh tapi walk-in bisa\"",
      "\"Jam buka yang tertulis jam 9 tapi baru benar-benar buka jam 10.30\"",
      "\"Stylistnya bagus tapi sering tidak ada, jadi dilayani stylist junior\"",
    ],
    aiSummary:
      "Salon Cantik Permata memiliki kualitas hasil kerja yang diakui pelanggan, namun masalah manajemen operasional membuat calon pelanggan frustasi bahkan sebelum masuk ke salon. Inkonsistensi jam buka dan sistem booking yang tidak efisien menjadi penghambat pertumbuhan utama. Dengan sistem manajemen jadwal yang baik, salon ini berpotensi meningkatkan kapasitas pelanggan hingga 40%.",
    opportunities: [
      "Sistem booking online dengan slot waktu real-time dan konfirmasi otomatis",
      "Manajemen jadwal stylist digital agar tidak ada double booking",
      "Notifikasi WA pengingat janji 1 hari sebelumnya untuk kurangi no-show",
      "Standarisasi jam operasional yang diupdate di semua platform digital",
      "Paket membership bulanan untuk pelanggan loyal dengan priority booking",
    ],
    riskLevel: "Sedang",
    potential: "Rp 5.100.000",
    lastAnalyzed: "2 hari lalu",
    totalMentions: 321,
    negativeMentions: 180,
    positiveMentions: 141,
  },
  {
    id: 6,
    name: "Apotek Sehat Selalu",
    location: "Jakarta Timur",
    category: "Kesehatan",
    rating: 3.8,
    reviews: 203,
    badge: "warm",
    painScore: 58,
    initials: "AS",
    color: "#0284C7",
    colorBg: "#E0F2FE",
    overallSentiment: "mixed",
    sentimentScore: 56,
    aspects: [
      { label: "Ketersediaan Obat", score: 29, sentiment: "negative", sample: "\"Obat generik biasa saja sering kosong, harus ke apotek lain\"" },
      { label: "Kecepatan Layanan", score: 44, sentiment: "mixed", sample: "\"Kasirnya cepat tapi antrean tebus resep lama\"" },
      { label: "Pengetahuan Apoteker", score: 68, sentiment: "positive", sample: "\"Apotekernya informatif dan mau menjelaskan cara pakai obat dengan sabar\"" },
      { label: "Harga", score: 60, sentiment: "mixed", sample: "\"Harga kompetitif tapi kadang lebih mahal dari apotek online\"" },
      { label: "Informasi Produk", score: 52, sentiment: "mixed", sample: "\"Kurang informasi soal alternatif obat jika yang diminta kosong\"" },
    ],
    topQuotes: [
      "\"Obat batuk yang umum saja sering tidak tersedia, kecewa\"",
      "\"Harga di sini lebih mahal 30% dari apotek online, tidak kompetitif\"",
      "\"Apotekernya ramah dan membantu, tapi stok selalu jadi masalah\"",
    ],
    aiSummary:
      "Apotek Sehat Selalu menghadapi tekanan kompetitif dari apotek online yang semakin kuat. Masalah ketersediaan stok (42% ulasan) dan gap harga menjadi hambatan utama. Namun keunggulan pada kompetensi apoteker memberikan diferensiasi yang bisa dieksploitasi. Bisnis ini perlu transformasi digital untuk tetap relevan di pasar yang berubah cepat.",
    opportunities: [
      "Sistem manajemen stok otomatis dengan threshold reorder otomatis",
      "Layanan konsultasi apoteker via WhatsApp untuk diferensiasi vs apotek online",
      "Cek stok real-time via website atau WhatsApp sebelum pelanggan datang",
      "Program langganan obat rutin untuk pasien kronis dengan diskon khusus",
      "Kerjasama dengan klinik sekitar untuk referral resep",
    ],
    riskLevel: "Sedang",
    potential: "Rp 7.800.000",
    lastAnalyzed: "4 hari lalu",
    totalMentions: 203,
    negativeMentions: 89,
    positiveMentions: 114,
  },
  {
    id: 7,
    name: "Kafe Daun Hijau",
    location: "Bogor, Jawa Barat",
    category: "Kuliner",
    rating: 4.0,
    reviews: 445,
    badge: "cold",
    painScore: 42,
    initials: "KD",
    color: "#64748B",
    colorBg: "#F1F5F9",
    overallSentiment: "positive",
    sentimentScore: 72,
    aspects: [
      { label: "Suasana", score: 84, sentiment: "positive", sample: "\"Tempatnya nyaman dan instagramable banget\"" },
      { label: "Rasa Makanan", score: 78, sentiment: "positive", sample: "\"Menu healthy-nya enak dan presentasinya bagus\"" },
      { label: "WiFi & Fasilitas", score: 21, sentiment: "negative", sample: "\"WiFi sering mati, padahal banyak yang kerja di sini\"" },
      { label: "Harga", score: 55, sentiment: "mixed", sample: "\"Agak mahal tapi worth it untuk tempatnya\"" },
      { label: "Sistem Pemesanan", score: 48, sentiment: "mixed", sample: "\"Belum ada menu digital/QR, masih pakai menu fisik yang sudah lusuh\"" },
    ],
    topQuotes: [
      "\"WiFi selalu down di jam sibuk, tidak bisa kerja dengan nyaman\"",
      "\"Menu QR code belum ada, padahal kafe lain sudah punya\"",
      "\"Tempatnya bagus tapi fasilitas digital-nya ketinggalan zaman\"",
    ],
    aiSummary:
      "Kafe Daun Hijau adalah bisnis dengan fondasi yang kuat — suasana dan kualitas makanan mendapat respons positif. Pain point utamanya bersifat teknis dan mudah diselesaikan: infrastruktur WiFi yang tidak andal dan ketiadaan sistem digital ordering. Ini adalah lead Cold yang bisa dengan cepat menjadi peluang jika pendekatan dilakukan dengan solusi spesifik dan terjangkau.",
    opportunities: [
      "Upgrade infrastruktur WiFi bisnis dengan bandwidth terpisah untuk pelanggan",
      "Menu digital QR code dengan sistem self-order untuk modernisasi experience",
      "Sistem reservasi meja online untuk manajemen kapasitas weekend",
      "Program 'Work From Cafe' dengan paket WiFi + minuman bundling",
      "Loyalty app atau digital stamp card untuk pelanggan reguler",
    ],
    riskLevel: "Rendah",
    potential: "Rp 3.200.000",
    lastAnalyzed: "1 minggu lalu",
    totalMentions: 445,
    negativeMentions: 124,
    positiveMentions: 321,
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const badgeConfig = {
  hot: { label: "Hot", bg: "#FEF2F2", color: "#DC2626", border: "#FECACA", icon: Flame },
  warm: { label: "Warm", bg: "#FFFBEB", color: "#D97706", border: "#FDE68A", icon: Thermometer },
  cold: { label: "Cold", bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE", icon: Snowflake },
};

const sentimentConfig = {
  negative: {
    label: "Negatif",
    bg: "#FEF2F2",
    color: "#DC2626",
    border: "#FECACA",
    icon: ThumbsDown,
    desc: "Mayoritas ulasan mengekspresikan ketidakpuasan",
  },
  mixed: {
    label: "Campuran",
    bg: "#FFFBEB",
    color: "#D97706",
    border: "#FDE68A",
    icon: Minus,
    desc: "Ulasan terbagi antara positif dan negatif",
  },
  positive: {
    label: "Positif",
    bg: "#F0FDF4",
    color: "#16A34A",
    border: "#BBF7D0",
    icon: ThumbsUp,
    desc: "Mayoritas ulasan mengekspresikan kepuasan",
  },
};

const riskConfig = {
  Tinggi: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  Sedang: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  Rendah: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
};

const scoreColor = (s: number) => (s >= 70 ? "#DC2626" : s >= 40 ? "#D97706" : "#16A34A");
const aspectColor = (s: number) => (s >= 60 ? "#16A34A" : s >= 35 ? "#D97706" : "#DC2626");

// ─── Sub-component: Aspect Bar ────────────────────────────────────────────────
function AspectBar({ aspect, expanded, onToggle }: {
  aspect: AspectScore;
  expanded: boolean;
  onToggle: () => void;
}) {
  const fill = aspectColor(aspect.score);
  const sc = sentimentConfig[aspect.sentiment];

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 group"
        style={{ padding: "10px 0" }}
      >
        <div style={{ width: "100px", flexShrink: 0 }}>
          <span style={{ color: "#64748B", fontSize: "12px", fontWeight: 500 }}>
            {aspect.label}
          </span>
        </div>
        <div className="flex-1" style={{ background: "#F1F5F9", borderRadius: "4px", height: "6px" }}>
          <div
            style={{
              width: `${aspect.score}%`,
              height: "100%",
              background: fill,
              borderRadius: "4px",
              transition: "width 0.6s ease",
            }}
          />
        </div>
        <div style={{ width: "38px", textAlign: "right", flexShrink: 0 }}>
          <span style={{ color: fill, fontSize: "12px", fontWeight: 700 }}>{aspect.score}</span>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-0.5 flex-shrink-0"
          style={{
            background: sc.bg,
            border: `1px solid ${sc.border}`,
            borderRadius: "4px",
            width: "76px",
            justifyContent: "center",
          }}
        >
          <sc.icon size={9} style={{ color: sc.color }} />
          <span style={{ color: sc.color, fontSize: "10px", fontWeight: 600 }}>{sc.label}</span>
        </div>
        <ChevronDown
          size={13}
          style={{
            color: "#94A3B8",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {expanded && (
        <div
          className="ml-4 mb-1"
          style={{
            background: "#F8FAFC",
            border: "1px solid #E2E8F0",
            borderRadius: "6px",
            padding: "10px 12px",
          }}
        >
          <div className="flex items-start gap-2">
            <Quote size={12} style={{ color: "#94A3B8", flexShrink: 0, marginTop: "1px" }} />
            <p style={{ color: "#64748B", fontSize: "12px", lineHeight: 1.6, fontStyle: "italic" }}>
              {aspect.sample}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AIIntelligencePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [badgeFilter, setBadgeFilter] = useState<"all" | Badge>("all");
  const [selectedId, setSelectedId] = useState<number>(LEADS_DATA[0].id);
  const [expandedAspect, setExpandedAspect] = useState<string | null>(null);
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);

  const filtered = useMemo(() => {
    let data = [...LEADS_DATA];
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (l) => l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)
      );
    }
    if (badgeFilter !== "all") data = data.filter((l) => l.badge === badgeFilter);
    return data;
  }, [search, badgeFilter]);

  const selected = LEADS_DATA.find((l) => l.id === selectedId) ?? LEADS_DATA[0];
  const badge = badgeConfig[selected.badge];
  const BadgeIcon = badge.icon;
  const sentiment = sentimentConfig[selected.overallSentiment];
  const SentimentIcon = sentiment.icon;
  const risk = riskConfig[selected.riskLevel];

  const counts = {
    all: LEADS_DATA.length,
    hot: LEADS_DATA.filter((l) => l.badge === "hot").length,
    warm: LEADS_DATA.filter((l) => l.badge === "warm").length,
    cold: LEADS_DATA.filter((l) => l.badge === "cold").length,
  };

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <AIIntelligenceSkeleton />;

  return (
    <div
      className="flex flex-col flex-1 min-h-0"
      style={{ background: "#F8FAFC", color: "#0F1F3D", overflow: "hidden" }}
    >
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div
        className="px-5 md:px-8 pt-5 md:pt-8 pb-4 md:pb-6 flex-shrink-0"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #E2E8F0" }}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div
                className="w-8 h-8 flex items-center justify-center"
                style={{ background: "#EEF2FF", borderRadius: "8px" }}
              >
                <Sparkles size={16} style={{ color: "#4F46E5" }} />
              </div>
              <h1 style={{ color: "#0F1F3D", fontSize: "22px", fontWeight: 700 }}>
                Inteligensi AI
              </h1>
              <span
                className="flex items-center gap-1.5 px-2.5 py-1"
                style={{
                  background: "#EEF2FF",
                  color: "#4F46E5",
                  fontSize: "11px",
                  fontWeight: 600,
                  borderRadius: "6px",
                }}
              >
                {/* Claude "C" logomark */}
                <svg width="12" height="12" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M26.738 8.503 15.042 23.25l11.696 14.747h7.734L22.776 23.25 34.472 8.503h-7.734Z" fill="#4F46E5"/>
                  <path d="M18.004 8.503 6.308 23.25l11.696 14.747h7.734L13.042 23.25 24.738 8.503h-7.734Z" fill="#4F46E5" opacity=".4"/>
                </svg>
                Powered by Claude AI
              </span>
            </div>
            <p style={{ color: "#64748B", fontSize: "14px" }}>
              Analisis mendalam menggunakan AI untuk setiap lead Anda
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            {[
              { label: "Leads Dianalisis", value: LEADS_DATA.length, icon: Activity, color: "#4F46E5", bg: "#EEF2FF" },
              { label: "Hot Leads", value: counts.hot, icon: Flame, color: "#DC2626", bg: "#FEF2F2" },
              { label: "Avg Pain Score", value: Math.round(LEADS_DATA.reduce((a, l) => a + l.painScore, 0) / LEADS_DATA.length), icon: TrendingUp, color: "#D97706", bg: "#FFFBEB" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-2.5 px-4 py-2.5"
                style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px" }}
              >
                <div
                  className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                  style={{ background: stat.bg, borderRadius: "6px" }}
                >
                  <stat.icon size={13} style={{ color: stat.color }} />
                </div>
                <div>
                  <p style={{ color: "#0F1F3D", fontSize: "17px", fontWeight: 700, lineHeight: 1 }}>
                    {stat.value}
                  </p>
                  <p style={{ color: "#94A3B8", fontSize: "10px", marginTop: "2px" }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body: Split View ────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ═══ LEFT PANEL: Lead List ══════════════════════════════════ */}
        <div
          className="flex flex-col flex-shrink-0"
          style={{
            width: "320px",
            borderRight: "1px solid #E2E8F0",
            background: "#FFFFFF",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Search & Filter */}
          <div className="p-4 border-b flex-shrink-0" style={{ borderColor: "#E2E8F0" }}>
            {/* Search */}
            <div
              className="flex items-center gap-2.5 px-3 py-2.5 mb-3"
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
              }}
            >
              <Search size={14} style={{ color: "#94A3B8", flexShrink: 0 }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari lead..."
                className="flex-1 outline-none bg-transparent"
                style={{ color: "#0F1F3D", fontSize: "13px", border: "none", padding: 0 }}
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={12} style={{ color: "#94A3B8" }} />
                </button>
              )}
            </div>

            {/* Badge filter tabs */}
            <div
              className="flex items-center p-0.5"
              style={{ background: "#F1F5F9", borderRadius: "8px" }}
            >
              {(["all", "hot", "warm", "cold"] as const).map((tab) => {
                const active = badgeFilter === tab;
                const cfg = tab !== "all" ? badgeConfig[tab] : null;
                return (
                  <button
                    key={tab}
                    onClick={() => setBadgeFilter(tab)}
                    className="flex items-center justify-center gap-1 flex-1 py-1.5 transition-all"
                    style={{
                      background: active ? "#FFFFFF" : "transparent",
                      border: active ? "1px solid #E2E8F0" : "1px solid transparent",
                      borderRadius: "6px",
                      color: active ? (cfg ? cfg.color : "#0F1F3D") : "#64748B",
                      fontSize: "11px",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {cfg && <cfg.icon size={10} style={{ color: cfg.color }} />}
                    {tab === "all" ? "Semua" : cfg!.label}
                    <span
                      style={{
                        background: active ? (cfg ? cfg.bg : "#EEF2FF") : "transparent",
                        color: active ? (cfg ? cfg.color : "#4F46E5") : "#94A3B8",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "0px 4px",
                        borderRadius: "3px",
                      }}
                    >
                      {counts[tab]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lead List */}
          <div className="flex-1 overflow-y-auto" style={{ padding: "8px" }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Search size={20} style={{ color: "#CBD5E1", marginBottom: "8px" }} />
                <p style={{ color: "#94A3B8", fontSize: "13px" }}>Tidak ada lead ditemukan</p>
              </div>
            ) : (
              filtered.map((lead) => {
                const bg = badgeConfig[lead.badge];
                const BgIcon = bg.icon;
                const isActive = lead.id === selectedId;

                return (
                  <button
                    key={lead.id}
                    onClick={() => { setSelectedId(lead.id); setExpandedAspect(null); }}
                    className="w-full text-left transition-all mb-1"
                    style={{
                      background: isActive ? "#EEF2FF" : "transparent",
                      border: `1px solid ${isActive ? "#A5B4FC" : "transparent"}`,
                      borderRadius: "8px",
                      padding: "10px 12px",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "#F8FAFC";
                        (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                        (e.currentTarget as HTMLElement).style.borderColor = "transparent";
                      }
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 flex items-center justify-center flex-shrink-0"
                        style={{ background: lead.colorBg, borderRadius: "8px" }}
                      >
                        <span style={{ color: lead.color, fontSize: "12px", fontWeight: 700 }}>
                          {lead.initials}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p
                            style={{
                              color: isActive ? "#4F46E5" : "#0F1F3D",
                              fontSize: "12px",
                              fontWeight: 600,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {lead.name}
                          </p>
                          <div
                            className="flex items-center gap-0.5 flex-shrink-0"
                            style={{
                              background: bg.bg,
                              border: `1px solid ${bg.border}`,
                              borderRadius: "4px",
                              padding: "1px 5px",
                            }}
                          >
                            <BgIcon size={9} style={{ color: bg.color }} />
                            <span style={{ color: bg.color, fontSize: "9px", fontWeight: 700 }}>
                              {bg.label}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span style={{ color: "#94A3B8", fontSize: "10px" }}>{lead.location}</span>
                          <div className="flex items-center gap-1">
                            <span style={{ color: "#64748B", fontSize: "10px", fontWeight: 500 }}>
                              Pain:
                            </span>
                            <span
                              style={{
                                color: scoreColor(lead.painScore),
                                fontSize: "11px",
                                fontWeight: 700,
                              }}
                            >
                              {lead.painScore}
                            </span>
                          </div>
                        </div>
                        {/* Mini pain bar */}
                        <div
                          style={{
                            height: "3px",
                            background: "#F1F5F9",
                            borderRadius: "2px",
                            marginTop: "5px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${lead.painScore}%`,
                              height: "100%",
                              background: scoreColor(lead.painScore),
                              borderRadius: "2px",
                            }}
                          />
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight size={13} style={{ color: "#4F46E5", flexShrink: 0 }} />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ═══ RIGHT PANEL: AI Detail ══════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto p-6">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >

            {/* ── Lead Identity Card ──────────────────────────────────── */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {/* Accent strip */}
              <div style={{ height: "3px", background: badge.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                      style={{ background: selected.colorBg, borderRadius: "8px" }}
                    >
                      <span style={{ color: selected.color, fontSize: "15px", fontWeight: 700 }}>
                        {selected.initials}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h2 style={{ color: "#0F1F3D", fontSize: "18px", fontWeight: 700 }}>
                          {selected.name}
                        </h2>
                        <div
                          className="flex items-center gap-1 px-2 py-1"
                          style={{
                            background: badge.bg,
                            border: `1px solid ${badge.border}`,
                            borderRadius: "6px",
                          }}
                        >
                          <BadgeIcon size={11} style={{ color: badge.color }} />
                          <span style={{ color: badge.color, fontSize: "11px", fontWeight: 600 }}>
                            {badge.label}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin size={11} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#64748B", fontSize: "12px" }}>{selected.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag size={11} style={{ color: "#94A3B8" }} />
                          <span style={{ color: "#64748B", fontSize: "12px" }}>{selected.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={11} style={{ color: "#F59E0B" }} />
                          <span style={{ color: "#0F1F3D", fontSize: "12px", fontWeight: 600 }}>
                            {selected.rating}
                          </span>
                          <span style={{ color: "#94A3B8", fontSize: "11px" }}>
                            ({selected.reviews} ulasan)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1" style={{ color: "#94A3B8", fontSize: "11px" }}>
                      <Clock size={11} />
                      Dianalisis {selected.lastAnalyzed}
                    </div>
                  </div>
                </div>

                {/* Key metrics row */}
                <div
                  className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5 pt-5"
                  style={{ borderTop: "1px solid #F1F5F9" }}
                >
                  {[
                    {
                      label: "Pain Score",
                      value: `${selected.painScore}/100`,
                      color: scoreColor(selected.painScore),
                      bg: "#FEF2F2",
                      icon: TrendingUp,
                    },
                    {
                      label: "Est. Potensi",
                      value: selected.potential,
                      color: "#059669",
                      bg: "#ECFDF5",
                      icon: Target,
                    },
                    {
                      label: "Total Ulasan",
                      value: selected.totalMentions,
                      color: "#4F46E5",
                      bg: "#EEF2FF",
                      icon: MessageCircle,
                    },
                    {
                      label: "Risiko Churn",
                      value: selected.riskLevel,
                      color: risk.color,
                      bg: risk.bg,
                      icon: AlertTriangle,
                    },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="flex flex-col gap-1.5 p-3"
                      style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-6 h-6 flex items-center justify-center"
                          style={{ background: m.bg, borderRadius: "5px" }}
                        >
                          <m.icon size={12} style={{ color: m.color }} />
                        </div>
                        <span style={{ color: "#94A3B8", fontSize: "10px", fontWeight: 500 }}>
                          {m.label}
                        </span>
                      </div>
                      <p style={{ color: m.color, fontSize: "16px", fontWeight: 700, lineHeight: 1 }}>
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Sentiment + Pain Score Row ────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">

              {/* ══════════ CARD: Overall Sentiment ══════════ */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Top accent strip */}
                <div style={{ height: "3px", background: sentiment.color }} />

                <div style={{ padding: "18px 20px" }}>
                  {/* Header row */}
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: "16px" }}
                  >
                    <div className="flex items-center gap-2">
                      <BarChart3 size={13} style={{ color: "#64748B" }} />
                      <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                        Overall Sentiment
                      </span>
                    </div>
                    {/* Classification badge */}
                    <div
                      className="flex items-center gap-1.5"
                      style={{
                        padding: "3px 10px",
                        background: sentiment.bg,
                        border: `1px solid ${sentiment.border}`,
                        borderRadius: "6px",
                      }}
                    >
                      <SentimentIcon size={10} style={{ color: sentiment.color }} />
                      <span style={{ color: sentiment.color, fontSize: "11px", fontWeight: 700 }}>
                        {sentiment.label}
                      </span>
                    </div>
                  </div>

                  {/* Score + icon row */}
                  <div className="flex items-center gap-3" style={{ marginBottom: "4px" }}>
                    {/* Tinted icon box */}
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        background: sentiment.bg,
                        border: `1.5px solid ${sentiment.border}`,
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <SentimentIcon size={22} style={{ color: sentiment.color }} />
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span
                          style={{
                            color: sentiment.color,
                            fontSize: "48px",
                            fontWeight: 800,
                            lineHeight: 1,
                          }}
                        >
                          {selected.sentimentScore}
                        </span>
                        <span style={{ color: "#94A3B8", fontSize: "16px" }}>/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "#F1F5F9", margin: "14px 0" }} />

                  {/* Distribution header */}
                  <p
                    style={{
                      color: "#94A3B8",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      marginBottom: "10px",
                    }}
                  >
                    DISTRIBUSI ULASAN · {selected.totalMentions} total
                  </p>

                  {/* Negative row */}
                  <div style={{ marginBottom: "9px" }}>
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: "5px" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <ThumbsDown size={10} style={{ color: "#DC2626" }} />
                        <span style={{ color: "#475569", fontSize: "11px", fontWeight: 500 }}>
                          Negatif
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: "#DC2626", fontSize: "11px", fontWeight: 700 }}>
                          {Math.round(
                            (selected.negativeMentions / selected.totalMentions) * 100
                          )}%
                        </span>
                        <span style={{ color: "#94A3B8", fontSize: "10px" }}>
                          {selected.negativeMentions} ulasan
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "#F1F5F9",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(selected.negativeMentions / selected.totalMentions) * 100}%`,
                          height: "100%",
                          background: "#FCA5A5",
                          borderRadius: "4px",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>

                  {/* Positive row */}
                  <div>
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: "5px" }}
                    >
                      <div className="flex items-center gap-1.5">
                        <ThumbsUp size={10} style={{ color: "#16A34A" }} />
                        <span style={{ color: "#475569", fontSize: "11px", fontWeight: 500 }}>
                          Positif
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: "#16A34A", fontSize: "11px", fontWeight: 700 }}>
                          {Math.round(
                            (selected.positiveMentions / selected.totalMentions) * 100
                          )}%
                        </span>
                        <span style={{ color: "#94A3B8", fontSize: "10px" }}>
                          {selected.positiveMentions} ulasan
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        background: "#F1F5F9",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${(selected.positiveMentions / selected.totalMentions) * 100}%`,
                          height: "100%",
                          background: "#86EFAC",
                          borderRadius: "4px",
                          transition: "width 0.6s ease",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ══════════ CARD: Pain Score Detail ══════════ */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Top accent strip */}
                <div style={{ height: "3px", background: scoreColor(selected.painScore) }} />

                <div style={{ padding: "18px 20px" }}>
                  {/* Header row */}
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: "16px" }}
                  >
                    <div className="flex items-center gap-2">
                      <Flame size={13} style={{ color: "#64748B" }} />
                      <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                        Pain Score Detail
                      </span>
                    </div>
                    {/* Risk badge */}
                    <div
                      className="flex items-center gap-1.5"
                      style={{
                        padding: "3px 10px",
                        background: risk.bg,
                        border: `1px solid ${risk.border}`,
                        borderRadius: "6px",
                      }}
                    >
                      <AlertTriangle size={9} style={{ color: risk.color }} />
                      <span style={{ color: risk.color, fontSize: "11px", fontWeight: 700 }}>
                        Risiko {selected.riskLevel}
                      </span>
                    </div>
                  </div>

                  {/* Score number + zone pill */}
                  <div
                    className="flex items-end justify-between"
                    style={{ marginBottom: "16px" }}
                  >
                    <div className="flex items-baseline gap-1.5">
                      <span
                        style={{
                          color: scoreColor(selected.painScore),
                          fontSize: "48px",
                          fontWeight: 800,
                          lineHeight: 1,
                        }}
                      >
                        {selected.painScore}
                      </span>
                      <span style={{ color: "#94A3B8", fontSize: "16px" }}>/100</span>
                    </div>
                    {/* Active zone pill — inline IIFE */}
                    {(() => {
                      const ps = selected.painScore;
                      const zone =
                        ps >= 81
                          ? { label: "KRITIS", color: "#DC2626", bg: "#FEF2F2" }
                          : ps >= 51
                          ? { label: "TINGGI", color: "#EA580C", bg: "#FFF7ED" }
                          : ps >= 26
                          ? { label: "SEDANG", color: "#D97706", bg: "#FFFBEB" }
                          : { label: "RENDAH", color: "#2563EB", bg: "#EFF6FF" };
                      return (
                        <span
                          style={{
                            padding: "3px 10px",
                            background: zone.bg,
                            color: zone.color,
                            fontSize: "10px",
                            fontWeight: 700,
                            borderRadius: "5px",
                            letterSpacing: "0.4px",
                            marginBottom: "4px",
                          }}
                        >
                          {zone.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Segmented zone progress bar */}
                  <div style={{ marginBottom: "14px" }}>
                    {/* Bar segments */}
                    <div className="flex gap-1" style={{ height: "8px", marginBottom: "6px" }}>
                      {[
                        { label: "Rendah", color: "#60A5FA", start: 0,  end: 25  },
                        { label: "Sedang", color: "#FBBF24", start: 26, end: 50  },
                        { label: "Tinggi", color: "#FB923C", start: 51, end: 80  },
                        { label: "Kritis", color: "#F87171", start: 81, end: 100 },
                      ].map((zone) => {
                        const segLen = zone.end - zone.start;
                        const filled = Math.max(
                          0,
                          Math.min(selected.painScore - zone.start, segLen)
                        );
                        const fillPct = (filled / segLen) * 100;
                        return (
                          <div
                            key={zone.label}
                            style={{
                              flex: segLen,
                              background: "#F1F5F9",
                              borderRadius: "4px",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${fillPct}%`,
                                height: "100%",
                                background: zone.color,
                                borderRadius: "4px",
                                transition: "width 0.8s ease",
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    {/* Zone labels */}
                    <div className="flex gap-1">
                      {[
                        { label: "Rendah", color: "#60A5FA", start: 0,  end: 25,  flex: 25 },
                        { label: "Sedang", color: "#FBBF24", start: 26, end: 50,  flex: 25 },
                        { label: "Tinggi", color: "#FB923C", start: 51, end: 80,  flex: 30 },
                        { label: "Kritis", color: "#F87171", start: 81, end: 100, flex: 20 },
                      ].map((zone) => {
                        const isActive =
                          selected.painScore >= zone.start &&
                          selected.painScore <= zone.end;
                        return (
                          <div
                            key={zone.label}
                            style={{ flex: zone.flex, textAlign: "center" }}
                          >
                            <span
                              style={{
                                fontSize: "9px",
                                fontWeight: isActive ? 700 : 400,
                                color: isActive ? zone.color : "#CBD5E1",
                              }}
                            >
                              {zone.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Divider + context text */}
                  <div
                    style={{ height: "1px", background: "#F1F5F9", marginBottom: "12px" }}
                  />
                  <p style={{ color: "#64748B", fontSize: "12px", lineHeight: 1.55 }}>
                    Dari{" "}
                    <strong style={{ color: "#0F1F3D" }}>{selected.totalMentions}</strong>{" "}
                    ulasan, AI mendeteksi tingkat urgensi masalah operasional yang{" "}
                    <span
                      style={{ color: scoreColor(selected.painScore), fontWeight: 600 }}
                    >
                      {selected.painScore >= 81
                        ? "kritis"
                        : selected.painScore >= 51
                        ? "tinggi"
                        : selected.painScore >= 26
                        ? "sedang"
                        : "rendah"}
                    </span>{" "}
                    pada bisnis ini.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Aspect-Based Sentiment ───────────────────────────── */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} style={{ color: "#64748B" }} />
                  <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                    Aspek Sentimen
                  </span>
                  <span
                    style={{
                      background: "#F1F5F9",
                      color: "#64748B",
                      fontSize: "10px",
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: "4px",
                    }}
                  >
                    {selected.aspects.length} aspek
                  </span>
                </div>
                <p style={{ color: "#94A3B8", fontSize: "11px" }}>
                  Klik aspek untuk lihat contoh ulasan
                </p>
              </div>

              <div
                style={{
                  borderTop: "1px solid #F1F5F9",
                  marginTop: "8px",
                  paddingTop: "4px",
                }}
              >
                {selected.aspects.map((aspect) => (
                  <div
                    key={aspect.label}
                    style={{ borderBottom: "1px solid #F8FAFC" }}
                  >
                    <AspectBar
                      aspect={aspect}
                      expanded={expandedAspect === aspect.label}
                      onToggle={() =>
                        setExpandedAspect(
                          expandedAspect === aspect.label ? null : aspect.label
                        )
                      }
                    />
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: "1px solid #F1F5F9" }}>
                <span style={{ color: "#94A3B8", fontSize: "10px", fontWeight: 500 }}>Legenda:</span>
                {[
                  { label: "Positif (≥60)", color: "#16A34A" },
                  { label: "Campuran (35-59)", color: "#D97706" },
                  { label: "Negatif (<35)", color: "#DC2626" },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div
                      style={{ width: "8px", height: "8px", background: l.color, borderRadius: "2px" }}
                    />
                    <span style={{ color: "#64748B", fontSize: "10px" }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Top Quotes ──────────────────────────────────────────── */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Quote size={14} style={{ color: "#64748B" }} />
                <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                  Pain Point Utama dari Ulasan
                </span>
                <span
                  style={{
                    background: "#FEF2F2",
                    color: "#DC2626",
                    border: "1px solid #FECACA",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: "4px",
                  }}
                >
                  AI-extracted
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {selected.topQuotes.map((q, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4"
                    style={{
                      background: "#FAFBFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "#FEF2F2", borderRadius: "5px" }}
                    >
                      <span style={{ color: "#DC2626", fontSize: "10px", fontWeight: 700 }}>
                        {i + 1}
                      </span>
                    </div>
                    <p style={{ color: "#64748B", fontSize: "13px", lineHeight: 1.6, fontStyle: "italic" }}>
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── AI Narrative Summary ────────────────────────────────── */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                className="flex items-center gap-2 px-5 py-3.5"
                style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}
              >
                <div
                  className="w-6 h-6 flex items-center justify-center"
                  style={{ background: "#EEF2FF", borderRadius: "5px" }}
                >
                  <Sparkles size={12} style={{ color: "#4F46E5" }} />
                </div>
                <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                  Narasi Analisis AI
                </span>
                <span
                  style={{
                    background: "#EEF2FF",
                    color: "#4F46E5",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: "4px",
                    marginLeft: "2px",
                  }}
                >
                  Generated by HelicoAI
                </span>
              </div>
              <div className="p-5">
                <p style={{ color: "#475569", fontSize: "14px", lineHeight: 1.8 }}>
                  {selected.aiSummary}
                </p>
              </div>
            </div>

            {/* ── Opportunity Recommendations ─────────────────────────── */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                className="flex items-center gap-2 px-5 py-3.5"
                style={{ background: "#F0FDF4", borderBottom: "1px solid #BBF7D0" }}
              >
                <div
                  className="w-6 h-6 flex items-center justify-center"
                  style={{ background: "#DCFCE7", borderRadius: "5px" }}
                >
                  <Lightbulb size={12} style={{ color: "#16A34A" }} />
                </div>
                <span style={{ color: "#0F1F3D", fontSize: "13px", fontWeight: 600 }}>
                  Rekomendasi Peluang
                </span>
                <span
                  style={{
                    background: "#DCFCE7",
                    color: "#16A34A",
                    border: "1px solid #BBF7D0",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "1px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {selected.opportunities.length} aksi
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-col gap-2.5">
                  {selected.opportunities.map((opp, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3.5"
                      style={{
                        background: "#F0FDF4",
                        border: "1px solid #D1FAE5",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: "#DCFCE7", borderRadius: "5px" }}
                      >
                        <CheckCircle2 size={13} style={{ color: "#16A34A" }} />
                      </div>
                      <p style={{ color: "#374151", fontSize: "13px", lineHeight: 1.6 }}>
                        {opp}
                      </p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className="flex items-center justify-between mt-5 pt-4"
                  style={{ borderTop: "1px solid #E2E8F0" }}
                >
                  <p style={{ color: "#94A3B8", fontSize: "12px" }}>
                    Gunakan rekomendasi ini sebagai bahan outreach ke{" "}
                    <strong style={{ color: "#0F1F3D" }}>{selected.name}</strong>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex items-center gap-2 px-4 py-2 transition-all"
                      style={{
                        background: "#F0FDF4",
                        border: "1px solid #BBF7D0",
                        color: "#16A34A",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#25D366";
                        (e.currentTarget as HTMLElement).style.color = "#FFFFFF";
                        (e.currentTarget as HTMLElement).style.borderColor = "#25D366";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#F0FDF4";
                        (e.currentTarget as HTMLElement).style.color = "#16A34A";
                        (e.currentTarget as HTMLElement).style.borderColor = "#BBF7D0";
                      }}
                    >
                      <MessageCircle size={13} />
                      Kirim via WA
                    </button>
                    <button
                      className="flex items-center gap-2 px-4 py-2 transition-all"
                      style={{
                        background: "#4F46E5",
                        color: "#FFFFFF",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "#4338CA")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.background = "#4F46E5")
                      }
                      onClick={() => setCampaignModalOpen(true)}
                    >
                      <Zap size={13} />
                      Tambah ke Campaign
                      <ArrowUpRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <AddToCampaignModal
        open={campaignModalOpen}
        onClose={() => setCampaignModalOpen(false)}
        leadName={selected.name}
      />
    </div>
  );
}
