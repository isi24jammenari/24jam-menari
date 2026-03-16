export type Venue = {
  id: string;
  name: string;
  description: string;
  icon: string;
  slots: TimeSlot[];
};

export type TimeSlot = {
  id: string;
  time: string;
  price: number;
  isBooked: boolean;
  registrant?: SlotRegistrant;
};

export type SlotRegistrant = {
  nama: string;
  kota: string;
  namaKontak: string;
  cp: string;
  judulTari: string;
  durasiKarya: string;
  // null = belum diisi field itu
  formStatus: "lengkap" | "sebagian" | "kosong";
};

// ─── DUMMY REGISTRASI ────────────────────────────────────────────────
const R = (
  nama: string,
  kota: string,
  namaKontak: string,
  cp: string,
  judulTari: string,
  durasiKarya: string,
  formStatus: SlotRegistrant["formStatus"]
): SlotRegistrant => ({ nama, kota, namaKontak, cp, judulTari, durasiKarya, formStatus });

const REGS: Record<string, SlotRegistrant> = {
  // ── PENDOPO ──────────────────────────────────────────────────────────
  "pendopo-0900": R("Sanggar Sekar Jawi", "Yogyakarta", "Budi Santoso", "08123456789", "Tari Bedhaya Ketawang", "20 menit", "lengkap"),
  "pendopo-0920": R("Komunitas Tari Jawa Tengah", "Solo", "Ratna Dewi", "08234567890", "Gambyong Pareanom", "20 menit", "lengkap"),
  "pendopo-0940": R("Sanggar Melati Putih", "Semarang", "Hendra W.", "08345678901", "Tari Topeng Ireng", "20 menit", "sebagian"),
  "pendopo-1000": R("Padepokan Seni Mataram", "Yogyakarta", "Siti Rahayu", "08456789012", "Beksan Wireng", "20 menit", "lengkap"),
  "pendopo-1020": R("Sanggar Anggrek", "Purwokerto", "Dian Pratiwi", "08567890123", "Tari Kukilo", "20 menit", "kosong"),
  "pendopo-1100": R("Kelompok Tari Cahaya", "Magelang", "Agus Priyanto", "08678901234", "Tari Merak", "20 menit", "sebagian"),
  "pendopo-1120": R("Sanggar Tirta Kencana", "Demak", "Nining Lestari", "08789012345", "Tari Kethek Ogleng", "20 menit", "kosong"),
  "pendopo-1300": R("Studio Tari Nusantara", "Klaten", "Wahyu Adi", "08890123456", "Tari Bondan Payung", "20 menit", "lengkap"),
  "pendopo-1400": R("Sanggar Wahyu Budaya", "Sukoharjo", "Eko Putranto", "08901234567", "Tari Srimpi", "20 menit", "sebagian"),
  "pendopo-1500": R("Perkumpulan Tari Abdi Seni", "Boyolali", "Lina Marlina", "08012345678", "Tari Gambir Anom", "20 menit", "kosong"),
  "pendopo-1600": R("Perorangan — Dewi Arum", "Salatiga", "Dewi Arum", "08111222333", "Tari Golek Manis", "20 menit", "lengkap"),

  // ── TEATER KECIL ─────────────────────────────────────────────────────
  "tk-1000": R("Sanggar Cipta Budaya", "Surabaya", "Arif Wibowo", "08222333444", "Tari Remo", "20 menit", "lengkap"),
  "tk-1020": R("Komunitas Seni Arek", "Malang", "Sari Indah", "08333444555", "Tari Gandrung", "20 menit", "sebagian"),
  "tk-1100": R("Studio Gerak Nusantara", "Banyuwangi", "Joni Prasetyo", "08444555666", "Tari Jejer Gandrung", "20 menit", "kosong"),
  "tk-2200": R("Sanggar Reog Ponorogo", "Ponorogo", "Marto Suwito", "08555666777", "Reog Ponorogo", "20 menit", "lengkap"),
  "tk-2220": R("Kelompok Tari Malam Seni", "Kediri", "Fitri Handayani", "08666777888", "Tari Jaranan", "20 menit", "sebagian"),
  "tk-2300": R("Perorangan — Galih Surya", "Blitar", "Galih Surya", "08777888999", "Tari Bapang", "20 menit", "kosong"),

  // ── TEATER BESAR ─────────────────────────────────────────────────────
  "tb-2000": R("Komunitas Tari Jayabaya", "Magelang", "Tono Wibisono", "08888999000", "Sendratari Ramayana", "30 menit", "lengkap"),
  "tb-2030": R("Padepokan Seni Borobudur", "Purworejo", "Rini Susanti", "08999000111", "Tari Shinta", "30 menit", "lengkap"),
  "tb-2100": R("Sanggar Mahesa Jenar", "Temanggung", "Bagus Nugroho", "08100200300", "Tari Panji Semirang", "30 menit", "sebagian"),
  "tb-2130": R("Kelompok Teater Dieng", "Wonosobo", "Yuli Astuti", "08200300400", "Tari Lengger Lanang", "30 menit", "kosong"),
  "tb-2200": R("Komunitas Seni Candrabirawa", "Kebumen", "Hadi Purnomo", "08300400500", "Tari Dolalak", "30 menit", "lengkap"),
  "tb-2300": R("Studio Wayang Wong", "Purbalingga", "Slamet Riyadi", "08400500600", "Wayang Wong", "30 menit", "sebagian"),

  // ── TEATER KAPAL ─────────────────────────────────────────────────────
  "tkapal-1600": R("Sanggar Bahari Nusantara", "Jepara", "Kusuma Dewi", "08500600700", "Tari Kridhajati", "20 menit", "lengkap"),
  "tkapal-1620": R("Kelompok Tari Laut Selatan", "Rembang", "Fajar Setiawan", "08600700800", "Tari Tayub", "20 menit", "sebagian"),
  "tkapal-1700": R("Sanggar Angin Laut", "Pati", "Sri Mulyati", "08700800900", "Tari Sintren", "20 menit", "kosong"),
};

