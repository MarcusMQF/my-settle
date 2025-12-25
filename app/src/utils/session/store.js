import { create } from 'zustand';

export const useSessionStore = create((set) => ({
    sessionId: null,
    role: null, // 'DRIVER_A' | 'DRIVER_B'
    status: null, // 'CREATED' | 'HANDSHAKE' | ...
    otp: null,
    qrImage: null,
    partner: null, // { id, name, car_plate ... }

    setSession: (sessionData) => set((state) => ({ ...state, ...sessionData })),
    resetSession: () => set({
        sessionId: null,
        role: null,
        status: null,
        otp: null,
        qrImage: null,
        partner: null
    }),
}));
