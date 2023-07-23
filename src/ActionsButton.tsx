import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import Colours from './Colours';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

function ActionsButton(): JSX.Element {
    const [isTapped, setIsTapped] = useState(false);
    const [containerHeight, setContainerHeight] = useState(100);

    const handleTap = () => {
        setIsTapped(!isTapped);
    };

    const handleCloseActions = () => {
        setIsTapped(false)
    }

    const HorizontalLine = () => {
        return <View style={styles.hr} />;
    };

    const navigation = useNavigation();

    const handleOpenMessages = () => {
        navigation.navigate('Messages');
    };

    useEffect(() => {
        if (isTapped) {
            setContainerHeight(250);
        } else {
            setContainerHeight(80);
        }
    }, [isTapped])

    return (
        <View style={[styles.container, { height: containerHeight }]}>
            <TouchableOpacity onPress={handleTap} style={styles.button} />
            {isTapped && (
                <View style={styles.actions}>
                    <MaterialCommunityIcons name={'message'} size={35} color={'black'} onPress={handleOpenMessages} />
                    <FontAwesome name={'search'} size={35} color={'black'} />
                    <FontAwesome name={'pencil'} size={35} color={'black'} />
                    <HorizontalLine />
                    <FontAwesome name={'close'} size={35} color={'black'} onPress={handleCloseActions} />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        width: 80,
        height: 80,
    },
    button: {
        backgroundColor: Colours.accent,
        width: '100%',
        height: '100%',
        borderRadius: 50,
        borderWidth: 5,
        borderColor: Colours.primary,
    },
    actions: {
        position: 'absolute',
        height: '90%',
        left: '50%',
        transform: [{ translateX: -17.5 }, { translateY: 12.5 }],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
    },
    hr: {
        borderColor: Colours.primary,
        borderWidth: 1,
        width: '80%',
        marginVertical: 10,
    },
});

export default ActionsButton;