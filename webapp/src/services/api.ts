import axios from 'axios';

// Assume backend is running on localhost:8000
const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const reportService = {
    // Stage 3: Police Dashboard - List all sessions
    getDashboard: async () => {
        const response = await api.get('/police/dashboard');
        return response.data;
    },

    // Get Session Details
    getReportDetails: async (sessionId: string) => {
        const response = await api.get(`/police/reports/${sessionId}/details`);
        return response.data;
    },

    // Get Report Meta (Status of signatures etc)
    getReportMeta: async (sessionId: string) => {
        const response = await api.get(`/session/report/${sessionId}/meta`);
        return response.data;
    }
};

export default api;
