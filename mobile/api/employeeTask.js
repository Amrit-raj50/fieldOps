import { API_URI } from './config';

// GET /myTask/:id (all tasks for this employee)
export const getMyTasks = async (empId) => {
    try {
        const response = await fetch(`${API_URI}api/user/myTask/${empId}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in getMyTasks:', error);
        throw error;
    }
};

// GET /task/:id (task details)
export const getTaskDetails = async (taskId) => {
    try {
        const response = await fetch(`${API_URI}api/user/task/${taskId}`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in getTaskDetails:', error);
        throw error;
    }
};

// PATCH /accept/:id
export const acceptTask = async (taskId) => {
    try {
        const response = await fetch(`${API_URI}api/user/accept/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in acceptTask:', error);
        throw error;
    }
};

// PATCH /reject/:id
export const rejectTask = async (taskId, reason) => {
    try {
        const response = await fetch(`${API_URI}api/user/reject/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in rejectTask:', error);
        throw error;
    }
};

// PATCH /task-update/:id (e.g. status: "In Progress" or "Completed")
export const updateTaskStatus = async (taskId, status) => {
    try {
        const response = await fetch(`${API_URI}api/user/task-update/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in updateTaskStatus:', error);
        throw error;
    }
};

// PATCH /update-evidence/:id
export const updateEvidence = async (taskId, evidence) => {
    try {
        const response = await fetch(`${API_URI}api/user/update-evidence/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ evidence }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in updateEvidence:', error);
        throw error;
    }
};

// PATCH /cancel/:id
export const cancelTask = async (taskId, reason) => {
    try {
        const response = await fetch(`${API_URI}api/user/cancel/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason }),
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in cancelTask:', error);
        throw error;
    }
};

// PATCH /task-start/:id
export const updateStartTask = async (taskId) => {
    try {
        const response = await fetch(`${API_URI}api/user/task-start/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error in updateStartTask:', error);
        throw error;
    }
};
