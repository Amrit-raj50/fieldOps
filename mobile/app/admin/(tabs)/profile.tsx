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
import { allTask } from '../../../api/allTask';
import { allEmp } from '../../../api/allEmp';
import { allComplains } from '../../../api/allComplains';
import { Ionicons } from '@expo/vector-icons';

export default function AdminProfile() {
    const [user, setUser] = useState<any>(null);
    const [name, setName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Stats
    const [totalTasks, setTotalTasks] = useState<number | null>(null);
    const [totalEmployees, setTotalEmployees] = useState<number | null>(null);
    const [pendingComplaints, setPendingComplaints] = useState<number | null>(null);

    useEffect(() => {
        loadProfile();
        loadStats();
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

    const loadStats = async () => {
        try {
            const [tasks, emps, complains] = await Promise.all([
                allTask(),
                allEmp(),
                allComplains(),
            ]);
            setTotalTasks(tasks?.data?.length ?? 0);
            setTotalEmployees(emps?.data?.length ?? 0);
            setPendingComplaints(complains?.data?.length ?? 0);
        } catch (error) {
            console.error('Error loading stats:', error);
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
            Alert.alert('Success', 'Name updated successfully.');
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
                    try { await logoutApi(); } catch (e) { /* ignore */ }
                    await AsyncStorage.removeItem('user');
                    router.replace('/');
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#7c3aed" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {(user?.name || 'A').charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.name}>{user?.name || 'Admin'}</Text>
                <View style={styles.roleBadge}>
                    <Ionicons name="shield-checkmark" size={13} color="#7c3aed" />
                    <Text style={styles.roleText}>Administrator</Text>
                </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { borderTopColor: '#4f46e5' }]}>
                    <Text style={styles.statNumber}>
                        {totalTasks !== null ? totalTasks : '—'}
                    </Text>
                    <Text style={styles.statLabel}>Total Tasks</Text>
                </View>
                <View style={[styles.statCard, { borderTopColor: '#059669' }]}>
                    <Text style={styles.statNumber}>
                        {totalEmployees !== null ? totalEmployees : '—'}
                    </Text>
                    <Text style={styles.statLabel}>Employees</Text>
                </View>
                <View style={[styles.statCard, { borderTopColor: '#d97706' }]}>
                    <Text style={styles.statNumber}>
                        {pendingComplaints !== null ? pendingComplaints : '—'}
                    </Text>
                    <Text style={styles.statLabel}>Complaints</Text>
                </View>
            </View>

            {/* Account Details */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Account Details</Text>

                {/* Name */}
                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Full Name</Text>
                    {isEditing ? (
                        <View style={styles.editRow}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter full name"
                                autoFocus
                            />
                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleSaveName}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator size="small" color="#fff" />
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
                    <Text style={styles.fieldValue}>{user?.role || 'admin'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Account ID</Text>
                    <Text style={[styles.fieldValue, styles.idText]}>{user?._id || 'N/A'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Last Login</Text>
                    <Text style={styles.fieldValue}>
                        {user?.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric'
                              })
                            : 'N/A'}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.fieldRow}>
                    <Text style={styles.fieldLabel}>Account Status</Text>
                    <View style={styles.activeBadge}>
                        <View style={styles.activeDot} />
                        <Text style={styles.activeText}>Active</Text>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Quick Actions</Text>

                <TouchableOpacity
                    style={styles.actionRow}
                    onPress={() => router.push('/admin/(tabs)/complaints')}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#fef9c3' }]}>
                        <Ionicons name="alert-circle-outline" size={20} color="#a16207" />
                    </View>
                    <Text style={styles.actionLabel}>Review Complaints</Text>
                    <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.actionRow}
                    onPress={() => router.push('/admin/(tabs)/employee')}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                        <Ionicons name="people-outline" size={20} color="#1d4ed8" />
                    </View>
                    <Text style={styles.actionLabel}>Manage Employees</Text>
                    <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.actionRow}
                    onPress={() => router.push('/admin/(tabs)/taskList')}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                        <Ionicons name="list-outline" size={20} color="#15803d" />
                    </View>
                    <Text style={styles.actionLabel}>View All Tasks</Text>
                    <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.actionRow}
                    onPress={() => router.push('/admin/(tabs)/trackUser')}
                >
                    <View style={[styles.actionIcon, { backgroundColor: '#ede9fe' }]}>
                        <Ionicons name="map-outline" size={20} color="#7c3aed" />
                    </View>
                    <Text style={styles.actionLabel}>Track Employees</Text>
                    <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#dc2626" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

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
        paddingTop: 48,
        paddingBottom: 50,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
    },

    // Header
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
        backgroundColor: '#7c3aed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#7c3aed',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
    },
    avatarText: {
        fontSize: 36,
        color: '#fff',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 6,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#ede9fe',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    roleText: {
        color: '#7c3aed',
        fontSize: 13,
        fontWeight: '700',
    },

    // Stats
    statsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        alignItems: 'center',
        borderTopWidth: 3,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
    },
    statNumber: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    statLabel: {
        fontSize: 11,
        color: '#64748b',
        fontWeight: '600',
        marginTop: 2,
        textAlign: 'center',
    },

    // Card
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
    },

    // Fields
    fieldRow: {
        marginVertical: 2,
    },
    fieldLabel: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
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
        color: '#7c3aed',
        fontSize: 14,
        fontWeight: '600',
    },
    idText: {
        fontSize: 12,
        color: '#94a3b8',
    },
    editRow: {
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
        backgroundColor: '#7c3aed',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    saveBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 12,
    },

    // Status badge
    activeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    activeDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e',
    },
    activeText: {
        color: '#15803d',
        fontWeight: '700',
        fontSize: 14,
    },

    // Quick actions
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionIcon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
    },

    // Logout
    logoutButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fee2e2',
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 10,
        gap: 8,
    },
    logoutText: {
        color: '#dc2626',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
