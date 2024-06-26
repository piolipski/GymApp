import { Text as RNText, StyleSheet } from 'react-native';

export const Text = props => {
    const style = StyleSheet.compose({ fontFamily: 'Inter_400Regular' }, [props?.style,]);
    return (
        <RNText {...props} style={style} numberOfLines={props.numberOfLines} onLayout={props.onLayout}>
            {props?.children}
        </RNText>
    );
};