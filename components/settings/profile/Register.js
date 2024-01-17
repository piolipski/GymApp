import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,Alert } from 'react-native';
import { Text } from '../../Text.js';
import { useNavigation } from '@react-navigation/native';

export default function Register() {

    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const validateEmail = (stringEmail) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(stringEmail);
    };

    const handleSignUp = async () => {
        if(password.trim() === '' || email.trim() === '' || !validateEmail(email)){
            setError('Please enter valid email and password');
            return;
        }
        try {
            const response = await fetch('http://10.0.2.2:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Registered successfully!');
                setError('');
              } else if (data.statusCode === 400) {
                setError("Account with this email is already registered")
              }
        } catch (error) {
            console.error('Error:', error);
        }
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
            {error.length > 1 ? (<Text style={{fontSize:16, color:'red', padding: 5}}>{error}</Text>) : (<></>)}
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