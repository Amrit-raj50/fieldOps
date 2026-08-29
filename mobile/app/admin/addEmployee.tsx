import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { addEmp } from '../../api/addEmp';
import {router} from 'expo-router';

export default function SignUp() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = async () => {
    if (!name || !email || !password) {
      Alert.alert(
        "error",
        "please fill all the fields"
      );

      return;
    }

    try {
      const result = await addEmp({
        name: name,
        email: email,
        password: password,
      });

      console.log("adding employee successful", result);

      Alert.alert(
        "Success",
        "employee added successfully."
      );

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("adding employee failed .", error);
    }
  }

  // console.log(API_URI);

  return (
    <View style={styles.con}>

      <Text style={styles.title}>Add Employee</Text>

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

      <View style={styles.button}>
        <Button
          title='add'
          onPress={handleAdd}
        />
      </View>
      {/* <View style={styles.button}>
        <Button
          title='log in'
          onPress={() => router.push("/")}
        />
      </View> */}

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