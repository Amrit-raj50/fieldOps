import { Stack } from "expo-router";

export default function ClientLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}