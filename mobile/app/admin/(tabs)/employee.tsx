import { allEmp } from "../../../api/allEmp";
import { deleteEmp } from "../../../api/deleteEmp";
import {
    View,
    Text,
    Alert,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Employee() {

    const [data, setData] = useState<any[]>([]);

    const [reFresh, setReFresh] = useState(false);



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

    useEffect(() => {//this is teh initial fetching.
        handleEmp();
    }, []);

    const onRefresh = async () => {
        setReFresh(true);
        handleEmp();
        setReFresh(false);
    }

    const handleDelete = (id: string, name: string) => {
        Alert.alert(
            'Remove Employee',
            `Are you sure you want to remove ${name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteEmp(id);
                            setData(prev => prev.filter(e => e._id !== id));
                            Alert.alert('Done', `${name} has been removed.`);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete employee.');
                        }
                    },
                },
            ]
        );
    };

    const handleIndEmp = (id: string, name: string, email: string, password: string, phone: number, role: string, profileImage: string, isActive: boolean | string, lastLogin: Date | string) => {

        router.push({
            pathname: "/admin/emp/[emp_id]",
            params: {
                emp_id: id,
                id,
                name,
                email,
                password,
                phone,
                role,
                profileImage,
                isActive: String(isActive),
                lastLogin: String(lastLogin)
            }
        });
    }
    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={reFresh}
                    onRefresh={onRefresh} />
            }
        >

            <Text style={styles.heading}>
                Employees
            </Text>


            {Array.isArray(data) &&
                data.map((item, index) => {
                    return (
                        <View key={index}>
                            <TouchableOpacity style={styles.card}
                                onPress={() => {
                                    handleIndEmp(item._id, item.name, item.email, item.password, item.phone, item.role, item.profileImage, item.isActive, item.lastLogin);
                                }}>
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
                                            {item.isActive ? 'Active' : 'InActive'}
                                        </Text>
                                    </View>

                                    <Text style={styles.date}>
                                        Created: {new Date(item.createdAt).toLocaleDateString()}
                                    </Text>

                                    <Text style={styles.date}>
                                        Updated: {new Date(item.updatedAt).toLocaleDateString()}
                                    </Text>

                                </View>

                                {/* Delete button */}
                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => handleDelete(item._id, item.name)}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#dc2626" />
                                </TouchableOpacity>
                            </TouchableOpacity>
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

    deleteBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },

    date: {
        fontSize: 12,
        color: '#888',
        marginTop: 3,
    },

});