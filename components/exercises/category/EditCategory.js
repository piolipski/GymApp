import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Text } from '../../Text';

export default function EditCategory({ handleEditCategory, handleDeleteCategory, initialCategoryName, setEditModalOpen }) {
    const [categoryName, setCategoryName] = useState(initialCategoryName);

    const handleSave = async () => {
        await handleEditCategory(categoryName);
        setEditModalOpen(false);
    };

    const handleDelete = async () => {
        await handleDeleteCategory(categoryName);
        setEditModalOpen(false);
    }

    return (
        <View style={[{
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            borderRadius: 6,
        }]}>
            <View style={[
                {
                    borderBottomWidth: 0.5,
                    padding: 10
                }]}>
                <Text style={[{ fontSize: 18, }]}>Edit Category</Text>
            </View>
            <View>
                <TextInput
                    style={[{
                        padding: 10,
                        width: 280,
                        height: 60,
                        borderBottomWidth: 1,
                        borderColor: 'gray',
                        fontSize: 16,
                    }]}
                    placeholder='Category Name'
                    placeholderTextColor={'gray'}
                    value={categoryName}
                    onChangeText={text => setCategoryName(text)}
                />
            </View>
            <View style={[{
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                flexDirection: 'row',
            }]}>
                <Pressable style={[{ flex: 1 }]}
                    onPress={handleSave}
                >
                    <Text style={[{
                        textAlign: 'center',
                        color: 'white',
                        borderBottomLeftRadius: 6,
                        backgroundColor: '#006EE6',
                        fontSize: 16,
                        padding: 15,
                    }]}>
                        Edit
                    </Text>
                </Pressable>
                <Pressable style={[{ flex: 1 }]}
                    onPress={handleDelete}
                >
                    <Text style={[{
                        textAlign: 'center',
                        borderBottomRightRadius: 6,
                        color: 'white',
                        backgroundColor: 'red',
                        fontSize: 16,
                        padding: 15,
                    }]}>
                        Delete
                    </Text>
                </Pressable>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
});