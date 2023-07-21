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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 60,
        height: 60,
        backgroundColor: 'white',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'black',
    },
    plus: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 50,
        lineHeight: 60,
    }
});

export default ActionsButton;