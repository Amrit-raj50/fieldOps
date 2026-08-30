import {API_URI} from './config';

export const updateLoc = async(id,latitude,longitude) => {
    try{
        const response = await fetch(
            `${API_URI}api/user/update-loc/${id}`,
            {
                method : 'PATCH',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body : JSON.stringify({
                    latitude,
                    longitude,
                })
            }
        );
        // console.log(response);

        const data = await response.json();

        // console.log("data : ",data);

        if(!response.ok){
            throw new Error(
                data.message || "updation failed"
            )
        }

        return data;
    }catch(error){
        console.log(error);
    }
}