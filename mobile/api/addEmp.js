import {API_URI} from './config';

export const addEmp = async(userData) => {
    try{
        // console.log("Sending request to : " , API_URI);

        const response = await fetch(
            `${API_URI}api/user/register`,
            {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify(userData),
            }
        );

        // console.log(userData);
        // console.log(response)

        const data = response.json();
        // console.log(data);

        console.log("backend response :" , data);

        if(!response.ok){
            throw new Error(
                data.message || "adding employee failed"
            )
        }

        return data;
    }catch(error){
        console.log("adding employee failed with :",error);
        throw error;
    }
}
