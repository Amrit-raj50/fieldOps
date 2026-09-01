import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { allEmp } from '../../../api/allEmp';
import { Picker } from '@react-native-picker/picker';
// import {task}
import { taskCreation } from '../../../api/taskCreation';

type Employee = {
    name: string;
    _id : string
};

export default function Task() {
    const [title, setTitle] = useState("");
    const [des, setDes] = useState("");
    const [employee, setEmployee] = useState("");
    const [priority, setPriority] = useState("");
    const [location, setLocation] = useState("");
    const [dueDate, setDeuDate] = useState("");
    const [status, setStatus] = useState("");
    const [empId , setEmpId] = useState("");
    const [data, setData] = useState<Employee[]>([]);

    const handleEmp = async () => {
        const d = await allEmp();
        console.log(d.data);
        setData(d.data);
    }

    // useEffect(() => {
    //     handleEmp();
    // }, [employee]);

    const handleCreation = async() => {
        if(!title || !des || !employee || !priority || !location || !dueDate || !status || !empId){
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
                empId : empId
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
        <View style={styles.container}>

            <Text style={styles.heading}>Task Creation Page</Text>

            <TextInput
                style={styles.input}
                placeholder='Title'
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#888"
            />

            <TextInput
                style={[styles.input, styles.description]}
                placeholder='Description'
                value={des}
                onChangeText={setDes}
                placeholderTextColor="#888"
                multiline
            />

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Employee</Text>

                <Picker
                    selectedValue={employee}
                    onValueChange={(itemValue) => {
                        setEmployee(itemValue)
                        // handleEmp()
                    }}
                    onFocus={() => {
                        handleEmp()
                    }}
                    style={styles.picker}
                >
                    <Picker.Item
                        label="Select an employee..."
                        value={null}
                        color="#999"
                    />

                    {Array.isArray(data) &&
                        data.map((item) => (
                            <Picker.Item
                                key={item._id}
                                label={item.name}
                                value={item._id}
                            />
                        ))}
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Priority</Text>

                <Picker
                    selectedValue={priority}
                    onValueChange={(itemValue) => setPriority(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item
                        label="Select priority"
                        value={null}
                        color="#999"
                    />

                    <Picker.Item
                        label="Low"
                        value='Low'
                    />

                    <Picker.Item
                        label="Medium"
                        value='Medium'
                    />

                    <Picker.Item
                        label="High"
                        value='High'
                    />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder='Location'
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#888"
            />

            <TextInput
                style={styles.input}
                placeholder='Due Date'
                value={dueDate}
                onChangeText={setDeuDate}
                placeholderTextColor="#888"
            />

            <View style={styles.pickerContainer}>
                <Text style={styles.label}>Status</Text>

                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item
                        label="Select status"
                        value={null}
                        color="#999"
                    />

                    <Picker.Item
                        label="Pending"
                        value='Pending'
                    />

                    <Picker.Item
                        label="In Progress"
                        value='In Progress'
                    />

                    <Picker.Item
                        label="Completed"
                        value='Completed'
                    />

                    <Picker.Item
                        label="Cancled"
                        value='Cancled'
                    />
                </Picker>
            </View>

            <View style={styles.buttonContainer}>
                <Button
                    title='Create Task'
                    onPress={handleCreation}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 20,
        justifyContent: 'center',
    },

    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 25,
        color: '#222',
    },

    input: {
        height: 52,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        color: '#222',
    },

    description: {
        height: 90,
        textAlignVertical: 'top',
        paddingTop: 15,
    },

    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        paddingLeft: 15,
        paddingTop: 10,
    },

    picker: {
        height: 50,
        width: '100%',
    },

    buttonContainer: {
        marginTop: 5,
        borderRadius: 10,
        overflow: 'hidden',
    },

});