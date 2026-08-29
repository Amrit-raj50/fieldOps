import { View, Text, TextInput, Button ,Alert} from 'react-native';
import { useEffect, useState } from 'react';
import { allEmp } from '../../api/allEmp';
import { Picker } from '@react-native-picker/picker';
// import {task}
import {taskCreation} from '../../api/taskCreation';



type Employee = {
    name: string;
};

export default function Task() {
    const [title, setTitle] = useState("");
    const [des, setDes] = useState("");
    const [employee, setEmployee] = useState("");
    const [priority, setPriority] = useState("");
    const [location, setLocation] = useState("");
    const [dueDate, setDeuDate] = useState("");
    const [status, setStatus] = useState("");
    const [data, setData] = useState<Employee[]>([]);

    const handleEmp = async () => {
        const d = await allEmp();
        console.log(d.data);
        setData(d.data);
    }
    useEffect(() => {
        handleEmp();
    }, []);

    const handleCreation = async() => {
        if(!title || !des || !employee || !priority || !location || !dueDate || !status ){
            Alert.alert(
                "error",
                "all fields must be field"
            )
        };

        try{
            const result = await taskCreation({
                title : title,
                description : des,
                employee : employee,
                priority : priority,
                location : location,
                dueDate : dueDate,
                status : status,
            });

            console.log("creation seuccessful : ",result);

            Alert.alert(
                "success",
                "task created successfully"
            );

            setTitle("")
            setDes("")
            setEmployee("")
            setPriority("")
            setLocation("")
            setDeuDate("")
            setStatus("")
        }catch(error){
            console.log("Error: ",error);
            Alert.alert(
                "error",
                "task creation failed."
            );
        }
    }
    return (
        <View>
            <Text>Task Creation Page</Text>

            <TextInput
                placeholder='title'
                value={title}
                onChangeText={setTitle} />

            <TextInput
                placeholder='description'
                value={des}
                onChangeText={setDes} />

            <Picker
                selectedValue={employee}
                onValueChange={(itemValue) => setEmployee(itemValue)}
            // style={styles.picker}
            >
                <Picker.Item
                    label="Select an employee..."
                    value={null}
                    color="#999"
                />
                {Array.isArray(data) &&
                    data.map((item) => (
                        <Picker.Item
                            key={item.name}
                            label={item.name}
                            value={item.name}
                        />
                    ))}
            </Picker>

            <Picker
                selectedValue={priority}
                onValueChange={(itemValue) => setPriority(itemValue)}
            // style={styles.picker}
            >
                <Picker.Item
                    label="Select priority"
                    value={null}
                    color="#999"
                />
                <Picker.Item
                    label="Low"
                    value='Low' />
                <Picker.Item
                    label="Medium"
                    value='Medium' />
                <Picker.Item
                    label="High"
                    value='High' />
            </Picker>

            <TextInput
                placeholder='location'
                value={location}
                onChangeText={setLocation} />

            <TextInput
                placeholder='dueDate'
                value={dueDate}
                onChangeText={setDeuDate} />

            <Picker
                selectedValue={status}
                onValueChange={(itemValue) => setStatus(itemValue)}
            // style={styles.picker}
            >
                <Picker.Item
                    label="Select status"
                    value={null}
                    color="#999"
                />
                <Picker.Item
                    label="Pending"
                    value='Pending' />
                <Picker.Item
                    label="In Progress"
                    value='In Progress' />
                <Picker.Item
                    label="Completed"
                    value='Completed' />
                <Picker.Item
                    label="Cancled"
                    value='Cancled' />
            </Picker>

            <Button
            title='create'
            onPress={handleCreation}/>
        </View>
    )
}