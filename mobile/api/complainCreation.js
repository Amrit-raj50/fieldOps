import {API_URI} from '../api/config';

export const complainCreation = async(taskData) => {
    try{
        const response = await fetch(
            `${API_URI}api/user/admin/create-complain`,
            {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify(taskData),
            }
        )

        const data = await response.json();

        if(!response.ok){
            throw new Error(
                data.message || "Creation Failed"
            )
        }

        return data;
    }catch(error){
        console.log("Creation Failed.",error.message);
        throw error;
    }
}