import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { cancelTask } from '../../../api/employeeTask';
import { Ionicons } from '@expo/vector-icons';

export default function CancelTaskPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirmCancel = async () => {
        if (!id) return;
        if (!reason.trim()) {
            Alert.alert('Required', 'Please provide a reason for cancelling this task.');
            return;
        }

        try {
            setLoading(true);
            await cancelTask(id, reason.trim());
            Alert.alert(
                'Task Cancelled',
                'Task has been cancelled and admin has been notified with your reason.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/employee/(tabs)/myTask'),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to cancel task.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.topBar}>
                <TouchableOpacity
                    style={styles.backIconButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Cancel Task</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.warningBox}>
                    <Ionicons name="warning-outline" size={24} color="#dc2626" />
                    <Text style={styles.warningText}>
                        Cancelling an active task requires admin notification and reason documentation.
                    </Text>
                </View>

                <Text style={styles.label}>Cancellation Reason</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter reason for task cancellation (e.g., Client unavailable, hazardous conditions, vehicle breakdown)..."
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={5}
                    value={reason}
                    onChangeText={setReason}
                />
            </View>

            {/* Action Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.cancelBtn, loading && styles.btnDisabled]}
                    disabled={loading}
                    onPress={handleConfirmCancel}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <>
                            <Ionicons name="close-circle-outline" size={20} color="#ffffff" />
                            <Text style={styles.cancelBtnText}>Confirm Cancellation</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    content: {
        flex: 1,
        padding: 20,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        borderWidth: 1,
        borderColor: '#fca5a5',
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
        gap: 12,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: '#b91c1c',
        lineHeight: 18,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 12,
        padding: 14,
        fontSize: 14,
        color: '#0f172a',
        textAlignVertical: 'top',
        minHeight: 120,
    },
    footer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    cancelBtn: {
        backgroundColor: '#ef4444',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    cancelBtnText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnDisabled: {
        opacity: 0.6,
    },
});
