import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import Colours from './Colours'

export default function Settings() {

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{auth().currentUser.displayName || 'Anonymous'}</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colours.background,
        minHeight: '100%'
    },
    title: {
        color: Colours.primary,
        fontSize: 32,
        width: '100%',
        textAlign: 'center',
        marginTop: 10,
    },
    logoutButton: {
        backgroundColor: Colours.accent,
        margin: 10,
        padding: 10,
        borderRadius: 10
    },
    logoutButtonText: {
        color: Colours.text
    }
})