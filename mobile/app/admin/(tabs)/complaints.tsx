import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { allComplains } from '../../../api/allComplains';
import { Ionicons } from '@expo/vector-icons';

export default function Complaints() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchComplains = async () => {
        try {
            const result = await allComplains();
            setData(result.data || []);
        } catch (error) {
            console.log('failed to load complaints:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplains();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchComplains();
        setRefreshing(false);
    };

    const handleOpen = (item: any) => {
        router.push({
            pathname: '/admin/complain/[complain_id]',
            params: {
                complain_id: item._id,
                title: item.title,
                description: item.description,
                location: item.location,
                dueDate: item.dueDate,
                createdAt: item.createdAt,
            },
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={styles.heading}>Client Complaints</Text>

            {data.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Ionicons name="checkmark-circle-outline" size={52} color="#a5b4fc" />
                    <Text style={styles.emptyText}>No pending complaints</Text>
                </View>
            ) : (
                data.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.card}
                        onPress={() => handleOpen(item)}
                        activeOpacity={0.85}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle} numberOfLines={1}>
                                {item.title || 'Untitled Complaint'}
                            </Text>
                            <View style={styles.pendingBadge}>
                                <Text style={styles.pendingText}>Pending</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.row}>
                            <Ionicons name="location-outline" size={14} color="#888" />
                            <Text style={styles.meta} numberOfLines={1}>
                                {item.location || 'No location'}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Ionicons name="calendar-outline" size={14} color="#888" />
                            <Text style={styles.meta}>
                                Due: {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'Not set'}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <Ionicons name="time-outline" size={14} color="#888" />
                            <Text style={styles.meta}>
                                Submitted: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                            </Text>
                        </View>

                        <View style={styles.tapHint}>
                            <Text style={styles.tapHintText}>Tap to review →</Text>
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f6fa',
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 20,
        marginTop: 8,
    },
    emptyBox: {
        alignItems: 'center',
        marginTop: 80,
        gap: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#94a3b8',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1e293b',
        flex: 1,
        marginRight: 10,
    },
    pendingBadge: {
        backgroundColor: '#fef9c3',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    pendingText: {
        color: '#a16207',
        fontSize: 11,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    meta: {
        fontSize: 13,
        color: '#64748b',
        flex: 1,
    },
    tapHint: {
        marginTop: 10,
        alignItems: 'flex-end',
    },
    tapHintText: {
        fontSize: 12,
        color: '#a5b4fc',
        fontWeight: '600',
    },
});
