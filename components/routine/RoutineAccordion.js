import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '../Text.js';

export default RoutineAccordion = ({ title, data, onLongPress, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View style={[{
            margin: 10,

        }]}>
            <View style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'white',
                borderWidth: 0.5,
                borderColor: 'hsla(0, 0%, 0%, 0.35)',
                borderRadius: 5,
            },
            isOpen && {
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            }]}>
                <TouchableOpacity
                    style={[{ flex: 1, borderRadius: 5, }]}
                    onPress={() => setIsOpen(!isOpen)}
                    onLongPress={onLongPress}>
                    <Text style={[{
                        padding: 20,
                        fontFamily: 'Inter_700Bold',
                        fontSize: 16,
                    }]}>
                        {title}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onSelect}>
                    <Text style={[{
                        color: '#006EE6',
                        padding: 20,
                        fontFamily: 'Inter_700Bold',
                    }]}>Select</Text>
                </TouchableOpacity>
            </View>
            <View style={[{
                backgroundColor: 'lightgray',
            }, isOpen && {
                borderLeftWidth: 0.5,
                borderBottomWidth: 0.5,
                borderRightWidth: 0.5,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                borderColor: 'hsla(0, 0%, 0%, 0.35)',
            }]}>
                {isOpen && data.map((item, index) => (
                    <View key={index} style={{ padding: 10 }}>
                        <Text>{item.name}</Text>
                    </View>
                ))}
                {isOpen && (
                    <View style={{ height: 40, borderColor: 'gray', borderTopWidth: 1 }}>
                        <TextInput
                            multiline={true}
                            style={{ padding: 10 }}
                            placeholder="Add a comment"
                        />
                    </View>
                )}
            </View>
        </View>
    );
};