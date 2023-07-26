import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from 'react-native-google-signin';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // User has signed in successfully
                console.log('User logged in successfully!', userCredential.user);
            })
            .catch((error) => {
                console.log('Error occurred while logging in:', error);
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
            console.log('Google sign-in error:', error.message);
        }
    };

    const handleGuestLogin = async () => {
        try {
            const userCredential = await auth().signInAnonymously();
            console.log('User signed in anonymously:', userCredential.user.uid);
        } catch (error) {
            console.error('Anonymous sign-in error:', error);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                value={password}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignIn}>
                <Text style={styles.buttonText}>Login with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin}>
                <Text style={styles.buttonText}>Continue without an account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Add a light background color
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#333', // Add a dark text color
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5, // Add rounded corners to the input fields
        backgroundColor: '#fff', // Add a white background color
    },
    button: {
        backgroundColor: '#007bff', // Use Bootstrap's primary blue color
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 15,
    },
    googleButton: {
        backgroundColor: '#db4a39', // Use a red color for Google sign-in
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 15,
    },
    guestButton: {
        backgroundColor: '#777', // Use a dark gray color for guest login
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 5,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff', // Use white text color for buttons
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
