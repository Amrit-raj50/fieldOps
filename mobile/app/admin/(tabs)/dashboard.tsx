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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { allTask } from '../../../api/allTask';
import { allEmp } from '../../../api/allEmp';
import { allComplains } from '../../../api/allComplains';

type Task = {
    _id: string;
    title: string;
    status: string;
    priority: string;
    employee: string;
    location: string;
    dueDate: string;
    createdAt: string;
    empId: string;
};

type Employee = {
    _id: string;
    name: string;
    email: string;
    isActive: boolean;
};

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadAll = async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) setUser(JSON.parse(userStr));

            const [taskRes, empRes, complainRes] = await Promise.all([
                allTask(),
                allEmp(),
                allComplains(),
            ]);

            setTasks(taskRes?.data || []);
            setEmployees(empRes?.data || []);
            setComplaints(complainRes?.data || []);
        } catch (error) {
            console.log('Dashboard load error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadAll();
        setRefreshing(false);
    }, []);

    // Derived stats from tasks
    const pendingTasks   = tasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const rejectedTasks  = tasks.filter(t => t.status === 'Rejected' || t.status === 'Cancled').length;

    const highPriority = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

    // Recent 4 tasks
    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4);

    const statusColor: Record<string, string> = {
        'Pending':     '#d97706',
        'In Progress': '#2563eb',
        'Completed':   '#16a34a',
        'Rejected':    '#dc2626',
        'Cancled':     '#dc2626',
    };
    const statusBg: Record<string, string> = {
        'Pending':     '#fef9c3',
        'In Progress': '#dbeafe',
        'Completed':   '#dcfce7',
        'Rejected':    '#fee2e2',
        'Cancled':     '#fee2e2',
    };
    const priorityColor: Record<string, string> = {
        'High':   '#dc2626',
        'Medium': '#d97706',
        'Low':    '#16a34a',
    };

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            {/* Header */}
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.greeting}>{greeting()},</Text>
                    <Text style={styles.adminName}>{user?.name || 'Admin'} 👋</Text>
                </View>
                <TouchableOpacity
                    style={styles.avatarBtn}
                    onPress={() => router.push('/admin/(tabs)/profile')}
                >
                    <Text style={styles.avatarLetter}>
                        {(user?.name || 'A').charAt(0).toUpperCase()}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Alert banner for high priority */}
            {highPriority > 0 && (
                <View style={styles.alertBanner}>
                    <Ionicons name="warning-outline" size={18} color="#92400e" />
                    <Text style={styles.alertText}>
                        {highPriority} high-priority {highPriority === 1 ? 'task' : 'tasks'} need attention
                    </Text>
                </View>
            )}

            {/* Complaint alert */}
            {complaints.length > 0 && (
                <TouchableOpacity
                    style={styles.complainBanner}
                    onPress={() => router.push('/admin/(tabs)/complaints')}
                >
                    <Ionicons name="alert-circle-outline" size={18} color="#7c3aed" />
                    <Text style={styles.complainText}>
                        {complaints.length} pending {complaints.length === 1 ? 'complaint' : 'complaints'} awaiting review
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color="#7c3aed" />
                </TouchableOpacity>
            )}

            {/* Stat cards */}
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { borderLeftColor: '#4f46e5' }]}>
                    <Text style={styles.statNumber}>{tasks.length}</Text>
                    <Text style={styles.statLabel}>Total Tasks</Text>
                    <Ionicons name="clipboard-outline" size={22} color="#4f46e5" style={styles.statIcon} />
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#0ea5e9' }]}>
                    <Text style={styles.statNumber}>{employees.length}</Text>
                    <Text style={styles.statLabel}>Employees</Text>
                    <Ionicons name="people-outline" size={22} color="#0ea5e9" style={styles.statIcon} />
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
                    <Text style={styles.statNumber}>{pendingTasks}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                    <Ionicons name="time-outline" size={22} color="#f59e0b" style={styles.statIcon} />
                </View>
                <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
                    <Text style={styles.statNumber}>{completedTasks}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                    <Ionicons name="checkmark-circle-outline" size={22} color="#10b981" style={styles.statIcon} />
                </View>
            </View>

            {/* Task status breakdown */}
            <Text style={styles.sectionTitle}>Task Breakdown</Text>
            <View style={styles.breakdownCard}>
                {[
                    { label: 'In Progress', value: inProgressTasks, color: '#2563eb', bg: '#dbeafe' },
                    { label: 'Pending',     value: pendingTasks,    color: '#d97706', bg: '#fef9c3' },
                    { label: 'Completed',   value: completedTasks,  color: '#16a34a', bg: '#dcfce7' },
                    { label: 'Rejected / Cancelled', value: rejectedTasks, color: '#dc2626', bg: '#fee2e2' },
                ].map((item) => (
                    <View key={item.label} style={styles.breakdownRow}>
                        <View style={styles.breakdownLeft}>
                            <View style={[styles.breakdownDot, { backgroundColor: item.color }]} />
                            <Text style={styles.breakdownLabel}>{item.label}</Text>
                        </View>
                        <View style={[styles.breakdownBadge, { backgroundColor: item.bg }]}>
                            <Text style={[styles.breakdownCount, { color: item.color }]}>{item.value}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Quick action buttons */}
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickRow}>
                <TouchableOpacity
                    style={[styles.quickBtn, { backgroundColor: '#ede9fe' }]}
                    onPress={() => router.push('/admin/(tabs)/complaints')}
                >
                    <Ionicons name="alert-circle-outline" size={26} color="#7c3aed" />
                    <Text style={[styles.quickLabel, { color: '#7c3aed' }]}>Complaints</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.quickBtn, { backgroundColor: '#dbeafe' }]}
                    onPress={() => router.push('/admin/(tabs)/employee')}
                >
                    <Ionicons name="people-outline" size={26} color="#1d4ed8" />
                    <Text style={[styles.quickLabel, { color: '#1d4ed8' }]}>Employees</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.quickBtn, { backgroundColor: '#dcfce7' }]}
                    onPress={() => router.push('/admin/(tabs)/taskList')}
                >
                    <Ionicons name="list-outline" size={26} color="#15803d" />
                    <Text style={[styles.quickLabel, { color: '#15803d' }]}>All Tasks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.quickBtn, { backgroundColor: '#fef9c3' }]}
                    onPress={() => router.push('/admin/(tabs)/trackUser')}
                >
                    <Ionicons name="map-outline" size={26} color="#a16207" />
                    <Text style={[styles.quickLabel, { color: '#a16207' }]}>Track</Text>
                </TouchableOpacity>
            </View>

            {/* Recent tasks */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Tasks</Text>
                <TouchableOpacity onPress={() => router.push('/admin/(tabs)/taskList')}>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            {recentTasks.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Ionicons name="clipboard-outline" size={44} color="#cbd5e1" />
                    <Text style={styles.emptyText}>No tasks yet</Text>
                </View>
            ) : (
                recentTasks.map((task, i) => (
                    <View key={task._id || i} style={styles.taskCard}>
                        <View style={styles.taskCardTop}>
                            <Text style={styles.taskTitle} numberOfLines={1}>{task.title || 'Untitled'}</Text>
                            <View style={[styles.priorityBadge, { backgroundColor: priorityColor[task.priority] + '22' }]}>
                                <Text style={[styles.priorityText, { color: priorityColor[task.priority] || '#555' }]}>
                                    {task.priority || 'N/A'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.taskMeta}>
                            <Ionicons name="person-outline" size={13} color="#94a3b8" />
                            <Text style={styles.taskMetaText}>{task.employee || 'Unassigned'}</Text>
                        </View>
                        <View style={styles.taskMeta}>
                            <Ionicons name="location-outline" size={13} color="#94a3b8" />
                            <Text style={styles.taskMetaText} numberOfLines={1}>{task.location || 'No location'}</Text>
                        </View>

                        <View style={styles.taskCardBottom}>
                            <View style={[styles.statusBadge, { backgroundColor: statusBg[task.status] || '#f1f5f9' }]}>
                                <Text style={[styles.statusText, { color: statusColor[task.status] || '#555' }]}>
                                    {task.status || 'N/A'}
                                </Text>
                            </View>
                            <Text style={styles.taskDate}>
                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', {
                                    day: 'numeric', month: 'short'
                                }) : ''}
                            </Text>
                        </View>
                    </View>
                ))
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    content: {
        padding: 20,
        paddingTop: 52,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },

    // Header
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    adminName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    avatarBtn: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#7c3aed',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    avatarLetter: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },

    // Banners
    alertBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fef3c7',
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    alertText: {
        fontSize: 13,
        color: '#92400e',
        fontWeight: '600',
        flex: 1,
    },
    complainBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#ede9fe',
        borderLeftWidth: 4,
        borderLeftColor: '#7c3aed',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
    },
    complainText: {
        fontSize: 13,
        color: '#6d28d9',
        fontWeight: '600',
        flex: 1,
    },

    // Section
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 12,
        marginTop: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 12,
    },
    seeAll: {
        fontSize: 13,
        color: '#7c3aed',
        fontWeight: '600',
    },

    // Stats grid
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 8,
    },
    statCard: {
        width: '47%',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        position: 'relative',
    },
    statNumber: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    statLabel: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
        marginTop: 2,
    },
    statIcon: {
        position: 'absolute',
        top: 14,
        right: 14,
        opacity: 0.4,
    },

    // Breakdown
    breakdownCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    breakdownLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    breakdownDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    breakdownLabel: {
        fontSize: 14,
        color: '#334155',
        fontWeight: '500',
    },
    breakdownBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    breakdownCount: {
        fontSize: 13,
        fontWeight: 'bold',
    },

    // Quick actions
    quickRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 8,
    },
    quickBtn: {
        flex: 1,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
        gap: 6,
        elevation: 1,
    },
    quickLabel: {
        fontSize: 11,
        fontWeight: '700',
    },

    // Task cards
    taskCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    taskCardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    taskTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1e293b',
        flex: 1,
        marginRight: 8,
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    priorityText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    taskMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 4,
    },
    taskMetaText: {
        fontSize: 13,
        color: '#64748b',
        flex: 1,
    },
    taskCardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    taskDate: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },

    // Empty state
    emptyBox: {
        alignItems: 'center',
        paddingVertical: 40,
        gap: 10,
    },
    emptyText: {
        fontSize: 15,
        color: '#94a3b8',
        fontWeight: '500',
    },
});