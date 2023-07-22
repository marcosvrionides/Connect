import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colours from './Colours';

function ActionsButton(): JSX.Element {
    const [isTapped, setIsTapped] = useState(false);

    const handleTap = () => {
        setIsTapped(!isTapped);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity  onPress={handleTap} style={styles.button} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 60,
        height: 60,
        borderRadius: 50,
    },
    button: {
        backgroundColor: Colours.accent,
        width: '100%',
        height: '100%',
        borderRadius: 50,
        borderWidth: 5,
        borderColor: Colours.primary,
    },
});

export default ActionsButton;