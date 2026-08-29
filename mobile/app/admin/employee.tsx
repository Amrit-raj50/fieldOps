import { allEmp } from "../../api/allEmp";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useState, useEffect } from 'react'

export default function Employee() {

    const [data, setData] = useState<any[]>([]);

    const handleEmp = async () => {
        try {
            const result = await allEmp();

            setData(result.data ?? []);
        } catch (error) {
            console.log("Error : ", error);
            Alert.alert(
                "Error",
                "fetching failed"
            )
        }
    }

    useEffect(() => {
        handleEmp();
    }, []);

    return (
        <ScrollView style={styles.container}>

            <Text style={styles.heading}>
                Employees
            </Text>

            {Array.isArray(data) &&
                data.map((item, index) => {
                    return (
                        <View key={index} style={styles.card}>

                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {item.name?.charAt(0).toUpperCase()}
                                </Text>
                            </View>

                            <View style={styles.info}>

                                <Text style={styles.name}>
                                    {item.name}
                                </Text>

                                <Text style={styles.email}>
                                    {item.email}
                                </Text>

                                <Text style={styles.id}>
                                    ID: {item._id}
                                </Text>

                                <View
                                    style={[
                                        styles.status,
                                        item.isActive
                                            ? styles.active
                                            : styles.inactive
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.statusText,
                                            item.isActive
                                                ? styles.activeText
                                                : styles.inactiveText
                                        ]}
                                    >
                                        {item.isActive
                                            ? 'Active'
                                            : 'InActive'}
                                    </Text>
                                </View>

                                <Text style={styles.date}>
                                    Created: {new Date(item.createdAt).toLocaleDateString()}
                                </Text>

                                <Text style={styles.date}>
                                    Updated: {new Date(item.updatedAt).toLocaleDateString()}
                                </Text>

                            </View>

                        </View>
                    )
                })
            }

        </ScrollView>
    )
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
        borderRadius: 16,
        padding: 18,
        marginBottom: 15,
        flexDirection: 'row',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,

        elevation: 4,
    },

    avatar: {
        width: 55,
        height: 55,
        borderRadius: 30,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },

    avatarText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },

    info: {
        flex: 1,
    },

    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 5,
    },

    email: {
        fontSize: 15,
        color: '#555',
        marginBottom: 8,
    },

    id: {
        fontSize: 11,
        color: '#999',
        marginBottom: 10,
    },

    status: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
        marginBottom: 10,
    },

    active: {
        backgroundColor: '#dcfce7',
    },

    inactive: {
        backgroundColor: '#fee2e2',
    },

    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },

    activeText: {
        color: '#15803d',
    },

    inactiveText: {
        color: '#dc2626',
    },

    date: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
    },

});