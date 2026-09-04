import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function LandingPage() {
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(30);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <ScrollView style={styles.container} bounces={false}>
            <StatusBar style="light" />
            
            {/* 
              Background Gradient (Fixed position)
            */}
            <View style={StyleSheet.absoluteFillObject}>
                <LinearGradient
                    colors={['#0f172a', '#1e293b', '#000000']}
                    style={StyleSheet.absoluteFillObject}
                />
            </View>

            <View style={styles.heroSection}>
                
                {/* Logo / Icon */}
                <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                    <View style={styles.iconCircle}>
                        <Ionicons name="construct-outline" size={54} color="#6366f1" />
                    </View>
                    <Text style={styles.title}>FieldOps</Text>
                    <Text style={styles.tagline}>
                        Streamline your field team.
                        {'\n'}Manage complaints, tasks & operations.
                    </Text>
                </Animated.View>

                {/* Actions */}
                <Animated.View style={[styles.actionContainer, { opacity: fadeAnim }]}>
                    
                    <TouchableOpacity 
                        style={[styles.button, styles.primaryButton]} 
                        activeOpacity={0.8}
                        onPress={() => router.push('/login')}
                    >
                        <Text style={styles.primaryButtonText}>Log In</Text>
                        <Ionicons name="arrow-forward" size={20} color="#ffffff" style={styles.btnIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.button, styles.secondaryButton]} 
                        activeOpacity={0.8}
                        onPress={() => router.push('/signup')}
                    >
                        <Text style={styles.secondaryButtonText}>Create an Account</Text>
                    </TouchableOpacity>

                </Animated.View>
            </View>

            {/* Features Section */}
            <Animated.View style={[styles.featuresSection, { opacity: fadeAnim }]}>
                <Text style={styles.featuresHeading}>Why FieldOps?</Text>

                <View style={styles.featureCard}>
                    <View style={styles.featureIconBox}>
                        <Ionicons name="map-outline" size={24} color="#38bdf8" />
                    </View>
                    <View style={styles.featureText}>
                        <Text style={styles.featureTitle}>Live Map Tracking</Text>
                        <Text style={styles.featureDesc}>Admins can monitor employee locations and task distributions in real-time across the field.</Text>
                    </View>
                </View>

                <View style={styles.featureCard}>
                    <View style={styles.featureIconBox}>
                        <Ionicons name="shield-checkmark-outline" size={24} color="#34d399" />
                    </View>
                    <View style={styles.featureText}>
                        <Text style={styles.featureTitle}>Verified Evidence</Text>
                        <Text style={styles.featureDesc}>Employees can capture in-app photos as indisputable evidence of task completion or on-site issues.</Text>
                    </View>
                </View>

                <View style={styles.featureCard}>
                    <View style={styles.featureIconBox}>
                        <Ionicons name="people-outline" size={24} color="#f472b6" />
                    </View>
                    <View style={styles.featureText}>
                        <Text style={styles.featureTitle}>Client Portal</Text>
                        <Text style={styles.featureDesc}>Clients can easily submit complaints, track resolution progress, and stay updated seamlessly.</Text>
                    </View>
                </View>
            </Animated.View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    heroSection: {
        height: Dimensions.get('window').height * 0.85,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 1,
        marginBottom: 12,
    },
    tagline: {
        fontSize: 16,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 24,
    },
    actionContainer: {
        width: '100%',
        gap: 16,
    },
    button: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    primaryButton: {
        backgroundColor: '#6366f1',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    btnIcon: {
        marginLeft: 8,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    featuresSection: {
        paddingHorizontal: 32,
        paddingBottom: 60,
    },
    featuresHeading: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 24,
        textAlign: 'center',
    },
    featureCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        padding: 20,
        borderRadius: 16,
        marginBottom: 16,
    },
    featureIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 6,
    },
    featureDesc: {
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 20,
    },
});
