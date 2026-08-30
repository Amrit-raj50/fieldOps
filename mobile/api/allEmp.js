import {API_URI} from './config';

export const allEmp = async() => {
    try{
        const response = await fetch(
            `${API_URI}api/user/all-employee`,
            {
                method:"GET",
                headers:{
                    "Content-Type" : "application/json"
                },
            }
        );

        // console.log(response);
        const data = await  response.json();

        // console.log(data);
        return data;
    }catch(error){
        console.log("failed to get :",error);
    }
}