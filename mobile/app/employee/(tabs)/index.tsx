import React, { useState, useEffect, useCallback } from 'react';
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

export default function EmployeeDashboard() {
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            if (userString) {
                const parsedUser = JSON.parse(userString);
                setUser(parsedUser);

                const response = await getMyTasks(parsedUser._id);
                const taskList = Array.isArray(response?.task)
                    ? response.task
                    : Array.isArray(response?.data)
                    ? response.data
                    : [];
                setTasks(taskList);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    // Calculate metrics
    const totalAssigned = tasks.length;
    const pendingTasks = tasks.filter(
        (t) => t.status === 'Pending' || (!t.accept && t.status !== 'Rejected' && t.status !== 'Cancelled')
    ).length;
    const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

    // Current active task (first In Progress task, or first accepted Pending task)
    const currentActiveTask =
        tasks.find((t) => t.status === 'In Progress') ||
        tasks.find((t) => t.accept && t.status === 'Pending');

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.userName}>{user?.name || 'Employee'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileBadge}
                    onPress={() => router.push('/employee/profile')}
                >
                    <Ionicons name="person" size={20} color="#4f46e5" />
                </TouchableOpacity>
            </View>

            {/* Quick Metrics Grid */}
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.grid}>
                <View style={[styles.statCard, { borderLeftColor: '#4f46e5' }]}>
                    <Text style={styles.statNumber}>{totalAssigned}</Text>
                    <Text style={styles.statLabel}>Total Tasks</Text>
                </View>

                <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
                    <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
                        {pendingTasks}
                    </Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>

                <View style={[styles.statCard, { borderLeftColor: '#3b82f6' }]}>
                    <Text style={[styles.statNumber, { color: '#3b82f6' }]}>
                        {inProgressTasks}
                    </Text>
                    <Text style={styles.statLabel}>In Progress</Text>
                </View>

                <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                    <Text style={[styles.statNumber, { color: '#10b981' }]}>
                        {completedTasks}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
            </View>

            {/* Current Active Task Card */}
            <Text style={styles.sectionTitle}>Current Active Task</Text>
            {currentActiveTask ? (
                <View style={styles.activeCard}>
                    <View style={styles.activeHeader}>
                        <Text style={styles.activeTitle} numberOfLines={1}>
                            {currentActiveTask.title}
                        </Text>
                        <View
                            style={[
                                styles.badge,
                                currentActiveTask.status === 'In Progress'
                                    ? styles.inProgressBadge
                                    : styles.pendingBadge,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.badgeText,
                                    currentActiveTask.status === 'In Progress'
                                        ? styles.inProgressText
                                        : styles.pendingText,
                                ]}
                            >
                                {currentActiveTask.status}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.activeDesc} numberOfLines={2}>
                        {currentActiveTask.description || 'No description provided.'}
                    </Text>

                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={16} color="#64748b" />
                        <Text style={styles.infoText}>
                            {currentActiveTask.location || 'Not specified'}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.viewTaskButton}
                        onPress={() =>
                            router.push({
                                pathname: '/employee/task/[id]',
                                params: { id: currentActiveTask._id },
                            })
                        }
                    >
                        <Text style={styles.viewTaskText}>Quick View Task</Text>
                        <Ionicons name="arrow-forward" size={16} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.emptyCard}>
                    <Ionicons name="checkmark-circle-outline" size={40} color="#94a3b8" />
                    <Text style={styles.emptyText}>No active tasks right now.</Text>
                    <TouchableOpacity
                        style={styles.assignedLink}
                        onPress={() => router.push('/employee/assignedTask')}
                    >
                        <Text style={styles.assignedLinkText}>
                            Check Assigned Tasks
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push('/employee/assignedTask')}
                >
                    <Ionicons name="file-tray-full" size={24} color="#4f46e5" />
                    <Text style={styles.actionLabel}>Assigned</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push('/employee/myTask')}
                >
                    <Ionicons name="list" size={24} color="#3b82f6" />
                    <Text style={styles.actionLabel}>My Tasks</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push('/employee/map')}
                >
                    <Ionicons name="navigate" size={24} color="#10b981" />
                    <Text style={styles.actionLabel}>Live Map</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => router.push('/employee/messages')}
                >
                    <Ionicons name="chatbubbles" size={24} color="#8b5cf6" />
                    <Text style={styles.actionLabel}>Messages</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        paddingHorizontal: 20,
        paddingTop: 45,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 14,
        color: '#64748b',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    profileBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: 12,
        marginTop: 6,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    statNumber: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    statLabel: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 4,
        fontWeight: '500',
    },
    activeCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 5,
    },
    activeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    activeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
        flex: 1,
        marginRight: 8,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    inProgressBadge: {
        backgroundColor: '#dbeafe',
    },
    inProgressText: {
        color: '#1d4ed8',
        fontSize: 12,
        fontWeight: 'bold',
    },
    pendingBadge: {
        backgroundColor: '#fef3c7',
    },
    pendingText: {
        color: '#b45309',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    activeDesc: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoText: {
        fontSize: 13,
        color: '#64748b',
        marginLeft: 6,
    },
    viewTaskButton: {
        backgroundColor: '#4f46e5',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    viewTaskText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
        marginRight: 6,
    },
    emptyCard: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyText: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 8,
        marginBottom: 12,
    },
    assignedLink: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#eef2ff',
    },
    assignedLinkText: {
        color: '#4f46e5',
        fontWeight: '600',
        fontSize: 13,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
    },
    actionBtn: {
        width: '22%',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    actionLabel: {
        fontSize: 11,
        color: '#334155',
        fontWeight: '600',
        marginTop: 6,
    },
});
