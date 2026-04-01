export type TimeSlot = {
  id: string;
  time: string;
  price: number;
  isBooked: boolean;
  registrant?: SlotRegistrant;
};

export type Venue = {
  id: string;
  name: string;
  festivalName: string;
  venueFacilities: string[];
  festivalFacilities: string[];
  slots: TimeSlot[];
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

// KAMUS FASILITAS STATIS (Disambungkan dengan ID dari Backend nanti)
export const VENUE_FACILITIES: Record<string, { venue: string[]; festival: string[] }> = {
  "teater-besar-fest1": {
    venue: [
      "Ukuran panggung : L 15,60 X P 14,38", "Gamelan Slendro Pelog & Mic", "Backdrop Belakang hitam", "Lighting General & Sound", "Mic 10 chanel standby", "BANCIK / LEVEL 3 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festival: [
      "Durasi 30 menit", "Ruang tunggu pentas VIP (1 jam sebelum pementasan)", "E-sertifikat (peserta dan sanggar)", "Figura sertifikat A3 sanggar", "Dokumentasi Video (link drive)", "Vandel 24Jam Menari", "Blocking tanggal 28 April 2026"
    ],
  },
  "teater-besar-fest2": {
    venue: [
      "Ukuran panggung : L 15,60 X P 14,38", "Gamelan Slendro Pelog & Mic", "Backdrop Belakang hitam", "Lighting General & Sound", "Mic 10 chanel standby", "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festival: [
      "Durasi 20 menit", "Ruang tunggu pentas VIP (1 jam sebelum pementasan)", "E-sertifikat (peserta dan sanggar)", "Figura Sertifikat A3 sanggar", "Dokumentasi Video (link Drive)"
    ],
  },
  "teater-kecil-fest2": {
    venue: [
      "Ukuran Panggung : L 10,30 X P 10,46", "Backdrop Belakang hitam", "Lighting General & Sound", "Mic 10 chanel standby", "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festival: [
      "Durasi 20 menit", "Ruang tunggu pentas (1 jam sebelum pementasan)", "E-sertifikat (peserta dan sanggar)", "Figura Sertifikat A3 sanggar", "Dokumentasi Video (link Drive)"
    ],
  },
  "teater-kecil-fest3": {
    venue: [
      "Ukuran Panggung : L 10,30 X P 10,46", "Backdrop Belakang hitam", "Lighting General & Sound", "Mic 10 chanel standby", "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festival: [
      "Durasi 20 menit", "E-sertifikat (peserta dan sanggar)", "Ruang tunggu pementasan (1 jam sebelum pementasan)", "Dokumentasi video (YouTube ISI Surakarta)"
    ],
  },
  "pendopo-fest3": {
    venue: [
      "Ukuran Panggung L 9 X P 9", "Gamelan Slendro Pelog & Mic", "Lighting General & Sound", "Mic 10 chanel standby", "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festival: [
      "Durasi 20 menit", "E-sertifikat (peserta dan sanggar)", "Ruang tunggu pementasan (1 jam sebelum pementasan)", "Dokumentasi video (YouTube ISI Surakarta)"
    ],
  },
  "teater-kapal-fest3": {
    venue: [
      "Ukuran Panggung L 11 X P 14 (setengah lingkaran)", "Lighting General & Sound", "Mic 10 Chanel standby", "BANCIK / LEVEL 2 BUAH (p 200cm x L 100cm x t 40cm)"
    ],
    festival: [
      "Durasi 20 menit", "E-sertifikat (peserta dan sanggar)", "Ruang tunggu pementasan (1 jam sebelum pementasan)", "Dokumentasi video (YouTube ISI Surakarta)"
    ],
  },
};