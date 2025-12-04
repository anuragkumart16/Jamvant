import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import BACKEND_URL from '@/contants';

import { registerForPushNotificationsAsync } from '../../utils/notifications';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingEmail, setCheckingEmail] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        console.log(BACKEND_URL)
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            let pushToken = await SecureStore.getItemAsync('pushToken');
            console.log("Auth Submission - Push Token from Store:", pushToken); // DEBUG LOG

            if (!pushToken) {
                console.log("Push token not found in store, attempting to register again...");
                pushToken = await registerForPushNotificationsAsync();
                console.log("Auth Submission - Fresh Push Token:", pushToken);
            }

            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const response = await fetch(`${BACKEND_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, pushToken }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', data.message);
                if (data.token) {
                    await SecureStore.setItemAsync('authToken', data.token);
                    console.log('Token stored securely.');
                }
                router.replace('/dashboard');
            } else {
                setError(data.message || 'An error occurred');
            }
        } catch (err) {
            setError('Network request failed. Please check your connection.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckEmail = async () => {
        if (isLogin || !email || !email.includes('@')) return;

        setCheckingEmail(true);
        try {
            const response = await fetch(`${BACKEND_URL}/auth/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (!response.ok) {
                // If status is 400, it likely means email exists
                if (data.message === "Email already exists") {
                    setError("Email already exists. Please login instead.");
                } else {
                    setError(data.message);
                }
            } else {
                // Email is available
                setError('');
            }
        } catch (err) {
            console.error("Email check failed", err);
        } finally {
            setCheckingEmail(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Jamvant</Text>
                        <Text style={styles.subtitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.emailContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor="#666"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setError(''); // Clear error on type
                                    }}
                                    onBlur={handleCheckEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                {checkingEmail && (
                                    <ActivityIndicator size="small" color="#fff" style={styles.emailLoader} />
                                )}
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#666"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!isPasswordVisible}
                                />
                                <TouchableOpacity
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        {isLogin && (
                            <TouchableOpacity
                                style={styles.forgotPassword}
                                onPress={() => router.push('/auth/forgot-password')}
                            >
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={styles.buttonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.switchButton}
                            onPress={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setEmail('');
                                setPassword('');
                            }}
                        >
                            <Text style={styles.switchText}>
                                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark theme background
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 18,
        color: '#888',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        color: '#ccc',
        marginBottom: 8,
        fontSize: 16,
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    emailContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    emailLoader: {
        position: 'absolute',
        right: 15,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#333',
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        color: '#fff',
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    switchButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchText: {
        color: '#888',
        fontSize: 14,
    },
    errorText: {
        color: '#ff4444',
        textAlign: 'center',
        marginBottom: 10,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: '#888',
        fontSize: 14,
    },
});
