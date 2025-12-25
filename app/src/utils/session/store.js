import { create } from 'zustand';

export const useSessionStore = create((set) => ({
    sessionId: null,
    role: null, // 'DRIVER_A' | 'DRIVER_B'
    status: null, // 'CREATED' | 'HANDSHAKE' | ...
    otp: null,
    qrImage: null,
    partner: null, // { id, name, car_plate ... }

    // Stage 2 Data
    draft: {
        weather: '',
        accident_time: new Date().toISOString(),
        road_surface: '',
        road_type: '',
        location: '',
        description: '',
        at_fault_driver: '',
        reason: '',
        incident_type: '',
        light_condition: ''
    },
    evidences: [],

    setSession: (sessionData) => set((state) => ({ ...state, ...sessionData })),

    updateDraft: (draftUpdates) => set((state) => ({
        draft: { ...state.draft, ...draftUpdates }
    })),

    addEvidence: (evidence) => set((state) => ({
        evidences: [...state.evidences, evidence]
    })),

    resetSession: () => set({
        sessionId: null,
        role: null,
        status: null,
        otp: null,
        qrImage: null,
        partner: null,
        draft: {
            weather: '',
            accident_time: new Date().toISOString(),
            road_surface: '',
            road_type: '',
            location: '',
            description: '',
            at_fault_driver: '',
            reason: '',
            incident_type: '',
            light_condition: ''
        },
        evidences: []
    }),
}));
