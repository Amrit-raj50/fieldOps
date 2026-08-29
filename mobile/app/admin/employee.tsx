import { allEmp } from "../../api/allEmp";
import {View , Text ,Alert} from 'react-native';
import {useState,useEffect} from 'react'

export default function Employee(){
    const [data , setData] = useState<any[]>([]);
    
    const handleEmp = async() => {
        try{
            const result = await allEmp();

            setData(result.data ?? []);
        }catch(error){
            console.log("Error : ",error);
            Alert.alert(
                "Error",
                "fetching failed"
            )
        }
    }

    useEffect(() => {
        handleEmp();
    },[]);
    return(
        <>
        {Array.isArray(data) && 
            data.map((item,index) => {
                return(
                    <View key={index}>
                    <Text>{item._id}</Text>
                    <Text>name :{item.name}</Text>
                    <Text>Email :{item.email}</Text>
                    <Text>{item.isActive ? 'Active' : 'InActive'}</Text>
                    <Text>created at :{item.createdAt}</Text>
                    <Text>updated at :{item.updatedAt}</Text>
                    </View>
                )
            })
        }
        </>
    )
}