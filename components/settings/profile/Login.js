import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet,Alert } from 'react-native';
import { Text } from '../../Text.js';
import { useNavigation } from '@react-navigation/native';
import { setItem } from '../../database/DataStorage.js';

export default function Login() {

    const navigation = useNavigation();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    const validateEmail = (stringEmail) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(stringEmail);
    };

    const handleSignIn = async () => {
        if(password.trim() === '' || email.trim() === '' || !validateEmail(email)){
            setError('Please enter valid email and password');
            return;
        }
        try {
            const response = await fetch('http://10.0.2.2:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });
            const data = await response.json();
            console.log(data);
            console.log(response.ok)

            if (response.ok) {
                Alert.alert('Logged in successfully!');
                console.log(data.token);
                setItem(['token','key'],data.token);
                setError('');
            } else if (data.code === 404) {
                setError("Wrong email or password");
            }
        } catch (error) {
            console.error('Error:', error);
        }
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
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
            <Button title="Sign In" onPress={handleSignIn} />
            <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
                Don't have an account? Register
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
    registerText: {
        marginTop: 16,
        color: 'blue',
    },
});