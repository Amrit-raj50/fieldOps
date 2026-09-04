import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { userLogin } from '../api/auth';
import AsyncStaorage from '@react-native-async-storage/async-storage';

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");

    const checkLogin = async () => {
        try {
            const user = await AsyncStaorage.getItem("user");

            if (!user) {
                return;
            }

            const parsedUser = JSON.parse(user);

            if (parsedUser.role === 'admin') {
                router.replace("/admin/dashboard");
            } else if (parsedUser.role === 'employee') {
                router.replace("/employee/(tabs)");
            } else if (parsedUser.role === 'client') {
                router.replace("/clients/(tabs)");
            }

        } catch (error) {
            console.log("Error checking login : ", error);
        }
    }

    useEffect(() => {
        checkLogin();
    }, []);


    const handleLogin = async () => {
        if (!email || !password || !role) {
            Alert.alert(
                "error",
                "email or password is empty"
            )
        }

        try {
            const result = await userLogin({
                email: email,
                password: password,
                role: role,
            });

            await AsyncStaorage.setItem(
                "user",
                JSON.stringify(result.user)
            )

            console.log("login successful :", result);

            Alert.alert(
                "successful",
                "successfully login"
            )

            if (result.user.role === "admin") {
                router.replace("/admin/dashboard");
            } else if (result.user.role === "employee") {
                router.replace("/employee/(tabs)");
            } else if (result.user.role === "client") {
                router.replace("/clients/(tabs)");
            }


            setEmail("");
            setPassword("");
            setRole("");

        } catch (error) {
            console.log("login failed :", error)

            Alert.alert(
                "error",
                "Login failed check all fields!"
            )

            setEmail("");
            setPassword("");
            setRole("");
        }
    }

    return (
        <View style={styles.con}>

            <Text style={styles.title}>Log in</Text>

            {/* Email */}
            <TextInput
                style={styles.input}
                placeholder="email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            {/* Password */}
            <TextInput
                style={styles.input}
                placeholder="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Role */}
            <TextInput
                style={styles.input}
                placeholder="role"
                value={role}
                onChangeText={setRole}
                secureTextEntry
            />

            {/* Login */}
            <View style={styles.button}>
                <Button
                    title="Login"
                    onPress={handleLogin}
                />
            </View>

            {/* Signup */}
            <View style={styles.button}>
                <Button
                    title="Signup"
                    onPress={() => router.push("/signup")}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    con: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        margin: 'auto',
        padding: 25,
        justifyContent: 'center',
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
    },

    button: {
        marginTop: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },

});