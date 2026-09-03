import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { getMyTasks, acceptTask, rejectTask } from '../../../api/employeeTask';
import { Ionicons } from '@expo/vector-icons';

export default function AssignedTasks() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    // Rejection modal states
    const [rejectModalVisible, setRejectModalVisible] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

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

            // Filter for unaccepted tasks that are not rejected or cancelled
            const assignedOnly = taskList.filter(
                (item: any) =>
                    !item.accept &&
                    item.status !== 'Rejected' &&
                    item.status !== 'Cancelled' &&
                    item.status !== 'Cancled'
            );
            setTasks(assignedOnly);
        } catch (error) {
            console.error('Failed to load assigned tasks:', error);
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

    const handleAccept = async (taskId: string) => {
        try {
            setActionLoadingId(taskId);
            const result = await acceptTask(taskId);
            Alert.alert('Task Accepted', 'Task moved to My Tasks.');
            loadTasks();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to accept task.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const openRejectModal = (taskId: string) => {
        setSelectedTaskId(taskId);
        setRejectReason('');
        setRejectModalVisible(true);
    };

    const handleConfirmReject = async () => {
        if (!selectedTaskId) return;
        if (!rejectReason.trim()) {
            Alert.alert('Required', 'Please enter a rejection reason.');
            return;
        }

        try {
            setActionLoadingId(selectedTaskId);
            setRejectModalVisible(false);
            await rejectTask(selectedTaskId, rejectReason.trim());
            Alert.alert('Task Rejected', 'Admin has been notified with your reason.');
            loadTasks();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to reject task.');
        } finally {
            setActionLoadingId(null);
            setSelectedTaskId(null);
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
        <View style={styles.mainContainer}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text style={styles.heading}>Assigned Tasks</Text>
                <Text style={styles.subHeading}>
                    Review new tasks assigned to you. Accept to start or Reject with a reason.
                </Text>

                {tasks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="file-tray" size={48} color="#94a3b8" />
                        <Text style={styles.emptyTitle}>No pending assignments</Text>
                        <Text style={styles.emptySubtitle}>
                            All assigned tasks have been responded to.
                        </Text>
                    </View>
                ) : (
                    tasks.map((task) => {
                        const isActionInProgress = actionLoadingId === task._id;

                        return (
                            <View key={task._id} style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.title}>{task.title}</Text>
                                    <View style={styles.priorityBadge}>
                                        <Text style={styles.priorityText}>
                                            {task.priority || 'Medium'}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.description}>
                                    {task.description || 'No description provided.'}
                                </Text>

                                <View style={styles.infoRow}>
                                    <Ionicons name="location-outline" size={16} color="#64748b" />
                                    <Text style={styles.infoText}>
                                        {task.location || 'Not specified'}
                                    </Text>
                                </View>

                                <View style={styles.infoRow}>
                                    <Ionicons name="calendar-outline" size={16} color="#64748b" />
                                    <Text style={styles.infoText}>
                                        Due:{' '}
                                        {task.dueDate
                                            ? new Date(task.dueDate).toLocaleDateString()
                                            : 'No date'}
                                    </Text>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.rejectButton,
                                            isActionInProgress && styles.buttonDisabled,
                                        ]}
                                        disabled={isActionInProgress}
                                        onPress={() => openRejectModal(task._id)}
                                    >
                                        <Ionicons name="close-circle-outline" size={18} color="#ef4444" />
                                        <Text style={styles.rejectText}>Reject</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.button,
                                            styles.acceptButton,
                                            isActionInProgress && styles.buttonDisabled,
                                        ]}
                                        disabled={isActionInProgress}
                                        onPress={() => handleAccept(task._id)}
                                    >
                                        {isActionInProgress ? (
                                            <ActivityIndicator size="small" color="#ffffff" />
                                        ) : (
                                            <>
                                                <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
                                                <Text style={styles.acceptText}>Accept</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            {/* Rejection Reason Modal */}
            <Modal
                visible={rejectModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setRejectModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Reject Task</Text>
                        <Text style={styles.modalSubtitle}>
                            Please specify the reason for rejecting this assigned task.
                        </Text>

                        <TextInput
                            style={styles.modalInput}
                            placeholder="e.g., Unavailable schedule, out of designated zone..."
                            placeholderTextColor="#94a3b8"
                            multiline
                            numberOfLines={4}
                            value={rejectReason}
                            onChangeText={setRejectReason}
                        />

                        <View style={styles.modalButtonRow}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalCancelBtn]}
                                onPress={() => setRejectModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalSubmitBtn]}
                                onPress={handleConfirmReject}
                            >
                                <Text style={styles.modalSubmitText}>Submit Rejection</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 45,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subHeading: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
        marginBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        flex: 1,
        marginRight: 8,
    },
    priorityBadge: {
        backgroundColor: '#fffbeb',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    priorityText: {
        color: '#b45309',
        fontSize: 12,
        fontWeight: '700',
    },
    description: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#475569',
        marginLeft: 6,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 14,
        gap: 12,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
    },
    rejectButton: {
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fca5a5',
    },
    rejectText: {
        color: '#dc2626',
        fontWeight: '700',
        fontSize: 14,
    },
    acceptButton: {
        backgroundColor: '#4f46e5',
    },
    acceptText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 14,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
        padding: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#475569',
        marginTop: 12,
    },
    emptySubtitle: {
        fontSize: 13,
        color: '#94a3b8',
        textAlign: 'center',
        marginTop: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 18,
        padding: 20,
        elevation: 6,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 6,
    },
    modalSubtitle: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 14,
    },
    modalInput: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 10,
        padding: 12,
        fontSize: 14,
        color: '#0f172a',
        textAlignVertical: 'top',
        minHeight: 90,
        marginBottom: 18,
    },
    modalButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    modalBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    modalCancelBtn: {
        backgroundColor: '#f1f5f9',
    },
    modalCancelText: {
        color: '#64748b',
        fontWeight: '600',
        fontSize: 14,
    },
    modalSubmitBtn: {
        backgroundColor: '#ef4444',
    },
    modalSubmitText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
