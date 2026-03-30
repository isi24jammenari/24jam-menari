export type Venue = {
  id: string;
  name: string;
  festivalName: string;
  venueFacilities: string[];
  festivalFacilities: string[];
  slots: TimeSlot[];
};

export type TimeSlot = {
  id: string;
  time: string;
  price: number;
  isBooked: boolean;
  registrant?: SlotRegistrant;
};

// Tipe data tetap dipertahankan agar tidak merusak halaman Admin Dashboard
export type SlotRegistrant = {
  nama: string;
  kota: string;
  namaKontak: string;
  cp: string;
  judulTari: string;
  durasiKarya: string;
  formStatus: "lengkap" | "sebagian" | "kosong";
};

// ─── HELPER ──────────────────────────────────────────────────────────
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

// ─── DATA VENUES (5 ENTITAS - BERSIH) ─────────────────────────────────
export const venues: Venue[] = [
  {
    id: "teater-besar-fest1",
    name: "TEATER BESAR GENDHON HUMARDANI",
    festivalName: "FESTIVAL 1",
    venueFacilities: [
      "Ukuran panggung : L 15,60 X P 14,38",
      "Gamelan Slendro Pelog & Mic",
      "Backdrop Belakang hitam",
      "Lighting General & Sound",
      "Mic 10 chanel standby",
      "Bancik Level 3"
    ],
    festivalFacilities: [
      "Durasi 30'",
      "Ruang tunggu pentas (1 jam sebelum pementasan)",
      "E-sertifikat (peserta dan sanggar)",
      "Figura sertifikat A3 sanggar",
      "Dokumentasi Video (link drive)",
      "Vandel 24Jam Menari",
      "Blocking tanggal 28 April 2026"
    ],
    slots: [
      { id: "tb-2000", time: "20.00 – 20.30", price: 1350000, isBooked: false },
      { id: "tb-2030", time: "20.30 – 21.00", price: 1350000, isBooked: false },
      { id: "tb-2100", time: "21.00 – 21.30", price: 1350000, isBooked: false },
      { id: "tb-2130", time: "21.30 – 22.00", price: 1350000, isBooked: false },
    ],
  },
  {
    id: "teater-kecil-fest2",
    name: "TEATER KECIL KRT KUSUMA KESAWA",
    festivalName: "FESTIVAL 2",
    venueFacilities: [
      "Ukuran Panggung : L 10,30 X P 10,46",
      "Backdrop Belakang hitam",
      "Lighting General & Sound",
      "Mic 10 chanel standby",
      "Bancik Level 2"
    ],
    festivalFacilities: [
      "Durasi 20'",
      "Ruang tunggu pentas (1 jam sebelum pementasan)",
      "E-sertifikat (peserta dan sanggar)",
      "Figura Sertifikat A3 sanggar",
      "Dokumentasi Video (link Drive)"
    ],
    slots: [
      { id: "tk-1000", time: "10.00 – 10.20", price: 1100000, isBooked: false },
      { id: "tk-1020", time: "10.20 – 10.40", price: 1100000, isBooked: false },
      { id: "tk-1040", time: "10.40 – 11.00", price: 1100000, isBooked: false },
    ],
  },
  {
    id: "teater-kecil-fest3",
    name: "TEATER KECIL KRT KUSUMA KESAWA",
    festivalName: "FESTIVAL 3",
    venueFacilities: [
      "Ukuran Panggung : L 10,30 X P 10,46",
      "Backdrop Belakang hitam",
      "Lighting General & Sound",
      "Mic 10 chanel standby",
      "Bancik Level 2"
    ],
    festivalFacilities: [
      "Durasi 20'",
      "E-sertifikat (peserta dan sanggar)",
      "Ruang tunggu pementasan (1 jam sebelum pementasan)",
      "Dokumentasi video (YouTube ISI Surakarta)"
    ],
    slots: [
      { id: "tk3-2200", time: "22.00 – 22.20", price: 800000, isBooked: false },
      { id: "tk3-2220", time: "22.20 – 22.40", price: 800000, isBooked: false },
      { id: "tk3-2240", time: "22.40 – 23.00", price: 800000, isBooked: false },
    ],
  },
  {
    id: "pendopo-fest3",
    name: "PENDOPO GPH DJOYOKUSUMO",
    festivalName: "FESTIVAL 3",
    venueFacilities: [
      "Ukuran Panggung L 9 X P 9",
      "Gamelan Slendro Pelog & Mic",
      "Lighting General & Sound",
      "Mic 10 chanel standby",
      "Bancik Level 2"
    ],
    festivalFacilities: [
      "Durasi 20'",
      "E-sertifikat (peserta dan sanggar)",
      "Ruang tunggu pementasan (1 jam sebelum pementasan)",
      "Dokumentasi video (YouTube ISI Surakarta)"
    ],
    slots: [
      { id: "pendopo-0900", time: "09.00 – 09.20", price: 800000, isBooked: false },
      { id: "pendopo-0920", time: "09.20 – 09.40", price: 800000, isBooked: false },
      { id: "pendopo-0940", time: "09.40 – 10.00", price: 800000, isBooked: false },
      { id: "pendopo-1000", time: "10.00 – 10.20", price: 800000, isBooked: false },
    ],
  },
  {
    id: "teater-kapal-fest3",
    name: "TEATER KAPAL",
    festivalName: "FESTIVAL 3",
    venueFacilities: [
      "Ukuran Panggung L 11 X P 14 (setengah lingkaran)",
      "Lighting General & Sound",
      "Mic 10 Chanel standby",
      "Bancik Level 2"
    ],
    festivalFacilities: [
      "Durasi 20'",
      "E-sertifikat (peserta dan sanggar)",
      "Ruang tunggu pementasan (1 jam sebelum pementasan)",
      "Dokumentasi video (YouTube ISI Surakarta)"
    ],
    slots: [
      { id: "tkapal-1600", time: "16.00 – 16.20", price: 800000, isBooked: false },
      { id: "tkapal-1620", time: "16.20 – 16.40", price: 800000, isBooked: false },
      { id: "tkapal-1640", time: "16.40 – 17.00", price: 800000, isBooked: false },
    ],
  },
];

export const getVenueById = (id: string): Venue | undefined =>
  venues.find((v) => v.id === id);