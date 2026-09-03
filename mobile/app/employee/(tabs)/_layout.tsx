import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EmployeeTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#4f46e5',
                tabBarInactiveTintColor: '#64748b',
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopColor: '#e2e8f0',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="assignedTask"
                options={{
                    title: 'Assigned',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="file-tray-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="myTask"
                options={{
                    title: 'My Tasks',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
