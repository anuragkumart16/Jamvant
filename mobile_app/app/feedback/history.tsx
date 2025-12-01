import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const BACKEND_URL = "https://next-evaluating-poll-adds.trycloudflare.com";

interface FeedbackItem {
    id: string;
    feedback: string;
    createdAt?: string;
}

export default function FeedbackHistoryPage() {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const router = useRouter();

    const fetchFeedback = async (pageNum = 1, shouldRefresh = false) => {
        if (loading) return;
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/feedback?page=${pageNum}&limit=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                const newItems = data.data || [];
                if (shouldRefresh) {
                    setFeedbacks(newItems);
                } else {
                    setFeedbacks(prev => [...prev, ...newItems]);
                }
                setHasMore(newItems.length === 10);
                setPage(pageNum);
            }
        } catch (error) {
            console.error("Error fetching feedback", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFeedback(1, true);
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFeedback(1, true);
    }, []);

    const loadMore = () => {
        if (hasMore && !loading) {
            fetchFeedback(page + 1);
        }
    };

    const renderItem = ({ item }: { item: FeedbackItem }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>{item.feedback}</Text>
            {/* <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text> */}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Feedback History</Text>
            </View>

            <FlatList
                data={feedbacks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && !refreshing ? <ActivityIndicator color="#fff" /> : null}
                ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No feedback submitted yet.</Text> : null}
            />
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    list: {
        padding: 20,
    },
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#333',
    },
    cardText: {
        color: '#fff',
        fontSize: 16,
    },
    date: {
        color: '#666',
        fontSize: 12,
        marginTop: 10,
        textAlign: 'right',
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
});
