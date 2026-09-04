import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { getProfile, updateProfileName, logoutApi } from '../../../api/profile';
import { Ionicons } from '@expo/vector-icons';

export default function ClientProfile() {
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const userString = await AsyncStorage.getItem('user');
            if (userString) {
                const parsedUser = JSON.parse(userString);
                setUser(parsedUser);
                setName(parsedUser.name || '');

                const profileData = await getProfile(parsedUser._id);
                if (profileData?.user) {
                    setUser(profileData.user);
                    setName(profileData.user.name || '');
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveName = async () => {
        if (!name.trim()) {
            Alert.alert('Required', 'Name cannot be empty.');
            return;
        }

        try {
            setSaving(true);
            await updateProfileName(user._id, name.trim());
            const updatedUser = { ...user, name: name.trim() };
            setUser(updatedUser);
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setIsEditing(false);
            Alert.alert('Success', 'Profile name updated successfully.');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update name.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await logoutApi();
                    } catch (e) {
                        // ignore API failure
                    }
                    await AsyncStorage.removeItem('user');
                    router.replace('/');
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {(user?.name || 'E').charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.name}>{user?.name || 'Employee'}</Text>
                <Text style={styles.role}>{user?.role || 'Field Staff'}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Account Details</Text>

                {/* Name Row with inline edit */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    {isEditing ? (
                        <View style={styles.editInputContainer}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter full name"
                            />
                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleSaveName}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.valueRow}>
                            <Text style={styles.fieldValue}>{user?.name || 'N/A'}</Text>
                            <TouchableOpacity onPress={() => setIsEditing(true)}>
                                <Text style={styles.editText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={styles.divider} />

                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Email Address</Text>
                    <Text style={styles.fieldValue}>{user?.email || 'N/A'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Role</Text>
                    <Text style={styles.fieldValue}>{user?.role || 'Employee'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Account ID</Text>
                    <Text style={[styles.fieldValue, styles.idText]}>{user?._id || 'N/A'}</Text>
                </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
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
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4f46e5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarText: {
        fontSize: 32,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    role: {
        fontSize: 14,
        color: '#64748b',
        textTransform: 'capitalize',
        marginTop: 2,
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
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
    },
    fieldRow: {
        marginVertical: 4,
    },
    fieldLabel: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '500',
        marginBottom: 4,
    },
    fieldValue: {
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editText: {
        color: '#4f46e5',
        fontSize: 14,
        fontWeight: '600',
    },
    idText: {
        fontSize: 12,
        color: '#64748b',
    },
    editInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 15,
        color: '#0f172a',
    },
    saveBtn: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    saveBtnText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 40,
        gap: 8,
    },
    logoutText: {
        color: '#dc2626',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
