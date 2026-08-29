import {View,Text, TouchableOpacity} from 'react-native';
import { useLocalSearchParams , router } from 'expo-router';

export default function IndEmp(){
    const {id , name , email , phone , role , profileImage , isActive , lastLogin} = useLocalSearchParams();
    return(
        <View>
            <Text>id : {id}</Text>
            <Text>name : {name}</Text>
            <Text>email : {email}</Text>
            <Text>phone : {phone}</Text>
            <Text>role : {role}</Text>
            <Text>profileImage : {profileImage}</Text>
            <Text>isActive : {isActive}</Text>
            <Text>lastLogin : {lastLogin}</Text>
            <TouchableOpacity
            onPress={() => {router.push('/admin/employee')}}>
                <Text>back</Text>
            </TouchableOpacity>
        </View>
    )
}