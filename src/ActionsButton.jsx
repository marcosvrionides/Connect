import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function ActionsButton(): JSX.Element {
    const [isTapped, setIsTapped] = useState(false);

    const handleTap = () => {
        setIsTapped(!isTapped);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleTap}>
                <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
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
        borderWidth: 2,
        borderColor: 'black',
        backgroundColor: 'white'
    },
    plus: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 50,
        lineHeight: 60,
        color: 'black',
        opacity: 100
    }
});

export default ActionsButton;