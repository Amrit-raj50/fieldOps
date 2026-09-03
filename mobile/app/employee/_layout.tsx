import { Stack } from 'expo-router';

export default function EmployeeLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="(tabs)"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="task/[id]"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="task/evidence"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="task/cancel"
                options={{
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
        </Stack>
    );
}