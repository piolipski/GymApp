import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { Text } from '../../Text.js';
import { useNavigation } from '@react-navigation/native';

export default function Register() {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = () => {
        // Implement your sign-up logic here
        console.log('Sign Up:', email, password);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
                Already have an account? Log in
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
    },
    input: {
        height: 40,
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
    },
    loginText: {
        marginTop: 16,
        color: 'blue',
    },
});