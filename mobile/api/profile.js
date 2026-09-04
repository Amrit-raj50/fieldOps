import { API_URI } from './config';

// GET /me/:id
export const getProfile = async (userId) => {
    try {
        const response = await fetch(`${API_URI}api/user/me/${userId}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in getProfile:', error);
        throw error;
    }
};

// PATCH /update-name/:id
export const updateProfileName = async (userId, name) => {
    try {
        const response = await fetch(`${API_URI}api/user/update-name/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in updateProfileName:', error);
        throw error;
    }
};

// POST /logout
export const logoutApi = async () => {
    try {
        const response = await fetch(`${API_URI}api/user/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in logoutApi:', error);
        // Do not throw to allow local logout to continue
        return null;
    }
};
