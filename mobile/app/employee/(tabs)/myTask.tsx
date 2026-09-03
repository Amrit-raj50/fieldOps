import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { getMyTasks } from '../../../api/employeeTask';
import { Ionicons } from '@expo/vector-icons';

const TABS = ['All', 'In Progress', 'Pending', 'Completed'];

export default function MyTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadTasks = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            if (!userString) return;
            const parsedUser = JSON.parse(userString);

            const response = await getMyTasks(parsedUser._id);
            const taskList = Array.isArray(response?.task)
                ? response.task
                : Array.isArray(response?.data)
                ? response.data
                : [];

            // Accepted tasks or tasks that are already in progress / completed
            const acceptedOrActive = taskList.filter(
                (item: any) =>
                    item.accept === true ||
                    item.status === 'In Progress' ||
                    item.status === 'Completed' ||
                    item.status === 'Cancelled' ||
                    item.status === 'Cancled'
            );
            setTasks(acceptedOrActive);
        } catch (error) {
            console.error('Failed to load my tasks:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTasks();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadTasks();
    };

    const filteredTasks = tasks.filter((task) => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'In Progress') return task.status === 'In Progress';
        if (activeFilter === 'Pending') return task.status === 'Pending';
        if (activeFilter === 'Completed') return task.status === 'Completed';
        return true;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Completed':
                return { bg: '#dcfce7', text: '#15803d' };
            case 'In Progress':
                return { bg: '#dbeafe', text: '#1d4ed8' };
            case 'Cancelled':
            case 'Cancled':
                return { bg: '#fee2e2', text: '#b91c1c' };
            default:
                return { bg: '#fef3c7', text: '#b45309' };
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>My Tasks</Text>
                <Text style={styles.subHeading}>
                    Track and manage your active, pending, and completed tasks.
                </Text>

                {/* Filter Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                >
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.filterTab,
                                activeFilter === tab && styles.activeFilterTab,
                            ]}
                            onPress={() => setActiveFilter(tab)}
                        >
                            <Text
                                style={[
                                    styles.filterText,
                                    activeFilter === tab && styles.activeFilterText,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.taskList}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredTasks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="clipboard-outline" size={44} color="#94a3b8" />
                        <Text style={styles.emptyText}>
                            {`No tasks found in "${activeFilter}"`}
                        </Text>
                    </View>
                ) : (
                    filteredTasks.map((item) => {
                        const statusColor = getStatusStyle(item.status);

                        return (
                            <TouchableOpacity
                                key={item._id}
                                style={styles.card}
                                activeOpacity={0.7}
                                onPress={() =>
                                    router.push({
                                        pathname: '/employee/task/[id]',
                                        params: { id: item._id },
                                    })
                                }
                            >
                                <View style={styles.cardHeader}>
                                    <Text style={styles.title} numberOfLines={1}>
                                        {item.title}
                                    </Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: statusColor.bg },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: statusColor.text },
                                            ]}
                                        >
                                            {item.status || 'Pending'}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.desc} numberOfLines={2}>
                                    {item.description || 'No description provided.'}
                                </Text>

                                <View style={styles.cardFooter}>
                                    <View style={styles.metaRow}>
                                        <Ionicons name="location-outline" size={14} color="#64748b" />
                                        <Text style={styles.metaText} numberOfLines={1}>
                                            {item.location || 'N/A'}
                                        </Text>
                                    </View>

                                    <View style={styles.metaRow}>
                                        <Ionicons name="flag-outline" size={14} color="#64748b" />
                                        <Text style={styles.metaText}>
                                            {item.priority || 'Medium'}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 45,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 14,
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subHeading: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
        marginBottom: 14,
    },
    filterScroll: {
        flexDirection: 'row',
    },
    filterTab: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        marginRight: 8,
    },
    activeFilterTab: {
        backgroundColor: '#4f46e5',
    },
    filterText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '600',
    },
    activeFilterText: {
        color: '#ffffff',
    },
    taskList: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1e293b',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
    },
    desc: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 18,
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
        paddingTop: 10,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '48%',
    },
    metaText: {
        fontSize: 12,
        color: '#64748b',
        marginLeft: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 10,
    },
});
