import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';
import { registerForPushNotificationsAsync } from '../../utils/notifications';
import BACKEND_URL from '@/contants';

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSyncPushToken = async () => {
        setLoading(true);
        try {
            // 1. Get new token
            const token = await registerForPushNotificationsAsync();

            if (!token) {
                Alert.alert("Error", "Failed to generate push token. Please check permissions.");
                return;
            }

            // 2. Get auth token
            const authToken = await SecureStore.getItemAsync('authToken');
            if (!authToken) {
                Alert.alert("Error", "You are not logged in.");
                router.replace('/auth');
                return;
            }

            // 3. Send to backend
            const response = await fetch(`${BACKEND_URL}/auth/update-push-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ pushToken: token }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert("Success", "Push token generated and synced successfully!");
            } else {
                Alert.alert("Error", data.message || "Failed to sync token with server.");
            }

        } catch (error) {
            console.error("Sync error:", error);
            Alert.alert("Error", "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Push Notifications</Text>
                    <Text style={styles.description}>
                        If you are not receiving notifications, try regenerating your push token. This will sync your device with our server.
                    </Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleSyncPushToken}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <>
                                <Ionicons name="notifications-outline" size={24} color="#000" style={styles.btnIcon} />
                                <Text style={styles.btnText}>Generate & Sync Push Token</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#1a1a1a',
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    content: {
        padding: 20,
    },
    section: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    description: {
        color: '#888',
        marginBottom: 20,
        lineHeight: 20,
    },
    actionButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        borderRadius: 8,
    },
    btnIcon: {
        marginRight: 10,
    },
    btnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
