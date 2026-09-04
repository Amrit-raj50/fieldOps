import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { allTask } from '../../../api/allTask';
import { allEmp } from '../../../api/allEmp';
import { updateTaskDetails } from '../../../api/updateTaskDetails';

type Task = {
    _id: string;
    title: string;
    status: string;
    priority: string;
    employee: string;
    empId: string;
    location: string;
    dueDate: string;
    createdAt: string;
};

type Employee = {
    _id: string;
    name: string;
};

export default function InProgress() {
    const [tasks, setTasks]         = useState<Task[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading]     = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [selected, setSelected]         = useState<Task | null>(null);
    const [empId, setEmpId]               = useState('');
    const [employee, setEmployee]         = useState('');
    const [priority, setPriority]         = useState('');
    const [dueDate, setDueDate]           = useState('');
    const [saving, setSaving]             = useState(false);

    const loadData = async () => {
        try {
            const [taskRes, empRes] = await Promise.all([allTask(), allEmp()]);
            const inProgress = (taskRes?.data || []).filter(
                (t: Task) => t.status === 'In Progress'
            );
            setTasks(inProgress);
            setEmployees(empRes?.data || []);
        } catch (error) {
            console.log('Failed to load:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    const openEdit = (task: Task) => {
        setSelected(task);
        setEmpId(task.empId || '');
        setEmployee(task.employee || '');
        setPriority(task.priority || '');
        setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!selected) return;
        if (!empId || !employee || !priority || !dueDate) {
            Alert.alert('Required', 'All fields must be filled.');
            return;
        }

        try {
            setSaving(true);
            await updateTaskDetails(selected._id, { employee, empId, priority, dueDate });
            Alert.alert('Updated', 'Task updated successfully.');
            setModalVisible(false);
            setSelected(null);
            await loadData();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Update failed.');
        } finally {
            setSaving(false);
        }
    };

    const priorityColor: Record<string, string> = {
        High:   '#dc2626',
        Medium: '#d97706',
        Low:    '#16a34a',
    };
    const priorityBg: Record<string, string> = {
        High:   '#fee2e2',
        Medium: '#fef9c3',
        Low:    '#dcfce7',
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    return (
        <>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <Text style={styles.heading}>In Progress Tasks</Text>
                <Text style={styles.sub}>
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} currently in progress
                </Text>

                {tasks.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Ionicons name="checkmark-done-circle-outline" size={56} color="#93c5fd" />
                        <Text style={styles.emptyTitle}>All clear!</Text>
                        <Text style={styles.emptyText}>No tasks are currently in progress.</Text>
                    </View>
                ) : (
                    tasks.map((task, i) => (
                        <View key={task._id || i} style={styles.card}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardTitle} numberOfLines={1}>
                                    {task.title || 'Untitled'}
                                </Text>
                                <View style={[styles.priorityBadge, {
                                    backgroundColor: priorityBg[task.priority] || '#f1f5f9'
                                }]}>
                                    <Text style={[styles.priorityText, {
                                        color: priorityColor[task.priority] || '#555'
                                    }]}>
                                        {task.priority}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.row}>
                                <Ionicons name="person-outline" size={14} color="#94a3b8" />
                                <Text style={styles.meta}>{task.employee || 'Unassigned'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Ionicons name="location-outline" size={14} color="#94a3b8" />
                                <Text style={styles.meta} numberOfLines={1}>{task.location || 'N/A'}</Text>
                            </View>
                            <View style={styles.row}>
                                <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                                <Text style={styles.meta}>
                                    Due: {task.dueDate
                                        ? new Date(task.dueDate).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                          })
                                        : 'N/A'}
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.editBtn}
                                onPress={() => openEdit(task)}
                            >
                                <Ionicons name="create-outline" size={16} color="#fff" />
                                <Text style={styles.editBtnText}>Update Task</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Task</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Ionicons name="close-circle" size={26} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>

                        {selected && (
                            <Text style={styles.modalTaskName} numberOfLines={1}>
                                {selected.title}
                            </Text>
                        )}

                        <ScrollView showsVerticalScrollIndicator={false}>

                            {/* Employee ID */}
                            <Text style={styles.inputLabel}>Employee ID</Text>
                            <View style={styles.pickerBox}>
                                <Picker
                                    selectedValue={empId}
                                    onValueChange={(val) => {
                                        setEmpId(val);
                                        const found = employees.find(e => e._id === val);
                                        if (found) setEmployee(found.name);
                                    }}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select employee..." value="" color="#999" />
                                    {employees.map(emp => (
                                        <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                                    ))}
                                </Picker>
                            </View>

                            {/* Employee name auto-filled */}
                            <Text style={styles.inputLabel}>Employee Name</Text>
                            <View style={styles.readonlyBox}>
                                <Text style={styles.readonlyText}>{employee || '—'}</Text>
                            </View>

                            {/* Priority */}
                            <Text style={styles.inputLabel}>Priority</Text>
                            <View style={styles.pickerBox}>
                                <Picker
                                    selectedValue={priority}
                                    onValueChange={setPriority}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select priority..." value="" color="#999" />
                                    <Picker.Item label="Low"    value="Low" />
                                    <Picker.Item label="Medium" value="Medium" />
                                    <Picker.Item label="High"   value="High" />
                                </Picker>
                            </View>

                            {/* Due Date */}
                            <Text style={styles.inputLabel}>Due Date (YYYY-MM-DD)</Text>
                            <TextInput
                                style={styles.textInput}
                                value={dueDate}
                                onChangeText={setDueDate}
                                placeholder="e.g. 2026-09-30"
                                placeholderTextColor="#94a3b8"
                                keyboardType="numbers-and-punctuation"
                            />

                            <TouchableOpacity
                                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                                onPress={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <>
                                        <Ionicons name="save-outline" size={18} color="#fff" />
                                        <Text style={styles.saveBtnText}>Save Changes</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
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
        fontSize: 13,
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
        padding: 18,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#2563eb',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 5,
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        flex: 1,
        marginRight: 8,
    },
    priorityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    priorityText: {
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
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 14,
    },
    editBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-end',
    },
    modalCard: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    modalTaskName: {
        fontSize: 13,
        color: '#64748b',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
        marginTop: 14,
    },
    pickerBox: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        overflow: 'hidden',
    },
    picker: {
        height: 52,
    },
    readonlyBox: {
        backgroundColor: '#f1f5f9',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 14,
    },
    readonlyText: {
        fontSize: 15,
        color: '#334155',
        fontWeight: '600',
    },
    textInput: {
        backgroundColor: '#f8fafc',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontSize: 15,
        color: '#0f172a',
    },
    saveBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563eb',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 10,
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});