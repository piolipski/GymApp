import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { getItem } from '../../database/DataStorage.js';

export default function ChangeEmail() {

    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (stringEmail) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(stringEmail);
    };

    const handleChangeEmail = async () => {
        if (password.trim() === '' || newEmail.trim() === '' || !validateEmail(newEmail)) {
            setError('Please fill in valid password and email!');
            return;
        }

        try {
            const token = await getItem(['key', 'token']);
            const response = await fetch('http://10.0.2.2:3000/changeEmail', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ password: password, newEmail: newEmail }),
            });
            const data = await response.json();

            console.log(data);

            if (response.ok) {
                Alert.alert(data.message);
                setError('');
                setPassword('');
                setNewEmail('');
            } else if (data.code === 400) {
                setError(data.message);
            } else if (data.code === 409) {
                setError(data.message);
            }
        } catch (error) {
            console.error('Error:', error);

        };

    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="New Email"
                value={newEmail}
                onChangeText={(text) => setNewEmail(text)}
            />
            {error.length > 1 ? (<Text style={{ fontSize: 16, color: 'red', padding: 5, textAlign: 'center' }}>{error}</Text>) : (<></>)}
            <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
                <Text style={styles.buttonText}>Change Email</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    input: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize: 16,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
});
