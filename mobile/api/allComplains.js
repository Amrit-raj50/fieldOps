import { API_URI } from './config';

export const allComplains = async () => {
    try {
        const response = await fetch(`${API_URI}api/user/all-complains`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch complaints');
        }

        return data;
    } catch (error) {
        console.log('Failed to fetch complaints.', error.message);
        throw error;
    }
};

export const assignComplain = async (taskId, assignData) => {
    try {
        const response = await fetch(`${API_URI}api/user/assign-complain/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Assignment failed');
        }

        return data;
    } catch (error) {
        console.log('Assignment failed.', error.message);
        throw error;
    }
};

export const rejectComplain = async (taskId, reason) => {
    try {
        const response = await fetch(`${API_URI}api/user/reject/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Rejection failed');
        }

        return data;
    } catch (error) {
        console.log('Rejection failed.', error.message);
        throw error;
    }
};
