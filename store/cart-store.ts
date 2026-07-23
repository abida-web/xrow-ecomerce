// store/quantityStore.ts
import { create } from "zustand";

interface QuantityStore {
  quantity: number;
  setQuantity: (quantity: number) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useQuantityStore = create<QuantityStore>((set) => ({
  quantity: 1,
  setQuantity: (quantity) => set({ quantity }),
  increment: () => set((state) => ({ quantity: state.quantity + 1 })),
  decrement: () =>
    set((state) => ({ quantity: Math.max(1, state.quantity - 1) })),
  reset: () => set({ quantity: 1 }),
}));
