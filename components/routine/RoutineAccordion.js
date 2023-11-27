import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '../Text.js';

export default RoutineAccordion = ({ title, data, onLongPress, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View>
            <View style={[{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
            }]}>
                <TouchableOpacity
                    style={[{ flex: 1 }]}
                    onPress={() => setIsOpen(!isOpen)}
                    onLongPress={onLongPress}>
                    <Text style={[{
                        padding: 10,
                        fontWeight: 'bold',
                        fontSize: 16,
                    }]}>
                        {title}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSelect}>
                    <Text style={[{ color: '#006EE6', padding: 10 }]}>Select</Text>
                </TouchableOpacity>
            </View>
            {isOpen && data.map((item, index) => (
                <View key={index} style={[{
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#eee',
                }]}>
                    <Text>{item.name}</Text>
                </View>
            ))}
        </View>
    );
};