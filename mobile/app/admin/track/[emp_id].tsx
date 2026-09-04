import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { allEmp } from '../../../api/allEmp';

type Employee = {
    _id: string;
    name: string;
    latitude: string | number;
    longitude: string | number;
};

export default function TrackEmployeeMap() {
    const { emp_id } = useLocalSearchParams();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchLocation = async () => {
        try {
            const res = await allEmp();
            const found = (res.data || []).find((e: Employee) => e._id === emp_id);
            if (found) {
                setEmployee(found);
            }
        } catch (error) {
            console.log('Failed to load employee location', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocation();
    }, [emp_id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (!employee || employee.latitude == null || employee.longitude == null) {
        return (
            <View style={styles.center}>
                <Ionicons name="location-outline" size={60} color="#cbd5e1" />
                <Text style={styles.errorText}>Location data is unavailable for this employee.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const lat = Number(employee.latitude);
    const lng = Number(employee.longitude);

    return (
        <View style={styles.container}>
            {/* Custom Header since this isn't a tab */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tracking: {employee.name}</Text>
                <TouchableOpacity onPress={fetchLocation} style={styles.refreshIcon}>
                    <Ionicons name="refresh" size={22} color="#2563eb" />
                </TouchableOpacity>
            </View>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                region={{
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{ latitude: lat, longitude: lng }}
                    title={employee.name}
                    description="Current Location"
                >
                    <View style={styles.markerContainer}>
                        <View style={styles.markerPin}>
                            <Ionicons name="person" size={16} color="#fff" />
                        </View>
                        <View style={styles.markerPointer} />
                    </View>
                </Marker>
            </MapView>

            <View style={styles.floatingCard}>
                <Text style={styles.infoTitle}>{employee.name}</Text>
                <Text style={styles.infoText}>
                    Lat: {lat.toFixed(6)}, Lng: {lng.toFixed(6)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    backBtn: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    backBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    backIcon: {
        padding: 4,
    },
    refreshIcon: {
        padding: 4,
        backgroundColor: '#eff6ff',
        borderRadius: 20,
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        alignItems: 'center',
    },
    markerPin: {
        backgroundColor: '#2563eb',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    markerPointer: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#2563eb',
        marginTop: -1,
    },
    floatingCard: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#64748b',
    },
});
