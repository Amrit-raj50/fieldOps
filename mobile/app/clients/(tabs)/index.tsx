import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { clientComplains } from '../../../api/allComplains';

// Mock Data
// const MOCK_STATS = {
//     total: 12,
//     pending: 3,
//     resolved: 9,
// };

// const MOCK_ACTIVITY = [
//     { id: '1', title: 'Street Light Issue on 5th Ave', status: 'Pending', date: 'Oct 14' },
//     { id: '2', title: 'Pothole near Main St', status: 'In Progress', date: 'Oct 10' },
//     { id: '3', title: 'Fallen Tree Branch', status: 'Completed', date: 'Oct 02' },
// ];

export default function ClientDashboard() {
    const [clientName, setClientName] = useState('Client');
    const [refreshing, setRefreshing] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            if (userString) {
                const parsedUser = JSON.parse(userString);
                setClientName(parsedUser.name || 'Client');
                loadComplaints(parsedUser._id);
            }
        } catch (error) {
            console.error('Failed to load user', error);
        }
    };

    const loadComplaints = async (clientId: string) => {
        try {
            const response = await clientComplains(clientId);
            if (response && response.data) {
                setComplaints(response.data);
                calculateStats(response.data);
            }
        } catch (error) {
            console.error('Failed to load complaints', error);
        }
    };

    const calculateStats = (data: any[]) => {
        const total = data.length;
        const pending = data.filter((c: any) => c.status === 'Pending').length;
        const resolved = data.filter((c: any) => c.status === 'Completed' || c.status === 'Resolved').length;
        setStats({ total, pending, resolved });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadUser();
        setRefreshing(false);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed':
            case 'Resolved':
                return { bg: '#dcfce7', text: '#15803d' };
            case 'In Progress':
                return { bg: '#dbeafe', text: '#1d4ed8' };
            case 'Pending':
                return { bg: '#fef9c3', text: '#b45309' };
            default:
                return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.name}>{clientName}</Text>
                </View>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {clientName.charAt(0).toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Quick Action */}
            <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/clients/(tabs)/createComplain')}
                activeOpacity={0.8}
            >
                <View style={styles.actionIconBg}>
                    <Ionicons name="add" size={28} color="#ffffff" />
                </View>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionTitle}>Create New Complaint</Text>
                    <Text style={styles.actionSub}>Report an issue quickly and easily.</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#6366f1" />
            </TouchableOpacity>

            {/* Statistics */}
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsRow}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{stats.total}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxPending]}>
                    <Text style={[styles.statNumber, { color: '#b45309' }]}>{stats.pending}</Text>
                    <Text style={[styles.statLabel, { color: '#d97706' }]}>Pending</Text>
                </View>
                <View style={[styles.statBox, styles.statBoxResolved]}>
                    <Text style={[styles.statNumber, { color: '#15803d' }]}>{stats.resolved}</Text>
                    <Text style={[styles.statLabel, { color: '#16a34a' }]}>Resolved</Text>
                </View>
            </View>

            {/* Recent Activity */}
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
                {complaints.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#64748b', padding: 10 }}>No complaints found.</Text>
                ) : (
                    complaints.slice(0, 5).map((item: any, index: number) => {
                        const statusStyle = getStatusStyle(item.status);
                        const isLast = index === Math.min(complaints.length, 5) - 1;
                        const dateObj = new Date(item.createdAt);
                        const formattedDate = !isNaN(dateObj.getTime()) 
                            ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : '';

                        return (
                            <View key={item._id}>
                                <View style={styles.activityItem}>
                                    <View style={styles.activityIcon}>
                                        <Ionicons name="document-text-outline" size={20} color="#64748b" />
                                    </View>
                                    <View style={styles.activityDetails}>
                                        <Text style={styles.activityTitle} numberOfLines={1}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.activityDate}>{formattedDate}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>
                                {!isLast && <View style={styles.divider} />}
                            </View>
                        );
                    })
                )}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        padding: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 4,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: 20,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#eef2ff',
    },
    actionIconBg: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 4,
    },
    actionSub: {
        fontSize: 13,
        color: '#64748b',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    statBoxPending: {
        backgroundColor: '#fefce8',
    },
    statBoxResolved: {
        backgroundColor: '#f0fdf4',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    activityCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 3,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    activityIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    activityDetails: {
        flex: 1,
        marginRight: 12,
    },
    activityTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: 4,
    },
    activityDate: {
        fontSize: 12,
        color: '#94a3b8',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 16,
    },
});