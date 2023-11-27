import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, UIManager, Platform } from 'react-native';
import LeftArrowSVG from '../images/LeftArrowSVG.svg';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

export default Accordion = ({ title, data, renderItem, onLongPress }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handlePress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(prevIsExpanded => !prevIsExpanded);
    };

    return (
        <View>
            <View style={[{
                borderBottomWidth: 1,
                borderBottomColor: 'hsla(0, 0%, 0%, 0.35)',
            }]}>
                <TouchableOpacity style={[{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginRight: 25
                }]}
                    onPress={handlePress}
                    onLongPress={onLongPress}
                >
                    <Text style={[{
                        fontSize: 16,
                        padding: 20,
                        fontFamily: 'Inter_700Bold',
                    }]}>
                        {title}
                    </Text>
                    <LeftArrowSVG style={{ transform: [{ rotateZ: isExpanded ? '270deg' : '0deg' }] }} />
                </TouchableOpacity>
            </View>
            <View style={{ height: isExpanded ? null : 0, overflow: 'hidden' }}>
                {data.map((item, index) => renderItem(item, index))}
            </View>
        </View>
    );
};