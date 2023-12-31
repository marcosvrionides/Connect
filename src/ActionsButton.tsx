import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Colours from './Colours';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

function ActionsButton(): JSX.Element {
    const [isTapped, setIsTapped] = useState(false);
    const height = useSharedValue(80)

    const handleTap = () => {
        height.value = withSpring(260)
        setTimeout(() => {
            setIsTapped(!isTapped);
        }, 250)
        
    };

    const handleCloseActions = () => {
        height.value = withSpring(80)
        setIsTapped(false)
    }

    const navigation = useNavigation();

    const handleOpenMessages = () => {
        handleCloseActions();
        navigation.navigate('Messages');
    };

    const handleOpenSettings = () => {
        handleCloseActions();
        navigation.navigate('Settings')
    }

    const handleNewPost = () => {
        handleCloseActions();
        navigation.navigate('NewPostForm')
    }

    return (
        <Animated.View
            style={[styles.container, { height }]}>
            <TouchableOpacity onPress={handleTap} style={styles.button} />
            {isTapped && (
                <View style={styles.actions}>
                    <MaterialCommunityIcons name={'message'} size={35} color={Colours.text} onPress={handleOpenMessages} />
                    <FontAwesome name={'plus'} size={35} color={Colours.text} onPress={handleNewPost} />
                    <FontAwesome name={'gear'} size={35} color={Colours.text} onPress={handleOpenSettings} />
                    <View style={styles.hr} />
                    <FontAwesome name={'close'} size={35} color={Colours.text} onPress={handleCloseActions} />
                </View>
            )}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        width: 80,
        height: 80,
        borderWidth: 5,
        borderColor: 'white',
        borderRadius: 50
    },
    button: {
        backgroundColor: Colours.background,
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