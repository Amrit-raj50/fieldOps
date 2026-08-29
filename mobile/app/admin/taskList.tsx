import {allTask} from '../../api/allTask';
import {View , Text } from 'react-native';
import {useState , useEffect} from 'react';

export default function TaskList(){
    const [data , setData] = useState<any[]>([]);

    const handletask = async() => {
        try{
            const d = await allTask();
            setData(d.data);
            console.log(d.data);
        }catch(error){
            console.log("failed : ",error);
        }
    }

    useEffect(() => {
        handletask();
    },[]);
    return(
        <>
        {Array.isArray(data) && 
            data.map((item,index) => {
                return(
                    <>
                    <View key={index}>
                    <Text>{item.titel}</Text>
                    <Text>{item.employee}</Text>
                    <Text>{item.priority}</Text>
                    <Text>{item.location}</Text>
                    <Text>{item.status}</Text>
                    </View>
                    </>
                )
            })
        }
        </>
    )
}