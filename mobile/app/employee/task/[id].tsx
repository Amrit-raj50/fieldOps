import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getTaskDetails, updateTaskStatus, updateStartTask } from '../../../api/employeeTask';
import { Ionicons } from '@expo/vector-icons';

export default function TaskDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const loadTask = async () => {
        if (!id) return;
        try {
            const response = await getTaskDetails(id);
            if (response?.task) {
                setTask(response.task);
            }
        } catch (error) {
            console.error('Failed to get task details:', error);
            Alert.alert('Error', 'Unable to load task details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTask();
    }, [id]);

    const handleStartTask = async () => {
        if (!id) return;
        try {
            setActionLoading(true);
            await updateTaskStatus(id, 'In Progress');
            await updateStartTask(id);
            Alert.alert('Task Started', 'Task status is now In Progress.');
            loadTask();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to start task.');
        } finally {
            setActionLoading(false);
        }
    };

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

    if (!task) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Task not found.</Text>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const statusStyle = getStatusStyle(task.status);
    const isInProgress = task.status === 'In Progress';
    const isCompleted = task.status === 'Completed';
    const isCancelled = task.status === 'Cancelled' || task.status === 'Cancled';

    return (
        <View style={styles.mainContainer}>
            {/* Header */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backIconButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Task Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.scrollContent}>
                {/* Status and Priority Banner */}
                <View style={styles.bannerRow}>
                    <View
                        style={[
                            styles.badge,
                            { backgroundColor: statusStyle.bg },
                        ]}
                    >
                        <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                            {task.status || 'Pending'}
                        </Text>
                    </View>

                    <View style={[styles.badge, styles.priorityBadge]}>
                        <Text style={styles.priorityText}>
                            {task.priority || 'Medium'} Priority
                        </Text>
                    </View>
                </View>

                {/* Title and ID */}
                <Text style={styles.title}>{task.title}</Text>
                <Text style={styles.taskId}>ID: {task._id}</Text>

                {/* Details Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionHeading}>Description</Text>
                    <Text style={styles.bodyText}>
                        {task.description || 'No description provided.'}
                    </Text>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={20} color="#64748b" />
                        <View style={styles.detailTextCol}>
                            <Text style={styles.detailLabel}>Location</Text>
                            <Text style={styles.detailValue}>
                                {task.location || 'Not specified'}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={20} color="#64748b" />
                        <View style={styles.detailTextCol}>
                            <Text style={styles.detailLabel}>Due Date</Text>
                            <Text style={styles.detailValue}>
                                {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString()
                                    : 'No due date'}
                            </Text>
                        </View>
                    </View>

                    {task.rejectReason && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.detailRow}>
                                <Ionicons name="alert-circle-outline" size={20} color="#ef4444" />
                                <View style={styles.detailTextCol}>
                                    <Text style={[styles.detailLabel, { color: '#ef4444' }]}>
                                        Rejection Reason
                                    </Text>
                                    <Text style={styles.detailValue}>{task.rejectReason}</Text>
                                </View>
                            </View>
                        </>
                    )}

                    {task.cancelReason && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.detailRow}>
                                <Ionicons name="close-circle-outline" size={20} color="#ef4444" />
                                <View style={styles.detailTextCol}>
                                    <Text style={[styles.detailLabel, { color: '#ef4444' }]}>
                                        Cancellation Reason
                                    </Text>
                                    <Text style={styles.detailValue}>{task.cancelReason}</Text>
                                </View>
                            </View>
                        </>
                    )}

                    {task.evidence && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.detailRow}>
                                <Ionicons name="image-outline" size={20} color="#10b981" />
                                <View style={styles.detailTextCol}>
                                    <Text style={[styles.detailLabel, { color: '#10b981' }]}>
                                        Evidence Submitted
                                    </Text>
                                    <Text style={styles.detailValue}>{task.evidence}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Action Controls */}
            {!isCompleted && !isCancelled && (
                <View style={styles.footer}>
                    {!isInProgress ? (
                        <TouchableOpacity
                            style={[
                                styles.primaryBtn,
                                actionLoading && styles.btnDisabled,
                            ]}
                            disabled={actionLoading}
                            onPress={handleStartTask}
                        >
                            {actionLoading ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <>
                                    <Ionicons name="play" size={18} color="#ffffff" />
                                    <Text style={styles.primaryBtnText}>Start Task</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.inProgressActionRow}>
                            <TouchableOpacity
                                style={styles.cancelActionBtn}
                                onPress={() =>
                                    router.push({
                                        pathname: '/employee/task/cancel',
                                        params: { id: task._id },
                                    })
                                }
                            >
                                <Ionicons name="close" size={18} color="#dc2626" />
                                <Text style={styles.cancelActionText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.completeActionBtn}
                                onPress={() =>
                                    router.push({
                                        pathname: '/employee/task/evidence',
                                        params: { id: task._id },
                                    })
                                }
                            >
                                <Ionicons name="checkmark-done" size={18} color="#ffffff" />
                                <Text style={styles.completeActionText}>Complete Task</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8fafc',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 45,
        paddingBottom: 12,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
    },
    backIconButton: {
        padding: 8,
    },
    topBarTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    bannerRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    priorityBadge: {
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    priorityText: {
        color: '#b45309',
        fontSize: 12,
        fontWeight: '700',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    taskId: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    sectionHeading: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 6,
    },
    bodyText: {
        fontSize: 15,
        color: '#1e293b',
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 14,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    detailTextCol: {
        marginLeft: 12,
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: '#1e293b',
        fontWeight: '600',
        marginTop: 2,
    },
    footer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    primaryBtn: {
        backgroundColor: '#4f46e5',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    primaryBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnDisabled: {
        opacity: 0.6,
    },
    inProgressActionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelActionBtn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fca5a5',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 6,
    },
    cancelActionText: {
        color: '#dc2626',
        fontSize: 15,
        fontWeight: 'bold',
    },
    completeActionBtn: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#10b981',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 6,
    },
    completeActionText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: '#64748b',
        marginBottom: 14,
    },
    backBtn: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});
