import { API_URI } from './config';

export const deleteEmp = async (empId) => {
    try {
        const response = await fetch(`${API_URI}api/user/del/${empId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Delete failed');
        }

        return data;
    } catch (error) {
        console.log('Delete employee failed:', error.message);
        throw error;
    }
};
