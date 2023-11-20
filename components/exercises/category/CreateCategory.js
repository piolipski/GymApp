import { View, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Text } from '../../Text.js';
import { TextInput } from 'react-native-gesture-handler';
import { useState } from 'react';
import { setItem, getItem } from '../../database/DataStorage.js';

export default function CreateCategory({ setModalOpen, refreshCategories }) {
    const [categoryName, setCategoryName] = useState('');

    const saveCategory = async () => {
        // might need to rewrite it, but it works for now :)
        if (categoryName.trim() === '') {
            alert('Category name cannot be empty');
            return;
        }

        const capitalizedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        const categoryArray = await getItem(['key', 'category']) || [];

        if (categoryArray.includes(capitalizedCategoryName)) {
            alert('Category already exists');
            return;
        }

        categoryArray.push(capitalizedCategoryName);
        await setItem(['key', 'category'], categoryArray);
        setModalOpen(false);
        refreshCategories();
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
                <Text style={[{ fontSize: 18, }]}>Create Category</Text>
            </View>
            <View>
                <TextInput style={[{
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
                    onPress={saveCategory}
                >
                    <Text style={[{
                        textAlign: 'center',
                        color: 'white',
                        backgroundColor: '#006EE6',
                        fontSize: 16,
                        padding: 15,
                        borderBottomLeftRadius: 6,
                        borderBottomRightRadius: 6,
                    }]}>
                        Create
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
});