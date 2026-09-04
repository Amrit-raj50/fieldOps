import { API_URI } from './config';

export const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${API_URI}api/user/del-task/${taskId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Delete failed');
        }

        return data;
    } catch (error) {
        console.log('Delete task failed:', error.message);
        throw error;
    }
};
