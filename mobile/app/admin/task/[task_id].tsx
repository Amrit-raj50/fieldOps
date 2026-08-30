import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function IndTask() {

    const { task_id, title, description, employee, priority, location, dueDate, status } = useLocalSearchParams();

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>Task Details</Text>

            <View style={styles.card}>

                <Text style={styles.id}>ID: {task_id}</Text>

                <Text style={styles.label}>Title</Text>
                <Text style={styles.value}>{title}</Text>

                <Text style={styles.label}>Description</Text>
                <Text style={styles.value}>{description}</Text>

                <Text style={styles.label}>Employee</Text>
                <Text style={styles.value}>{employee}</Text>

                <Text style={styles.label}>Priority</Text>
                <Text style={styles.value}>{priority}</Text>

                <Text style={styles.label}>Location</Text>
                <Text style={styles.value}>{location}</Text>

                <Text style={styles.label}>Due Date</Text>
                <Text style={styles.value}>{dueDate}</Text>

                <Text style={styles.label}>Status</Text>
                <Text style={styles.status}>{status}</Text>

            </View>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                    router.push('/admin/taskList');
                }}
            >
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fb',
        padding: 20,
    },

    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#222',
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },

    id: {
        fontSize: 12,
        color: '#999',
        marginBottom: 18,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#777',
        marginTop: 12,
        marginBottom: 4,
    },

    value: {
        fontSize: 17,
        color: '#222',
    },

    status: {
        alignSelf: 'flex-start',
        backgroundColor: '#dcfce7',
        color: '#15803d',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        fontWeight: '600',
        marginTop: 4,
    },

    backButton: {
        backgroundColor: '#4f46e5',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 25,
    },

    backText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});