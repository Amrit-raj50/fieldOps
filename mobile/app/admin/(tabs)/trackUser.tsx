import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { allTask } from '../../../api/allTask';
import { allEmp } from '../../../api/allEmp';

type Task = {
    _id: string;
    title: string;
    employee: string;
    empId: string;
    location: string;
    start: boolean;
    status: string;
};

type Employee = {
    _id: string;
    name: string;
    latitude: string | number;
    longitude: string | number;
};

export default function TrackUser() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const [taskRes, empRes] = await Promise.all([allTask(), allEmp()]);
            
            // Filter tasks that have been started and are not completed
            const activeTasks = (taskRes?.data || []).filter((t: Task) => t.start === true && t.status !== 'Completed');
            setTasks(activeTasks);
            
            setEmployees(empRes?.data || []);
        } catch (error) {
            console.log('Failed to load tracking data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    const handleTrack = (empId: string) => {
        router.push({
            pathname: '/admin/track/[emp_id]',
            params: { emp_id: empId }
        });
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <Text style={styles.heading}>Active Tracking</Text>
            <Text style={styles.sub}>
                {tasks.length} employee{tasks.length !== 1 ? 's' : ''} currently on a task
            </Text>

            {tasks.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Ionicons name="map-outline" size={56} color="#93c5fd" />
                    <Text style={styles.emptyTitle}>No Active Tasks</Text>
                    <Text style={styles.emptyText}>Employees haven't started any tasks yet.</Text>
                </View>
            ) : (
                tasks.map((task, index) => {
                    const emp = employees.find(e => e._id === task.empId);
                    const hasLocation = emp?.latitude != null && emp?.longitude != null;

                    return (
                        <View key={task._id || index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {task.employee?.charAt(0).toUpperCase() || '?'}
                                    </Text>
                                </View>
                                <View style={styles.info}>
                                    <Text style={styles.name}>{task.employee || 'Unknown Employee'}</Text>
                                    <Text style={styles.taskTitle} numberOfLines={1}>
                                        Task: {task.title}
                                    </Text>
                                    <View style={styles.row}>
                                        <Ionicons name="location-outline" size={14} color="#64748b" />
                                        <Text style={styles.locationText} numberOfLines={1}>
                                            {task.location}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <TouchableOpacity
                                style={[styles.trackBtn, !hasLocation && styles.trackBtnDisabled]}
                                onPress={() => handleTrack(task.empId)}
                                disabled={!hasLocation}
                            >
                                <Ionicons name="navigate-circle-outline" size={20} color={hasLocation ? "#fff" : "#94a3b8"} />
                                <Text style={[styles.trackBtnText, !hasLocation && styles.trackBtnTextDisabled]}>
                                    {hasLocation ? "Track Location" : "Location Unavailable"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })
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
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    sub: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
    },
    emptyBox: {
        alignItems: 'center',
        paddingTop: 80,
        gap: 12,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 2,
    },
    taskTitle: {
        fontSize: 13,
        color: '#475569',
        marginBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        color: '#64748b',
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
    trackBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        borderRadius: 10,
    },
    trackBtnDisabled: {
        backgroundColor: '#f1f5f9',
    },
    trackBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    trackBtnTextDisabled: {
        color: '#94a3b8',
    },
});