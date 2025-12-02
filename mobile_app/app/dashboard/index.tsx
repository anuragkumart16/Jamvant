import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await SecureStore.deleteItemAsync('authToken');
                        router.replace('/auth');
                    }
                }
            ]
        );
    };

    const menuItems = [
        {
            title: "Create Float",
            icon: "add-circle-outline",
            route: "/create-float",
            color: "#4caf50"
        },
        {
            title: "My Floats",
            icon: "list-outline",
            route: "/floats",
            color: "#2196f3"
        },
        {
            title: "Send Feedback",
            icon: "chatbubble-ellipses-outline",
            route: "/feedback",
            color: "#ff9800"
        },
        {
            title: "Feedback History",
            icon: "time-outline",
            route: "/feedback/history",
            color: "#9c27b0"
        }
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#ff4444" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.welcomeSection}>
                    <Text style={styles.welcomeText}>Welcome back!</Text>
                    <Text style={styles.subtitle}>What would you like to do today?</Text>
                </View>

                <View style={styles.grid}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            onPress={() => router.push(item.route as any)}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                                <Ionicons name={item.icon as any} size={32} color={item.color} />
                            </View>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
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
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
    },
    logoutButton: {
        padding: 10,
    },
    content: {
        padding: 20,
    },
    welcomeSection: {
        marginBottom: 30,
    },
    welcomeText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: '600',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        padding: 15,
        borderRadius: 50,
        marginBottom: 15,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});