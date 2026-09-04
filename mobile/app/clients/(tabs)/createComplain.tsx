import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
// import { allEmp } from '../../../api/allEmp';
// import { Picker } from '@react-native-picker/picker';
// import {task}
import { complainCreation } from '../../../api/complainCreation';

// type Employee = {
//     name: string;
//     _id : string
// };

export default function Task() {
    const [title, setTitle] = useState("");
    const [des, setDes] = useState("");
    // const [employee, setEmployee] = useState("");
    // const [priority, setPriority] = useState("");
    const [location, setLocation] = useState("");
    const [dueDate, setDeuDate] = useState("");
    const [loadingLocation, setLoadingLocation] = useState(false);
    // const [status, setStatus] = useState("");
    // const [empId , setEmpId] = useState("");
    // const [data, setData] = useState<Employee[]>([]);

    const handleGetCurrentLocation = async () => {
        try {
            setLoadingLocation(true);
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission Denied", "Permission to access location was denied.");
                setLoadingLocation(false);
                return;
            }

            const currentPos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const { latitude, longitude } = currentPos.coords;
            const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (reverseGeocode && reverseGeocode.length > 0) {
                const addressObj = reverseGeocode[0];
                const parts = [
                    addressObj.name,
                    addressObj.street,
                    addressObj.district || addressObj.subregion,
                    addressObj.city,
                    addressObj.region,
                    addressObj.postalCode,
                    addressObj.country
                ].filter(Boolean);

                const formattedAddress = parts.join(', ');
                setLocation(formattedAddress || `${latitude}, ${longitude}`);
            } else {
                setLocation(`${latitude}, ${longitude}`);
            }
        } catch (error: any) {
            console.log("Error fetching location:", error);
            Alert.alert("Error", "Could not fetch current location. Please try again.");
        } finally {
            setLoadingLocation(false);
        }
    };

    // const handleEmp = async () => {
    //     const d = await allEmp();
    //     console.log(d.data);
    //     setData(d.data);
    // }

    // useEffect(() => {
    //     handleEmp();
    // }, [employee]);

    const handleCreation = async() => {
        if(!title || !des ||  !location || !dueDate ){
            Alert.alert(
                "error",
                "all fields must be field"
            )
        };

        try{
            const result = await complainCreation({
                title : title,
                description : des,
                // employee : employee,
                // priority : priority,
                location : location,
                dueDate : dueDate,
                // status : status,
                // empId : empId
            });
            console.log(title , des , location,dueDate);

            console.log("creation seuccessful : ",result);

            Alert.alert(
                "success",
                "task created successfully"
            );

            setTitle("")
            setDes("")
            // setEmployee("")
            // setPriority("")
            setLocation("")
            setDeuDate("")
            // setStatus("")
            // setEmpId("")
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

            {/* <View style={styles.pickerContainer}>
                <Text style={styles.label}>EmployeeId</Text>

                <Picker
                    selectedValue={employee}
                    onValueChange={(itemValue) => {
                        setEmpId(itemValue)
                        console.log(empId);
                        // handleEmp()
                    }}
                    onFocus={() => {
                        handleEmp()
                    }}
                    style={styles.picker}
                >
                    <Picker.Item
                        label="Select an employeeId"
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
            </View> */}

            {/* <View style={styles.pickerContainer}>
                <Text style={styles.label}>Employee</Text>

                <Picker
                    selectedValue={employee}
                    onValueChange={(itemValue) => {
                        setEmployee(itemValue)
                        console.log(employee);
                        // handleEmp()
                    }}
                    onFocus={() => {
                        handleEmp()
                    }}
                    style={styles.picker}
                >
                    <Picker.Item
                        label="Select an employeeId"
                        value={null}
                        color="#999"
                    />

                    {Array.isArray(data) &&
                        data.map((item) => (
                            <Picker.Item
                                key={item._id}
                                label={item.name}
                                value={item.name}
                            />
                        ))}
                </Picker>
            </View> */}

            {/* <View style={styles.pickerContainer}>
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
            </View> */}

            <View style={styles.locationContainer}>
                <TextInput
                    style={[styles.input, styles.locationInput]}
                    placeholder='Location'
                    value={location}
                    onChangeText={setLocation}
                    placeholderTextColor="#888"
                />
                <TouchableOpacity
                    style={styles.locationButton}
                    onPress={handleGetCurrentLocation}
                    disabled={loadingLocation}
                >
                    {loadingLocation ? (
                        <ActivityIndicator size="small" color="#4f46e5" />
                    ) : (
                        <Ionicons name="location" size={22} color="#4f46e5" />
                    )}
                </TouchableOpacity>
            </View>

            <TextInput
                style={styles.input}
                placeholder='Due Date'
                value={dueDate}
                onChangeText={setDeuDate}
                placeholderTextColor="#888"
            />

            {/* <View style={styles.pickerContainer}>
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
            </View> */}

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

    locationContainer: {
        position: 'relative',
        justifyContent: 'center',
    },

    locationInput: {
        paddingRight: 48,
        marginBottom: 15,
    },

    locationButton: {
        position: 'absolute',
        right: 12,
        top: 14,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
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