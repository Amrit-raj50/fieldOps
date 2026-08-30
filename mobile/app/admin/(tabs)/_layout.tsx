import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{ title: "Dashboard" }}
            />

            <Tabs.Screen
                name="employee"
                options={{ title: "Employees" }}
            />

            <Tabs.Screen
                name="taskList"
                options={{ title: "Tasks" }}
            />

            <Tabs.Screen
                name="createTask"
                options={{ title: "Create Task" }}
            />

            <Tabs.Screen
                name="trackUser"
                options={{ title: "Track" }}
            />

            <Tabs.Screen
                name="addEmployee"
                options={{ title: "Add Employee" }}
            />
        </Tabs>
    );
}