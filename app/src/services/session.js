import { api, BASE_URL } from './api';

export const sessionService = {
    // Stage 1: Session Init
    createSession: async (userId) => {
        return api.post(`/session/create?user_id=${userId}`, {});
    },

    joinSession: async (otp, userId) => {
        return api.post(`/session/join?otp=${otp}&user_id=${userId}`, {});
    },

    reconnectSession: async (otp, userId) => {
        return api.post(`/session/reconnect?otp=${otp}&user_id=${userId}`, {});
    },

    getStreamUrl: (sessionId) => {
        return `${BASE_URL}/session/stream/${sessionId}`;
    }
};
