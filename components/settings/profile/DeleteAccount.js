import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getItem, setItem } from '../../database/DataStorage.js';

export default function DeleteAccount() {

    const navigation = useNavigation();

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');


    const handleDeleteAccount = () => {

        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete your account?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            const token = await getItem(['key', 'token']);
                            const response = await fetch('http://10.0.2.2:3000/deleteAccount', {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: JSON.stringify({ password: password}),
                            });
                            const data = await response.json();

                            console.log(data);

                            if (response.ok) {
                                await setItem(['key','token'], 'logout');
                                Alert.alert(data.message);
                                navigation.navigate('Profile');
                                
                            } else if (data.code === 400) {
                                setError(data.message);
                            }
                        } catch (error) {
                            console.error('Error:', error);

                        };

                    },
                    style: 'destructive'
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            {error.length > 1 ? (<Text style={{ fontSize: 16, color: 'red', padding: 5, textAlign: 'center' }}>{error}</Text>) : (<></>)}

            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
                <Text style={styles.buttonText}>Delete My Account</Text>
            </TouchableOpacity>
        </View>
    );
};

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
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center'
    },
});

