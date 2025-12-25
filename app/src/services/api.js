import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }
    // Android emulator authentication
    if (Platform.OS === 'android') {
        return 'http://192.168.0.6:8000';
    }
    // iOS simulator / Web
    return 'http://localhost:8000';
}

export const BASE_URL = getBaseUrl();

export const api = {
    post: async (endpoint, data) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    get: async (endpoint) => {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
};
