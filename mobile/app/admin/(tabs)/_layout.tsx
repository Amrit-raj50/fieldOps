import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function AdminTabsLayout() {
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
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="employee"
                options={{
                    title: 'Employees',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="taskList"
                options={{
                    title: 'Tasks',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="complaints"
                options={{
                    title: 'Complaints',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="alert-circle-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="trackUser"
                options={{
                    title: 'Track',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="map-outline" size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="addEmployee"
                options={{
                    title: 'Add Emp',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-add-outline" size={size} color={color} />
                    ),
                }}
            />

            {/* Hidden from tab bar — navigated to programmatically after accepting a complaint */}
            <Tabs.Screen
                name="createTask"
                options={{
                    href: null,
                    title: 'Create Task',
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}