import { Text as RNText, StyleSheet } from 'react-native';

export const Text = props => {
    const style = StyleSheet.compose({}, [props?.style, { fontFamily: 'Inter_400Regular' }]);
    return (
        <RNText {...props} style={style}>{props?.children}</RNText>
    );
};