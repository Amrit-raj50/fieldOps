import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { updateEvidence, updateTaskStatus } from '../../../api/employeeTask';
import { Ionicons } from '@expo/vector-icons';

export default function EvidencePage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [evidenceInput, setEvidenceInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock quick photo capture simulation for field demonstration
    const handleCaptureMockPhoto = () => {
        const mockUrl = `https://fieldops-evidence.s3.amazonaws.com/evidence_${id}_${Date.now()}.jpg`;
        setEvidenceInput(mockUrl);
        Alert.alert('Photo Captured', 'Mock evidence photo captured and attached.');
    };

    const handleSubmitEvidence = async () => {
        if (!id) return;
        if (!evidenceInput.trim()) {
            Alert.alert('Required', 'Please attach photo evidence or photo URL.');
            return;
        }

        try {
            setLoading(true);
            // 1. Update evidence
            await updateEvidence(id, evidenceInput.trim());
            // 2. Mark task completed
            await updateTaskStatus(id, 'Completed');

            Alert.alert(
                'Task Completed',
                'Evidence has been submitted and task is marked as Completed!',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/employee/(tabs)/myTask'),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to submit evidence.');
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
                <Text style={styles.topBarTitle}>Submit Evidence</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.instruction}>
                    Take or attach photo evidence of the completed field work before finalizing the task.
                </Text>

                {/* Photo Capture Box */}
                <TouchableOpacity
                    style={styles.photoCaptureBox}
                    onPress={handleCaptureMockPhoto}
                >
                    <Ionicons name="camera" size={48} color="#4f46e5" />
                    <Text style={styles.captureText}>Tap to Capture / Select Photo</Text>
                    <Text style={styles.captureSubText}>JPEG, PNG supported</Text>
                </TouchableOpacity>

                {/* Evidence URL / Details Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Photo / Evidence URL</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="https://... or photo reference URL"
                        placeholderTextColor="#94a3b8"
                        value={evidenceInput}
                        onChangeText={setEvidenceInput}
                    />
                </View>

                {evidenceInput ? (
                    <View style={styles.previewBox}>
                        <Ionicons name="image" size={22} color="#10b981" />
                        <Text style={styles.previewText} numberOfLines={1}>
                            {evidenceInput}
                        </Text>
                    </View>
                ) : null}
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.btnDisabled]}
                    disabled={loading}
                    onPress={handleSubmitEvidence}
                >
                    {loading ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <>
                            <Ionicons name="cloud-upload-outline" size={20} color="#ffffff" />
                            <Text style={styles.submitText}>Submit & Complete Task</Text>
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
    instruction: {
        fontSize: 14,
        color: '#64748b',
        lineHeight: 20,
        marginBottom: 20,
    },
    photoCaptureBox: {
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#c7d2fe',
        borderStyle: 'dashed',
        borderRadius: 16,
        paddingVertical: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    captureText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#4f46e5',
        marginTop: 10,
    },
    captureSubText: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    },
    inputSection: {
        marginBottom: 16,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 14,
        color: '#0f172a',
    },
    previewBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#a7f3d0',
        gap: 8,
    },
    previewText: {
        flex: 1,
        fontSize: 12,
        color: '#047857',
        fontWeight: '500',
    },
    footer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    submitButton: {
        backgroundColor: '#10b981',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    submitText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnDisabled: {
        opacity: 0.6,
    },
});
