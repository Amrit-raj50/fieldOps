import { Tabs } from "expo-router";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={
        { headerShown: false }
      }>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="employee"
        options={{
          title: "Employees",
        }}
      />

      <Tabs.Screen
        name="taskList"
        options={{
          title: "Tasks",
        }}
      />

      <Tabs.Screen
        name="task"
        options={{
          title: "Create Task",
        }}
      />

      <Tabs.Screen
        name="[task_id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}