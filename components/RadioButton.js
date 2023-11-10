import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';


export default function RadioButton({ label, selected, onPress }) {
    return (
        <TouchableOpacity style={styles.radioButton} onPress={onPress}>
            <View style={styles.radioButtonCircle}>
                {selected && <View style={styles.innerCircle} />}
            </View>
            <Text>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    radioButtonCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerCircle: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#000',
    },
});