import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1); // 1: Request Token, 2: Reset Password
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const router = useRouter();

    const handleRequestToken = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', data.message);
                setStep(2);
            } else {
                Alert.alert('Error', data.message || 'Failed to send reset token');
            }
        } catch (error) {
            Alert.alert('Error', 'Network request failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!token || !newPassword) {
            Alert.alert('Error', 'Please enter the token and new password');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password reset successfully. Please login.');
                router.replace('/auth');
            } else {
                Alert.alert('Error', data.message || 'Failed to reset password');
            }
        } catch (error) {
            Alert.alert('Error', 'Network request failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        {step === 1 ? "Enter your email to receive a reset token" : "Enter the token and your new password"}
                    </Text>
                </View>

                <View style={styles.form}>
                    {step === 1 ? (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#666"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    ) : (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Reset Token</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter reset token"
                                    placeholderTextColor="#666"
                                    value={token}
                                    onChangeText={setToken}
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>New Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.passwordInput}
                                        placeholder="Enter new password"
                                        placeholderTextColor="#666"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
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
                        </>
                    )}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={step === 1 ? handleRequestToken : handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {step === 1 ? "Send Reset Token" : "Reset Password"}
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => {
                            if (step === 2) setStep(1);
                            else router.back();
                        }}
                    >
                        <Text style={styles.backText}>
                            {step === 2 ? "Back to Email" : "Back to Login"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
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
    backButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    backText: {
        color: '#888',
        fontSize: 14,
    },
});
