// src/lib/store/bookingStore.ts
import { create } from "zustand";
import api from "../api";
import { SlotRegistrant, Venue, VENUE_FACILITIES } from "../data/venues";

export type BookingState = {
  // Data Dinamis API
  venues: Venue[];
  isLoadingVenues: boolean;
  fetchVenues: () => Promise<void>;

  selectedVenueId: string | null;
  selectedSlotId: string | null;
  selectedVenueName: string | null;
  selectedSlotTime: string | null;
  selectedSlotPrice: number | null;
  registrant: SlotRegistrant | null;
  paymentStatus: "idle" | "pending" | "success" | "failed" | "expired";
  timerExpiry: number | null;
  userEmail: string | null;
  userName: string | null;
  isLoggedIn: boolean;

  // ✅ FIX 1: Tambah field bookingId dari response /booking/hold
  bookingId: string | null;

  selectVenue: (id: string, name: string) => void;
  selectSlot: (id: string, time: string, price: number) => void;
  setRegistrant: (data: SlotRegistrant) => void;
  startPaymentTimer: () => void;
  setPaymentStatus: (status: BookingState["paymentStatus"]) => void;
  setUser: (email: string, name: string) => void;
  setLoggedIn: (val: boolean) => void;
  resetBooking: () => void;

  // ✅ FIX 1: Tambah action untuk menyimpan bookingId
  setBookingId: (id: string) => void;
};

export const useBookingStore = create<BookingState>((set, get) => ({
  venues: [],
  isLoadingVenues: false,

  fetchVenues: async () => {
    set({ isLoadingVenues: true });
    try {
      const res = await api.get('/venues');
      
      const mappedVenues: Venue[] = res.data.data.map((v: any) => ({
        id: String(v.id),   
        name: v.name,
        festivalName: v.festival_name,
        venueFacilities: VENUE_FACILITIES[String(v.id)]?.venue || [],
        festivalFacilities: VENUE_FACILITIES[String(v.id)]?.festival || [],
        slots: v.time_slots.map((s: any) => ({
          id: String(s.id),
          time: s.time_range,
          price: s.price,
          isBooked: s.is_booked
        }))
      }));

      set({ venues: mappedVenues, isLoadingVenues: false });
    } catch (error) {
      console.error("Gagal menarik data venues dari API:", error);
      set({ isLoadingVenues: false });
    }
  },

  selectedVenueId: null,
  selectedSlotId: null,
  selectedVenueName: null,
  selectedSlotTime: null,
  selectedSlotPrice: null,
  registrant: null,
  paymentStatus: "idle",
  timerExpiry: null,
  userEmail: null,
  userName: null,
  isLoggedIn: false,

  // ✅ FIX 1: Initial value bookingId
  bookingId: null,

  selectVenue: (id, name) => set({ selectedVenueId: id, selectedVenueName: name, selectedSlotId: null }),
  selectSlot: (id, time, price) => set({ selectedSlotId: id, selectedSlotTime: time, selectedSlotPrice: price }),
  setRegistrant: (data) => set({ registrant: data }),
  startPaymentTimer: () => set({ timerExpiry: Date.now() + 15 * 60 * 1000, paymentStatus: "pending" }),
  setPaymentStatus: (status) => set({ paymentStatus: status }),
  setUser: (email, name) => set({ userEmail: email, userName: name, isLoggedIn: true }),
  setLoggedIn: (val) => set({ isLoggedIn: val }),

  // ✅ FIX 1: Action baru
  setBookingId: (id) => set({ bookingId: id }),

  resetBooking: () =>
    set({
      selectedVenueId: null,
      selectedSlotId: null,
      selectedVenueName: null,
      selectedSlotTime: null,
      selectedSlotPrice: null,
      registrant: null,
      paymentStatus: "idle",
      timerExpiry: null,
      // ✅ FIX 1: Reset bookingId juga
      bookingId: null,
    }),
}));
