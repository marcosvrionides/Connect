import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import Colours from './Colours'
import { useNavigation } from '@react-navigation/native';

export default function Settings() {

    const navigation = useNavigation();

    const handleLogout = () => {
        auth()
            .signOut()
            .then(() => {
                console.log('User logged out successfully!');
            })
            .catch((error) => {
                console.log('Error occurred while logging out:', error);
            });
    };

    const handleOpenProfile = () => {
        if (auth().currentUser?.isAnonymous) {
            Alert.alert('Please log in to access profile')
        } else {
            navigation.navigate('Profile', {uid: auth().currentUser.uid});
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{auth().currentUser.displayName || 'Anonymous'}</Text>
            <TouchableOpacity style={styles.button} onPress={handleOpenProfile}>
                <Text style={styles.buttonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logOutButton} onPress={handleLogout}>
                <Text style={styles.logOutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background,
        minHeight: '100%',
        padding: 10
    },
    title: {
        color: Colours.primary,
        fontSize: 32,
        width: '100%',
        textAlign: 'center',
        marginVertical: 10,
    },
    button: {
        backgroundColor: Colours.accent,
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        height: 50,
    },
    logOutButton: {
        backgroundColor: 'red',
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        height: 50,
    },
    buttonText: {
        color: Colours.text,
        lineHeight: 30,
        fontSize: 16,
    },
    logOutButtonText: {
        color: 'black',
        lineHeight: 30,
        fontSize: 16,
    },
})