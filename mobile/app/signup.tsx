import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { userRegister } from '../api/auth';
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegistration = async () => {
    if (!name || !email || !password) {
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
      });

      console.log("user registration successful.", result);

      Alert.alert(
        "Success",
        "registration successful."
      );

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.log("registration failed .", error);
    }
  }
  // console.log(API_URI);
  return (
    <View style={styles.con}>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text>Sign UP Page</Text>
      <TextInput
        placeholder='Name'
        value={name}
        onChangeText={setName} />
      <TextInput
        placeholder='email'
        value={email}
        onChangeText={setEmail} />
      <TextInput
        placeholder='password'
        value={password}
        onChangeText={setPassword} />

      <Button
        title='sign up'
        onPress={handleRegistration} />

    </View>
  )
}

const styles = StyleSheet.create({
  con: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    margin: 'auto'
  }
})