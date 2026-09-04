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
import { useState } from 'react';
import { rejectComplain } from '../../../api/allComplains';
import { Ionicons } from '@expo/vector-icons';

export default function ComplainDetail() {
    const { complain_id, title, description, location, dueDate, createdAt } = useLocalSearchParams();
    const [rejecting, setRejecting] = useState(false);

    const handleReject = () => {
        Alert.alert(
            'Reject Complaint',
            'Are you sure you want to reject this complaint?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setRejecting(true);
                            await rejectComplain(complain_id as string, 'Rejected by admin');
                            Alert.alert('Done', 'Complaint rejected successfully.', [
                                { text: 'OK', onPress: () => router.back() },
                            ]);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to reject complaint.');
                        } finally {
                            setRejecting(false);
                        }
                    },
                },
            ]
        );
    };

    const handleAccept = () => {
        router.push({
            pathname: '/admin/complain/assign',
            params: {
                task_id: complain_id,
                title,
                description,
                location,
                dueDate,
            },
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Back */}
            <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color="#4f46e5" />
                <Text style={styles.backText}>Back to Complaints</Text>
            </TouchableOpacity>

            <Text style={styles.heading}>Complaint Details</Text>

            <View style={styles.card}>
                <Text style={styles.fieldLabel}>Title</Text>
                <Text style={styles.fieldValue}>{title || 'N/A'}</Text>

                <View style={styles.divider} />

                <Text style={styles.fieldLabel}>Description</Text>
                <Text style={styles.fieldValue}>{description || 'No description provided'}</Text>

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

                <View style={styles.divider} />

                <Text style={styles.fieldLabel}>Submitted On</Text>
                <Text style={styles.fieldValue}>
                    {createdAt ? new Date(createdAt as string).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric'
                    }) : 'N/A'}
                </Text>

                <View style={styles.divider} />

                <Text style={styles.fieldLabel}>Complaint ID</Text>
                <Text style={[styles.fieldValue, styles.idText]}>{complain_id}</Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={handleReject}
                    disabled={rejecting}
                >
                    {rejecting ? (
                        <ActivityIndicator size="small" color="#dc2626" />
                    ) : (
                        <>
                            <Ionicons name="close-circle-outline" size={20} color="#dc2626" />
                            <Text style={styles.rejectText}>Reject</Text>
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.acceptText}>Accept & Assign</Text>
                </TouchableOpacity>
            </View>
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
        paddingBottom: 40,
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        marginBottom: 28,
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
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
        lineHeight: 22,
    },
    idText: {
        fontSize: 12,
        color: '#94a3b8',
        fontFamily: 'monospace',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 14,
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    rejectBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#fee2e2',
        paddingVertical: 16,
        borderRadius: 12,
    },
    rejectText: {
        color: '#dc2626',
        fontSize: 15,
        fontWeight: 'bold',
    },
    acceptBtn: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#4f46e5',
        paddingVertical: 16,
        borderRadius: 12,
    },
    acceptText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
});
