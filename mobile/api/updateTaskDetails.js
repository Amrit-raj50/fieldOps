import { API_URI } from './config';

export const updateTaskDetails = async (taskId, updateData) => {
    try {
        const response = await fetch(`${API_URI}api/user/update-task-details/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Update failed');
        }

        return data;
    } catch (error) {
        console.log('Task update failed:', error.message);
        throw error;
    }
};
