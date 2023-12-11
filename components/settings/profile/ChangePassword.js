import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { getItem } from '../../database/DataStorage.js';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async () => {
        if (newPassword.trim() === '' || currentPassword.trim() === '') {
            setError('Please fill in valid passwords!');
            return;
        }
        if (newPassword === confirmNewPassword) {
            try {
                const token = await getItem(['key', 'token']);
                const response = await fetch('http://10.0.2.2:3000/changePassword', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ newPassword: newPassword, oldPassword: currentPassword }),
                });
                const data = await response.json();
                console.log(data);
                console.log(response.ok)

                if (response.ok) {
                    Alert.alert('Password changed!');
                    setError('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setCurrentPassword('');
                } else if (data.code === 400) {
                    setError(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setError('Typed passwords do not match!');
            return;
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry={true}
                value={currentPassword}
                onChangeText={(text) => setCurrentPassword(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry={true}
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry={true}
                value={confirmNewPassword}
                onChangeText={(text) => setConfirmNewPassword(text)}
            />
            {error.length > 1 ? (<Text style={{ fontSize: 16, color: 'red', padding: 5, textAlign: 'center' }}>{error}</Text>) : (<></>)}
            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
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
