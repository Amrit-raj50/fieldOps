import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

export default function IndEmp() {
    const { id, name, email, phone, role, profileImage, isActive, lastLogin } =
        useLocalSearchParams();

    return (
        <View style={styles.container}>

            <Text style={styles.heading}>Employee Details</Text>

            <View style={styles.card}>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {name?.toString().charAt(0).toUpperCase()}
                    </Text>
                </View>

                <Text style={styles.id}>ID: {id}</Text>

                <Text style={styles.label}>Name</Text>
                <Text style={styles.value}>{name}</Text>

                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{email}</Text>

                <Text style={styles.label}>Phone</Text>
                <Text style={styles.value}>{phone}</Text>

                <Text style={styles.label}>Role</Text>
                <Text style={styles.value}>{role}</Text>

                <Text style={styles.label}>Profile Image</Text>
                <Text style={styles.value}>{profileImage || 'Not available'}</Text>

                <Text style={styles.label}>Status</Text>
                <Text
                    style={[
                        styles.status,
                        isActive === 'true'
                            ? styles.active
                            : styles.inactive
                    ]}
                >
                    {isActive === 'true' ? 'Active' : 'Inactive'}
                </Text>

                <Text style={styles.label}>Last Login</Text>
                <Text style={styles.value}>
                    {lastLogin || 'Never logged in'}
                </Text>

            </View>

            <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={() => {
                    router.push('/admin/employee');
                }}
            >
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 20,
    },

    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 20,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 22,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.12,
        shadowRadius: 7,

        elevation: 5,
    },

    avatar: {
        width: 75,
        height: 75,
        borderRadius: 40,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 15,
    },

    avatarText: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },

    id: {
        fontSize: 11,
        color: '#999',
        marginBottom: 15,
        textAlign: 'center',
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
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 3,
    },

    active: {
        backgroundColor: '#dcfce7',
        color: '#15803d',
    },

    inactive: {
        backgroundColor: '#fee2e2',
        color: '#dc2626',
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