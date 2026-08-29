import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams , router} from 'expo-router';
// import { Button } from '@react-navigation/elements';
// import {} from 'expo-router';
export default function IndTask() {

    const { task_id, title, description, employee, priority, location, dueDate, status } = useLocalSearchParams();
    return (
        <View>
            <Text>id : {task_id}</Text>
            <Text>Title : {title}</Text>
            <Text>Description : {description}</Text>
            <Text>Employee name :{employee}</Text>
            <Text>Priority : {priority}</Text>
            <Text>Location : {location}</Text>
            <Text>DueDate : {dueDate}</Text>
            <Text>Status : {status}</Text>
            <TouchableOpacity
            onPress={() => {router.push('/admin/taskList')}}>
                <Text>back</Text>
            </TouchableOpacity>
        </View>
    )
}