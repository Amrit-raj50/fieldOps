import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="signup"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="(admin)"
                options={{
                    headerShown: false,
                }}
            />

            <Stack.Screen
                name="(employee)"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    );
}