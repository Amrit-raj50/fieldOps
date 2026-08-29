import { allTask } from '../../api/allTask';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl
} from 'react-native';
import { useState, useEffect } from 'react';

export default function TaskList() {

    const [data, setData] = useState<any[]>([]);
    const [reFreshing, setReFreshing] = useState(false);



    const handletask = async () => {
        try {
            const d = await allTask();
            setData(d.data);
            console.log(d.data);
        } catch (error) {
            console.log("failed : ", error);
        }
    }

    //on the initial fetching.....this will run this run only once
    useEffect(() => {
        handletask();
    }, []);

    //on refresh .. this will run .....
    const onRefresh = async () => {
        setReFreshing(true);
        await handletask();
        setReFreshing(false);
    }
    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={reFreshing}
                    onRefresh={onRefresh} />
            }>

            <Text style={styles.heading}>
                All Tasks
            </Text>

            {Array.isArray(data) &&
                data.map((item, index) => {
                    return (
                        <View key={index} style={styles.card}>

                            <View style={styles.header}>
                                <Text style={styles.title}>
                                    {item.title}
                                </Text>

                                <View style={styles.priorityBadge}>
                                    <Text style={styles.priorityText}>
                                        {item.priority}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <Text style={styles.label}>
                                    Employee
                                </Text>
                                <Text style={styles.value}>
                                    {item.employee}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>
                                    Location
                                </Text>
                                <Text style={styles.value}>
                                    {item.location}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>
                                    Status
                                </Text>

                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>
                                        {item.status}
                                    </Text>
                                </View>
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
        marginBottom: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,

        elevation: 4,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#222',
        flex: 1,
        marginRight: 10,
    },

    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    label: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },

    value: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
        maxWidth: '65%',
        textAlign: 'right',
    },

    priorityBadge: {
        backgroundColor: '#fff3cd',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    priorityText: {
        color: '#856404',
        fontSize: 12,
        fontWeight: 'bold',
    },

    statusBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },

    statusText: {
        color: '#15803d',
        fontSize: 12,
        fontWeight: 'bold',
    },

});