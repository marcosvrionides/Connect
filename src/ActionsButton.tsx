import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, TouchableWithoutFeedback, Alert } from 'react-native';
import Colours from './Colours';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

function ActionsButton(): JSX.Element {
    const [isTapped, setIsTapped] = useState(false);
    const [containerHeight, setContainerHeight] = useState(80);

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
        if (auth().currentUser?.isAnonymous) {
            Alert.alert('Please log in to access messages')
        } else if (!auth().currentUser?.emailVerified) {
            Alert.alert('Please check your emails to verify your account to access messages.')
        } else {
            setIsTapped(false);
            navigation.navigate('Messages');
        }
    };

    const handleOpenSettings = () => {
        setIsTapped(false);
        navigation.navigate('Settings')
    }

    const handleNewPost = () => {
        if (auth().currentUser?.isAnonymous) {
            Alert.alert('Please log in to create a post')
        } else if (!auth().currentUser?.emailVerified) {
            Alert.alert('Please check your emails to verify your account to create posts.')
        } else {
            setIsTapped(false);
            navigation.navigate('NewPostForm')
        }
    }

    useEffect(() => {
        if (isTapped) {
            setContainerHeight(290);
        } else {
            setContainerHeight(80);
        }
    }, [isTapped])

    return (
        <View style={[styles.container, { height: containerHeight }]}>
            <TouchableOpacity onPress={handleTap} style={styles.button} />
            {isTapped && (
                <View style={styles.actions}>
                    <MaterialCommunityIcons name={'message'} size={35} color={Colours.text} onPress={handleOpenMessages} />
                    <FontAwesome name={'search'} size={35} color={Colours.text} />
                    <FontAwesome name={'pencil'} size={35} color={Colours.text} onPress={handleNewPost} />
                    <FontAwesome name={'gear'} size={35} color={Colours.text} onPress={handleOpenSettings} />
                    <HorizontalLine />
                    <FontAwesome name={'close'} size={35} color={Colours.text} onPress={handleCloseActions} />
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