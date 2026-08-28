
import {View , Text, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
export default function Task(){

    const router = useRouter();

    const handleLogOut = async() => {
        await AsyncStorage.removeItem("user");

        router.replace("/");
    }
    return(
        <View>
            <Text>Employee</Text>
            <TouchableOpacity onPress={handleLogOut}>
                <Text>Log out</Text>
            </TouchableOpacity>
        </View>
    )
}