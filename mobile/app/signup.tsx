import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { userRegister } from '../api/auth';
import { router } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export default function SignUp() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegistration = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert(
        "error",
        "please fill all the fields"
      );

      return;
    }

    try {
      const result = await userRegister({
        name: name,
        email: email,
        password: password,
        role: role,
      });

      console.log("user registration successful.", result);

      Alert.alert(
        "Success",
        "registration successful."
      );

      setName("");
      setEmail("");
      setPassword("");
      setRole("");
    } catch (error) {
      console.log("registration failed .", error);
    }
  }

  // console.log(API_URI);

  return (
    <View style={styles.con}>

      <Text style={styles.title}>Sign UP Page</Text>

      <TextInput
        style={styles.input}
        placeholder='Name'
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder='email'
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder='password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => {
          setRole(itemValue)
        }}>
        <Picker.Item
          label="select your role"
          value=""
        />
        <Picker.Item
          label='admin'
          value='Admin'
        />
        <Picker.Item
          label="employee"
          value="Employee" />
        <Picker.Item
          label="client"
          value="Client" />

      </Picker>

      <View style={styles.button}>
        <Button
          title='sign up'
          onPress={handleRegistration}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Login"
          onPress={() => router.push('/login')}
        />
      </View>

    </View>
  )
}

const styles = StyleSheet.create({

  con: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
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