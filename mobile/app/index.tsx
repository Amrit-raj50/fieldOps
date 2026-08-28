import { View, Text, TextInput, Button ,StyleSheet,Alert} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { userLogin } from '../api/auth';
import AsyncStaorage from '@react-native-async-storage/async-storage';

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role , setRole] = useState("");

    const handleLogin = async() => {
        if(!email || !password || !role){
            Alert.alert(
                "error",
                "email or password is empty"
            )
        }

        try{
            const result = await userLogin({
                email : email,
                password : password,
                role : role,
            });

            await AsyncStaorage.setItem(
                "user",
                JSON.stringify(result.user)
            )

           

            console.log("login successful :",result);

            Alert.alert(
                "successful",
                "successfully login"
            )

             if(result.user.role === "admin"){
                router.replace("/admin/dashboard");
            }else{
                router.replace("/employee/task");
            }
            // router.push('/(tabs)/dashboard');

            setEmail("");
            setPassword("");
            setRole("");
        }catch(error){
            console.log("login failed :",error)
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

            <TextInput
                placeholder="role"
                value={role}
                onChangeText={setRole}
                secureTextEntry
            />

            {/* Login */}
            <Button
                title="Login"
                onPress={handleLogin}
            />

            {/* Signup */}
            <Button
                title="Signup"
                onPress={() => router.push("/signup")}
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