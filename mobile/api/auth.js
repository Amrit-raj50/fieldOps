import { API_URI } from "./config";
console.log(API_URI);

export const userRegister = async(userData) => {
    try{
        console.log("Sending request to : " , API_URI);

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

        console.log(userData);
        console.log(response)

        const data = response.json();
        console.log(data);

        console.log("backend response :" , data);

        if(!response.ok){
            throw new Error(
                data.message || "registration failed"
            )
        }

        return data;
    }catch(error){
        console.log("registration failed with :",error);
        throw error;
    }
}

export const userLogin = async(userData) => {
    try{
        const response = await fetch(
            `${API_URI}api/user/login`,
            {
                method:"POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body:JSON.stringify(userData),
            }
        )

        const data = response.json();

        if(!response.ok){
            throw new Error(
                data.message || "login failed"
            )
        }

        return data;
    }catch(error){
        console.log("login failed.",error.message);
        throw error;
    }
}