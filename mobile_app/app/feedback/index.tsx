import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

import BACKEND_URL from '@/contants';
const FEEDBACK_ENDPOINT = "/feedback/create";

export default function FeedbackPage() {
    const [feedbackText, setFeedbackText] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const router = useRouter();

    const handleSave = async () => {
        if (!feedbackText.trim()) {
            setMessage('Please enter your feedback.');
            setIsError(true);
            return;
        }

        setLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}${FEEDBACK_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ feedback: feedbackText }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Feedback sent successfully!');
                setIsError(false);
                setFeedbackText('');
                setTimeout(() => router.back(), 1500);
            } else {
                setMessage(data.message || 'Failed to send feedback.');
                setIsError(true);
            }
        } catch (err) {
            setMessage('Network error. Please try again.');
            setIsError(true);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Send Feedback</Text>
                </View>

                <View style={styles.content}>
                    <TextInput
                        style={styles.input}
                        placeholder="Tell us what you think..."
                        placeholderTextColor="#666"
                        value={feedbackText}
                        onChangeText={setFeedbackText}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />

                    {message ? (
                        <Text style={[styles.message, isError ? styles.error : styles.success]}>
                            {message}
                        </Text>
                    ) : null}

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.buttonText}>Submit Feedback</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 15,
        color: '#fff',
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#333',
        minHeight: 120,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
    },
    success: {
        color: '#4caf50',
    },
    error: {
        color: '#ff4444',
    },
});
