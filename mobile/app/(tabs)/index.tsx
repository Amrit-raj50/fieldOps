import { View, Text, Button, TextInput ,StyleSheet} from 'react-native';
import { useState } from 'react';
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        onPress={() => {
          setName("");
          setEmail("");
          setPassword("");
        }}/>

    </View>
  )
}

const styles = StyleSheet.create({
  con:{
    width:'100%',
    height:'100%',
    backgroundColor:'#fff',
    margin:'auto'
  }
})