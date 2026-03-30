import { create } from "zustand";
import { SlotRegistrant } from "../data/venues"; // Import tipe data yang sudah kita update

export type BookingState = {
  selectedVenueId: string | null;
  selectedSlotId: string | null;
  selectedVenueName: string | null;
  selectedSlotTime: string | null;
  selectedSlotPrice: number | null;

  // Tambahkan state untuk menyimpan data formulir pendaftar
  registrant: SlotRegistrant | null;

  paymentStatus: "idle" | "pending" | "success" | "failed" | "expired";
  timerExpiry: number | null;

  userEmail: string | null;
  userName: string | null;
  isLoggedIn: boolean;

  selectVenue: (id: string, name: string) => void;
  selectSlot: (id: string, time: string, price: number) => void;
  
  // Tambahkan fungsi untuk menyimpan data pendaftar
  setRegistrant: (data: SlotRegistrant) => void;
  
  startPaymentTimer: () => void;
  setPaymentStatus: (status: BookingState["paymentStatus"]) => void;
  setUser: (email: string, name: string) => void;
  setLoggedIn: (val: boolean) => void;
  resetBooking: () => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  selectedVenueId: null,
  selectedSlotId: null,
  selectedVenueName: null,
  selectedSlotTime: null,
  selectedSlotPrice: null,
  
  // Inisialisasi registrant
  registrant: null,

  paymentStatus: "idle",
  timerExpiry: null,
  userEmail: null,
  userName: null,
  isLoggedIn: false,

  selectVenue: (id, name) =>
    set({ selectedVenueId: id, selectedVenueName: name, selectedSlotId: null }),

  selectSlot: (id, time, price) =>
    set({ selectedSlotId: id, selectedSlotTime: time, selectedSlotPrice: price }),

  // Implementasi fungsi setRegistrant
  setRegistrant: (data) => 
    set({ registrant: data }),

  startPaymentTimer: () =>
    set({ timerExpiry: Date.now() + 15 * 60 * 1000, paymentStatus: "pending" }),

  setPaymentStatus: (status) => set({ paymentStatus: status }),

  setUser: (email, name) =>
    set({ userEmail: email, userName: name, isLoggedIn: true }),

  setLoggedIn: (val) => set({ isLoggedIn: val }),

  resetBooking: () =>
    set({
      selectedVenueId: null,
      selectedSlotId: null,
      selectedVenueName: null,
      selectedSlotTime: null,
      selectedSlotPrice: null,
      registrant: null, // Reset juga data pendaftar
      paymentStatus: "idle",
      timerExpiry: null,
    }),
}));