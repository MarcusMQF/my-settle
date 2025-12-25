import { api } from './api';

export const authService = {
    login: async (userId) => {

        return api.post(`/auth/login?user_id=${userId}`, {});
    },
};
