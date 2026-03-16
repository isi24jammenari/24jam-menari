import { create } from "zustand";

export type BookingState = {
  selectedVenueId: string | null;
  selectedSlotId: string | null;
  selectedVenueName: string | null;
  selectedSlotTime: string | null;
  selectedSlotPrice: number | null;

  paymentStatus: "idle" | "pending" | "success" | "failed" | "expired";
  timerExpiry: number | null;

  userEmail: string | null;
  userName: string | null;
  isLoggedIn: boolean;

  selectVenue: (id: string, name: string) => void;
  selectSlot: (id: string, time: string, price: number) => void;
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
  paymentStatus: "idle",
  timerExpiry: null,
  userEmail: null,
  userName: null,
  isLoggedIn: false,

  selectVenue: (id, name) =>
    set({ selectedVenueId: id, selectedVenueName: name, selectedSlotId: null }),

  selectSlot: (id, time, price) =>
    set({ selectedSlotId: id, selectedSlotTime: time, selectedSlotPrice: price }),

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
      paymentStatus: "idle",
      timerExpiry: null,
    }),
}));
