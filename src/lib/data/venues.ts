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

export type SlotRegistrant = {
  nama: string;
  kota: string;
  namaKontak: string;
  cp: string;
  judulTari: string;
  formStatus: "lengkap" | "sebagian" | "kosong";
};

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

export const venues: Venue[] = [
  // 1. TEATER BESAR GENDHON HUMARDANI (FESTIVAL 1)
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
      "BANCIK / LEVEL 3 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festivalFacilities: [
      "Durasi 30 menit",
      "Ruang tunggu pentas VIP (1 jam sebelum pementasan)",
      "E-sertifikat (peserta dan sanggar)",
      "Figura sertifikat A3 sanggar",
      "Dokumentasi Video (link drive)",
      "Vandel 24Jam Menari",
      "Blocking tanggal 28 April 2026"
    ],
    slots: [
      { id: "tb1-1", time: "20.00 - 20.30", price: 1350000, isBooked: false },
      { id: "tb1-2", time: "20.30 - 21.00", price: 1350000, isBooked: false },
      { id: "tb1-3", time: "21.00 - 21.30", price: 1350000, isBooked: false },
      { id: "tb1-4", time: "21.30 - 22.00", price: 1350000, isBooked: false },
      { id: "tb1-5", time: "22.00 - 22.30", price: 1350000, isBooked: false },
      { id: "tb1-6", time: "22.30 - 23.00", price: 1350000, isBooked: false },
      { id: "tb1-7", time: "23.00 - 23.30", price: 1350000, isBooked: false },
      { id: "tb1-8", time: "23.30 - 24.00", price: 1350000, isBooked: false },
    ],
  },
  
  // 2. TEATER BESAR GENDHON HUMARDANI (FESTIVAL 2)
  {
    id: "teater-besar-fest2",
    name: "TEATER BESAR GENDHON HUMARDANI",
    festivalName: "FESTIVAL 2",
    venueFacilities: [
      "Ukuran panggung : L 15,60 X P 14,38",
      "Gamelan Slendro Pelog & Mic",
      "Backdrop Belakang hitam",
      "Lighting General & Sound",
      "Mic 10 chanel standby",
      "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festivalFacilities: [
      "Durasi 20 menit",
      "Ruang tunggu pentas VIP (1 jam sebelum pementasan)",
      "E-sertifikat (peserta dan sanggar)",
      "Figura Sertifikat A3 sanggar",
      "Dokumentasi Video (link Drive)"
    ],
    slots: [
      { id: "tb2-1", time: "10.00 - 10.20", price: 1100000, isBooked: false },
      { id: "tb2-2", time: "10.20 - 10.40", price: 1100000, isBooked: false },
      { id: "tb2-3", time: "10.40 - 11.00", price: 1100000, isBooked: false },
      { id: "tb2-4", time: "11.00 - 11.20", price: 1100000, isBooked: false },
      { id: "tb2-5", time: "11.20 - 11.40", price: 1100000, isBooked: false },
      { id: "tb2-6", time: "11.40 - 12.00", price: 1100000, isBooked: false },
    ],
  },

  // 3. TEATER KECIL KRT KUSUMA KESAWA (FESTIVAL 2)
  {
    id: "teater-kecil-fest2",
    name: "TEATER KECIL KRT KUSUMA KESAWA",
    festivalName: "FESTIVAL 2",
    venueFacilities: [
      "Ukuran Panggung : L 10,30 X P 10,46",
      "Backdrop Belakang hitam",
      "Lighting General & Sound",
      "Mic 10 chanel standby",
      "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festivalFacilities: [
      "Durasi 20 menit",
      "Ruang tunggu pentas (1 jam sebelum pementasan)",
      "E-sertifikat (peserta dan sanggar)",
      "Figura Sertifikat A3 sanggar",
      "Dokumentasi Video (link Drive)"
    ],
    slots: [
      { id: "tk2-1", time: "22.00 - 22.20", price: 1100000, isBooked: false },
      { id: "tk2-2", time: "22.20 - 22.40", price: 1100000, isBooked: false },
      { id: "tk2-3", time: "22.40 - 23.00", price: 1100000, isBooked: false },
      { id: "tk2-4", time: "23.00 - 23.20", price: 1100000, isBooked: false },
      { id: "tk2-5", time: "23.20 - 23.40", price: 1100000, isBooked: false },
      { id: "tk2-6", time: "23.40 - 24.00", price: 1100000, isBooked: false },
    ],
  },

  // 4. TEATER KECIL KRT KUSUMA KESAWA (FESTIVAL 3)
  {
    id: "teater-kecil-fest3",
    name: "TEATER KECIL KRT KUSUMA KESAWA",
    festivalName: "FESTIVAL 3",
    venueFacilities: [
      "Ukuran Panggung : L 10,30 X P 10,46",
      "Backdrop Belakang hitam",
      "Lighting General & Sound",
      "Mic 10 chanel standby",
      "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festivalFacilities: [
      "Durasi 20 menit",
      "E-sertifikat (peserta dan sanggar)",
      "Ruang tunggu pementasan (1 jam sebelum pementasan)",
      "Dokumentasi video (YouTube ISI Surakarta)"
    ],
    slots: [
      { id: "tk3-1", time: "10.00 - 10.20", price: 800000, isBooked: false },
      { id: "tk3-2", time: "10.20 - 10.40", price: 800000, isBooked: false },
      { id: "tk3-3", time: "10.40 - 11.00", price: 800000, isBooked: false },
      { id: "tk3-4", time: "11.00 - 11.20", price: 800000, isBooked: false },
      { id: "tk3-5", time: "11.20 - 11.40", price: 800000, isBooked: false },
      { id: "tk3-6", time: "11.40 - 12.00", price: 800000, isBooked: false },
    ],
  },

  // 5. PENDOPO GPH DJOYOKUSUMO (FESTIVAL 3)
  {
    id: "pendopo-fest3",
    name: "PENDOPO GPH DJOYOKUSUMO",
    festivalName: "FESTIVAL 3",
    venueFacilities: [
      "Ukuran Panggung L 9 X P 9",
      "Gamelan Slendro Pelog & Mic",
      "Lighting General & Sound",
      "Mic 10 chanel standby",
      "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festivalFacilities: [
      "Durasi 20 menit",
      "E-sertifikat (peserta dan sanggar)",
      "Ruang tunggu pementasan (1 jam sebelum pementasan)",
      "Dokumentasi video (YouTube ISI Surakarta)"
    ],
    slots: [
      { id: "p-1", time: "09.00 - 09.20", price: 800000, isBooked: false },
      { id: "p-2", time: "09.20 - 09.40", price: 800000, isBooked: false },
      { id: "p-3", time: "09.40 - 10.00", price: 800000, isBooked: false },
      { id: "p-4", time: "10.00 - 10.20", price: 800000, isBooked: false },
      { id: "p-5", time: "10.20 - 10.40", price: 800000, isBooked: false },
      { id: "p-6", time: "10.40 - 11.00", price: 800000, isBooked: false },
      { id: "p-7", time: "11.00 - 11.20", price: 800000, isBooked: false },
      { id: "p-8", time: "11.20 - 11.40", price: 800000, isBooked: false },
      { id: "p-9", time: "11.40 - 12.00", price: 800000, isBooked: false },
      { id: "p-10", time: "13.00 - 13.20", price: 800000, isBooked: false },
      { id: "p-11", time: "13.20 - 13.40", price: 800000, isBooked: false },
      { id: "p-12", time: "13.40 - 14.00", price: 800000, isBooked: false },
      { id: "p-13", time: "14.00 - 14.20", price: 800000, isBooked: false },
      { id: "p-14", time: "14.20 - 14.40", price: 800000, isBooked: false },
      { id: "p-15", time: "14.40 - 15.00", price: 800000, isBooked: false },
      { id: "p-16", time: "15.00 - 15.20", price: 800000, isBooked: false },
      { id: "p-17", time: "15.20 - 15.40", price: 800000, isBooked: false },
      { id: "p-18", time: "15.40 - 16.00", price: 800000, isBooked: false },
      { id: "p-19", time: "16.00 - 16.20", price: 800000, isBooked: false },
      { id: "p-20", time: "16.20 - 16.40", price: 800000, isBooked: false },
      { id: "p-21", time: "16.40 - 17.00", price: 800000, isBooked: false },
    ],
  },

  // 6. TEATER KAPAL (FESTIVAL 3)
  {
    id: "teater-kapal-fest3",
    name: "TEATER KAPAL",
    festivalName: "FESTIVAL 3",
    venueFacilities: [
      "Ukuran Panggung L 11 X P 14 (setengah lingkaran)",
      "Lighting General & Sound",
      "Mic 10 Chanel standby",
      "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festivalFacilities: [
      "Durasi 20 menit",
      "E-sertifikat (peserta dan sanggar)",
      "Ruang tunggu pementasan (1 jam sebelum pementasan)",
      "Dokumentasi video (YouTube ISI Surakarta)"
    ],
    slots: [
      { id: "tkapal-1", time: "16.00 - 16.20", price: 800000, isBooked: false },
      { id: "tkapal-2", time: "16.20 - 16.40", price: 800000, isBooked: false },
      { id: "tkapal-3", time: "16.40 - 17.00", price: 800000, isBooked: false },
      { id: "tkapal-4", time: "17.00 - 17.20", price: 800000, isBooked: false },
      { id: "tkapal-5", time: "17.20 - 17.40", price: 800000, isBooked: false },
    ],
  },
];

export const getVenueById = (id: string): Venue | undefined =>
  venues.find((v) => v.id === id);