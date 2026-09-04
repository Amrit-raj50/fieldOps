import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import { updateLoc } from '../../../api/updateLoc';
// import { Ionicons } from '@expo/vector-icons';

export default function EmployeeMap() {
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [isTracking, setIsTracking] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        let subscription: Location.LocationSubscription;

        const startWatching = async () => {
            try {
                const userString = await AsyncStorage.getItem('user');
                if (!userString) return;
                const parsedUser = JSON.parse(userString);
                const userId = parsedUser._id;

                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Denied',
                        'Location permission is required for field operations.'
                    );
                    return;
                }

                setIsTracking(true);

                // Get initial current position
                const initialLocation = await Location.getCurrentPositionAsync({});
                setLatitude(initialLocation.coords.latitude);
                setLongitude(initialLocation.coords.longitude);

                subscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        distanceInterval: 10,
                    },
                    async (location) => {
                        const { latitude: lat, longitude: lng } = location.coords;
                        setLatitude(lat);
                        setLongitude(lng);
                        setLastUpdated(new Date().toLocaleTimeString());

                        try {
                            await updateLoc(userId, lat, lng);
                        } catch (err) {
                            console.error('Failed to sync location to backend:', err);
                        }
                    }
                );
            } catch (error) {
                console.error('Location watching error:', error);
            }
        };

        startWatching();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            {latitude && longitude ? (
                <MapView
                    style={styles.map}
                    region={{
                        latitude: latitude,
                        longitude: longitude,
                        latitudeDelta: 0.012,
                        longitudeDelta: 0.012,
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    <Marker
                        coordinate={{
                            latitude: latitude,
                            longitude: longitude,
                        }}
                        title="Your Location"
                        description="Live field employee location"
                    />
                </MapView>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4f46e5" />
                    <Text style={styles.loadingText}>Acquiring GPS coordinates...</Text>
                </View>
            )}

            {/* Status Floating Pill */}
            <View style={styles.statusPill}>
                <View style={[styles.dot, isTracking ? styles.dotGreen : styles.dotGray]} />
                <Text style={styles.statusText}>
                    {isTracking ? 'Live Tracking Active' : 'Connecting GPS...'}
                </Text>
                {lastUpdated && (
                    <Text style={styles.timeText}>({lastUpdated})</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    map: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#64748b',
    },
    statusPill: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        backgroundColor: '#ffffff',
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    dotGreen: {
        backgroundColor: '#10b981',
    },
    dotGray: {
        backgroundColor: '#94a3b8',
    },
    statusText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1e293b',
    },
    timeText: {
        fontSize: 12,
        color: '#64748b',
        marginLeft: 6,
    },
});
