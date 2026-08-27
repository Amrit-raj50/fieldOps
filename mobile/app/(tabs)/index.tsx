import { View, Text, TextInput, Button ,StyleSheet} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={styles.con}>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>
            <Text></Text>

            <Text>Log in</Text>

            {/* Email */}
            <TextInput
                placeholder="email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            {/* Password */}
            <TextInput
                placeholder="password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {/* Login */}
            <Button
                title="Login"
                // onPress={handleLogin}
            />

            {/* Signup */}
            <Button
                title="Signup"
                onPress={() => router.push("/(tabs)/signup")}
            />

        </View>
    );
}

const styles = StyleSheet.create({
  con: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    margin: 'auto'
  }
})