// ─── HELPER ──────────────────────────────────────────────────────────
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

// ─── DATA VENUES ─────────────────────────────────────────────────────
export const venues: Venue[] = [
  {
    id: "pendopo",
    name: "Pendopo",
    description: "Panggung terbuka bernuansa tradisional Jawa",
    icon: "🏛️",
    slots: [
      { id: "pendopo-0900", time: "09.00 – 09.20", price: 750000, isBooked: true,  registrant: REGS["pendopo-0900"] },
      { id: "pendopo-0920", time: "09.20 – 09.40", price: 750000, isBooked: true,  registrant: REGS["pendopo-0920"] },
      { id: "pendopo-0940", time: "09.40 – 10.00", price: 750000, isBooked: true,  registrant: REGS["pendopo-0940"] },
      { id: "pendopo-1000", time: "10.00 – 10.20", price: 750000, isBooked: true,  registrant: REGS["pendopo-1000"] },
      { id: "pendopo-1020", time: "10.20 – 10.40", price: 750000, isBooked: true,  registrant: REGS["pendopo-1020"] },
      { id: "pendopo-1040", time: "10.40 – 11.00", price: 750000, isBooked: false },
      { id: "pendopo-1100", time: "11.00 – 11.20", price: 750000, isBooked: true,  registrant: REGS["pendopo-1100"] },
      { id: "pendopo-1120", time: "11.20 – 11.40", price: 750000, isBooked: true,  registrant: REGS["pendopo-1120"] },
      { id: "pendopo-1140", time: "11.40 – 12.00", price: 750000, isBooked: false },
      { id: "pendopo-1300", time: "13.00 – 13.20", price: 750000, isBooked: true,  registrant: REGS["pendopo-1300"] },
      { id: "pendopo-1320", time: "13.20 – 13.40", price: 750000, isBooked: false },
      { id: "pendopo-1340", time: "13.40 – 14.00", price: 750000, isBooked: false },
      { id: "pendopo-1400", time: "14.00 – 14.20", price: 750000, isBooked: true,  registrant: REGS["pendopo-1400"] },
      { id: "pendopo-1420", time: "14.20 – 14.40", price: 750000, isBooked: false },
      { id: "pendopo-1440", time: "14.40 – 15.00", price: 750000, isBooked: false },
      { id: "pendopo-1500", time: "15.00 – 15.20", price: 750000, isBooked: true,  registrant: REGS["pendopo-1500"] },
      { id: "pendopo-1520", time: "15.20 – 15.40", price: 750000, isBooked: false },
      { id: "pendopo-1540", time: "15.40 – 16.00", price: 750000, isBooked: false },
      { id: "pendopo-1600", time: "16.00 – 16.20", price: 750000, isBooked: true,  registrant: REGS["pendopo-1600"] },
      { id: "pendopo-1620", time: "16.20 – 16.40", price: 750000, isBooked: false },
      { id: "pendopo-1640", time: "16.40 – 17.00", price: 750000, isBooked: false },
    ],
  },
  {
    id: "teater-kecil",
    name: "Teater Kecil",
    description: "Ruang pertunjukan intim untuk ekspresi mendalam",
    icon: "🎭",
    slots: [
      { id: "tk-1000", time: "10.00 – 10.20", price: 750000,  isBooked: true,  registrant: REGS["tk-1000"] },
      { id: "tk-1020", time: "10.20 – 10.40", price: 750000,  isBooked: true,  registrant: REGS["tk-1020"] },
      { id: "tk-1040", time: "10.40 – 11.00", price: 750000,  isBooked: false },
      { id: "tk-1100", time: "11.00 – 11.20", price: 750000,  isBooked: true,  registrant: REGS["tk-1100"] },
      { id: "tk-1120", time: "11.20 – 11.40", price: 750000,  isBooked: false },
      { id: "tk-1140", time: "11.40 – 12.00", price: 750000,  isBooked: false },
      { id: "tk-2200", time: "22.00 – 22.20", price: 1000000, isBooked: true,  registrant: REGS["tk-2200"] },
      { id: "tk-2220", time: "22.20 – 22.40", price: 1000000, isBooked: true,  registrant: REGS["tk-2220"] },
      { id: "tk-2240", time: "22.40 – 23.00", price: 1000000, isBooked: false },
      { id: "tk-2300", time: "23.00 – 23.20", price: 1000000, isBooked: true,  registrant: REGS["tk-2300"] },
      { id: "tk-2320", time: "23.20 – 23.40", price: 1000000, isBooked: false },
      { id: "tk-2340", time: "23.40 – 24.00", price: 1000000, isBooked: false },
    ],
  },
  {
    id: "teater-besar",
    name: "Teater Besar",
    description: "Panggung utama untuk pertunjukan spektakuler malam hari",
    icon: "🎪",
    slots: [
      { id: "tb-2000", time: "20.00 – 20.30", price: 1250000, isBooked: true,  registrant: REGS["tb-2000"] },
      { id: "tb-2030", time: "20.30 – 21.00", price: 1250000, isBooked: true,  registrant: REGS["tb-2030"] },
      { id: "tb-2100", time: "21.00 – 21.30", price: 1250000, isBooked: true,  registrant: REGS["tb-2100"] },
      { id: "tb-2130", time: "21.30 – 22.00", price: 1250000, isBooked: true,  registrant: REGS["tb-2130"] },
      { id: "tb-2200", time: "22.00 – 22.30", price: 1250000, isBooked: true,  registrant: REGS["tb-2200"] },
      { id: "tb-2230", time: "22.30 – 23.00", price: 1250000, isBooked: false },
      { id: "tb-2300", time: "23.00 – 23.30", price: 1250000, isBooked: true,  registrant: REGS["tb-2300"] },
      { id: "tb-2330", time: "23.30 – 24.00", price: 1250000, isBooked: false },
    ],
  },
  {
    id: "teater-kapal",
    name: "Teater Kapal",
    description: "Venue unik dengan suasana senja yang memukau",
    icon: "⛵",
    slots: [
      { id: "tkapal-1600", time: "16.00 – 16.20", price: 750000, isBooked: true,  registrant: REGS["tkapal-1600"] },
      { id: "tkapal-1620", time: "16.20 – 16.40", price: 750000, isBooked: true,  registrant: REGS["tkapal-1620"] },
      { id: "tkapal-1640", time: "16.40 – 17.00", price: 750000, isBooked: false },
      { id: "tkapal-1700", time: "17.00 – 17.20", price: 750000, isBooked: true,  registrant: REGS["tkapal-1700"] },
      { id: "tkapal-1720", time: "17.20 – 17.40", price: 750000, isBooked: false },
    ],
  },
];

export const getVenueById = (id: string): Venue | undefined =>
  venues.find((v) => v.id === id);
