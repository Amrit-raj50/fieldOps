import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Dashboard() {
    const router = useRouter();

    const handleLogOut = async () => {
        await AsyncStorage.removeItem("user");

        router.replace("/");
    }
    return (
        <View>
            <Text>Admin</Text>
            <TouchableOpacity onPress={handleLogOut}>
                <Text>LOGOUT</Text>
            </TouchableOpacity>
        </View>
    )
}