import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from 'react-native-google-signin';
import Colours from './Colours'

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const handleLogin = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // User has signed in successfully
                console.log('User logged in successfully!', userCredential.user);
            })
            .catch((error) => {
                console.log('Sign sign-in error:', error.message);
                Alert.alert('Sign-in error:', error.message);
            });
    };

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '880511116664-tkievcq6mktm9f7nlckhd0kf4t3eek4m.apps.googleusercontent.com', // Replace with your Web Client ID from Firebase
        });
    }, []);

    // Function to handle Google Sign-In
    const onGoogleSignIn = async () => {
        try {
            // Get the user's ID token
            const { idToken } = await GoogleSignin.signIn();

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign in with the Google credential
            await auth().signInWithCredential(googleCredential);
        } catch (error) {
            console.log('Sign sign-in error:', error.message);
            Alert.alert('Sign-in error:', error.message);
        }
    };

    const handleGuestLogin = async () => {
        try {
            const userCredential = await auth().signInAnonymously();
            console.log('User signed in anonymously:', userCredential.user.uid);
        } catch (error) {
            console.log('Sign sign-in error:', error.message);
            Alert.alert('Sign-in error:', error.message);
        }
    }

    const handleRegister = () => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // User has registered and signed in successfully
                const user = userCredential.user;
                if (user) {
                    user.updateProfile({
                        displayName: displayName,
                    });
                    console.log('User registered and logged in successfully!', user);
                }
            })
            .catch((error) => {
                console.log('Registration error:', error.message);
                Alert.alert('Registration error:', error.message);
            });
    };

    const [authMode, setAuthMode] = useState('register')
    const handleChangeAuthMode = () => {
        setAuthMode(authMode === 'register' ? 'login' : 'register');
    }

    return (
        <View behavior="padding" style={styles.container}>
            <Text style={styles.title}>{authMode === 'register' ? 'Register' : 'Login'}</Text>
            {authMode === 'register' && (
                <>
                    <Text style={styles.inputLabel}>Display Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter display name"
                        onChangeText={(text) => setDisplayName(text)}
                        value={displayName}
                        placeholderTextColor={Colours.text}
                    />
                </>
            )}
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter emaii"
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholderTextColor={Colours.text}
            />
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
                placeholderTextColor={Colours.text}
            />
            {authMode === 'register' ? (
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignIn}>
                <Text style={styles.buttonText}>Login with Google</Text>
            </TouchableOpacity>
            <View style={styles.hr} />
            <TouchableOpacity style={styles.continueAsGuestButton} onPress={handleGuestLogin}>
                <Text style={styles.buttonText}>Continue without an account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noAccountButton} onPress={handleChangeAuthMode}>
                <Text style={styles.buttonText}>{authMode === 'register' ? "Already have an account?" : "Don't have an account?"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background,
        padding: 10,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: Colours.text,
        marginVertical: 10,
    },
    input: {
        borderColor: Colours.primary,
        borderWidth: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: Colours.text,
    },
    button: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10,
    },
    googleButton: {
        backgroundColor: '#db4a39',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10,
    },
    noAccountButton: {
        backgroundColor: '#777',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputLabel: {
        color: Colours.text,
        marginBottom: 5,
    },
    continueAsGuestButton: {
        backgroundColor: Colours.accent,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 10,
    },
    hr: {
        borderColor: Colours.primary,
        borderWidth: 1,
        width: '100%',
        marginBottom: 10,
    },
});
