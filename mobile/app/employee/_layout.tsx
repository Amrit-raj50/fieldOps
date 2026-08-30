import { Tabs } from "expo-router";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={
        { headerShown: false }
      }>
      <Tabs.Screen
        name="task"
        options={{
          title: "task",
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "map",
        }}
      />

      
    </Tabs>
  );
}