import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { allEmp } from '../../../api/allEmp';
import { assignComplain } from '../../../api/allComplains';

type Employee = {
    name: string;
    _id: string;
};

export default function AssignComplain() {
    const { task_id, title, description, location, dueDate } = useLocalSearchParams();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [empId, setEmpId] = useState('');
    const [employee, setEmployee] = useState('');
    const [priority, setPriority] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loadingEmps, setLoadingEmps] = useState(true);

    const fetchEmployees = async () => {
        try {
            const result = await allEmp();
            setEmployees(result.data || []);
        } catch (error) {
            console.log('failed to load employees:', error);
        } finally {
            setLoadingEmps(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAssign = async () => {
        if (!empId || !employee || !priority) {
            Alert.alert('Required', 'Please select an employee and priority.');
            return;
        }

        try {
            setSubmitting(true);
            await assignComplain(task_id as string, {
                employee,
                empId,
                priority,
            });

            Alert.alert('Success', 'Complaint assigned to employee successfully!', [
                {
                    text: 'OK',
                    onPress: () => router.replace('/admin/(tabs)/complaints'),
                },
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Assignment failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Back */}
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color="#4f46e5" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.heading}>Assign to Employee</Text>

            {/* Read-only complaint info */}
            <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Complaint Info</Text>

                <Text style={styles.fieldLabel}>Title</Text>
                <Text style={styles.fieldValue}>{title || 'N/A'}</Text>

                <View style={styles.divider} />

                <Text style={styles.fieldLabel}>Description</Text>
                <Text style={styles.fieldValue}>{description || 'N/A'}</Text>

                <View style={styles.divider} />

                <Text style={styles.fieldLabel}>Location</Text>
                <Text style={styles.fieldValue}>{location || 'N/A'}</Text>

                <View style={styles.divider} />

                <Text style={styles.fieldLabel}>Due Date</Text>
                <Text style={styles.fieldValue}>
                    {dueDate ? new Date(dueDate as string).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    }) : 'N/A'}
                </Text>
            </View>

            {/* Assignment section */}
            <Text style={styles.sectionTitle}>Assign To</Text>

            {loadingEmps ? (
                <ActivityIndicator color="#4f46e5" style={{ marginVertical: 20 }} />
            ) : (
                <>
                    {/* Employee ID picker */}
                    <View style={styles.pickerCard}>
                        <Text style={styles.pickerLabel}>Select Employee ID</Text>
                        <Picker
                            selectedValue={empId}
                            onValueChange={(val) => setEmpId(val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select employee ID..." value="" color="#999" />
                            {employees.map((emp) => (
                                <Picker.Item key={emp._id} label={emp.name} value={emp._id} />
                            ))}
                        </Picker>
                    </View>

                    {/* Employee Name picker */}
                    <View style={styles.pickerCard}>
                        <Text style={styles.pickerLabel}>Select Employee Name</Text>
                        <Picker
                            selectedValue={employee}
                            onValueChange={(val) => setEmployee(val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select employee name..." value="" color="#999" />
                            {employees.map((emp) => (
                                <Picker.Item key={emp._id} label={emp.name} value={emp.name} />
                            ))}
                        </Picker>
                    </View>

                    {/* Priority picker */}
                    <View style={styles.pickerCard}>
                        <Text style={styles.pickerLabel}>Priority</Text>
                        <Picker
                            selectedValue={priority}
                            onValueChange={(val) => setPriority(val)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select priority..." value="" color="#999" />
                            <Picker.Item label="Low" value="Low" />
                            <Picker.Item label="Medium" value="Medium" />
                            <Picker.Item label="High" value="High" />
                        </Picker>
                    </View>
                </>
            )}

            <TouchableOpacity
                style={[styles.assignBtn, submitting && styles.assignBtnDisabled]}
                onPress={handleAssign}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <>
                        <Ionicons name="person-add-outline" size={20} color="#fff" />
                        <Text style={styles.assignBtnText}>Assign Task</Text>
                    </>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
    },
    content: {
        padding: 20,
        paddingBottom: 50,
    },
    backRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 20,
        marginTop: 10,
    },
    backText: {
        color: '#4f46e5',
        fontSize: 14,
        fontWeight: '600',
    },
    heading: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 20,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    infoCardTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#4f46e5',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 14,
    },
    fieldLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '500',
        lineHeight: 21,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 14,
    },
    pickerCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 14,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    pickerLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    picker: {
        height: 52,
        width: '100%',
    },
    assignBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#4f46e5',
        paddingVertical: 16,
        borderRadius: 14,
        marginTop: 10,
    },
    assignBtnDisabled: {
        opacity: 0.6,
    },
    assignBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
