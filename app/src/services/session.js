import { api, BASE_URL } from './api';

export const sessionService = {
    createSession: async (userId) => {
        return api.post(`/session/create?user_id=${userId}`, {});
    },

    joinSession: async (otp, userId) => {
        return api.post(`/session/join?otp=${otp}&user_id=${userId}`, {});
    },

    reconnectSession: async (otp, userId) => {
        return api.post(`/session/reconnect?otp=${otp}&user_id=${userId}`, {});
    },

    submitReport: async (sessionId, userId, draft, evidences) => {
        return api.post('/report/submit', {
            session_id: sessionId,
            user_id: userId,
            draft: draft,
            evidences: evidences
        });
    },

    getStreamUrl: (sessionId) => {
        return `${BASE_URL}/session/stream/${sessionId}`;
    }
};
