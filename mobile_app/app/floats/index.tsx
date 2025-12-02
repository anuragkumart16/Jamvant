import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

import BACKEND_URL from '@/contants';

interface FloatItem {
    id: string;
    text: string;
    userID: string;
}

import FilterSortBar from '../../components/FilterSortBar';

export default function FloatsListPage() {
    const [floats, setFloats] = useState<FloatItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filter State
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'createdAt',
        order: 'desc',
        startDate: undefined,
        endDate: undefined,
    });

    // Edit Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [currentFloat, setCurrentFloat] = useState<FloatItem | null>(null);
    const [editText, setEditText] = useState('');
    const [updating, setUpdating] = useState(false);

    const router = useRouter();

    const fetchFloats = async (pageNum = 1, shouldRefresh = false, currentFilters = filters) => {
        if (loading) return;
        setLoading(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            let url = `${BACKEND_URL}/floats/get?page=${pageNum}&limit=10`;

            if (currentFilters.search) url += `&search=${encodeURIComponent(currentFilters.search)}`;
            if (currentFilters.sortBy) url += `&sortBy=${currentFilters.sortBy}`;
            if (currentFilters.order) url += `&order=${currentFilters.order}`;
            if (currentFilters.startDate) url += `&startDate=${currentFilters.startDate}`;
            if (currentFilters.endDate) url += `&endDate=${currentFilters.endDate}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();

            if (response.ok) {
                const newItems = data.data || [];
                if (shouldRefresh) {
                    setFloats(newItems);
                } else {
                    setFloats(prev => [...prev, ...newItems]);
                }
                setHasMore(newItems.length === 10);
                setPage(pageNum);
            }
        } catch (error) {
            console.error("Error fetching floats", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFloats(1, true);
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchFloats(1, true);
    }, [filters]);

    const loadMore = () => {
        if (hasMore && !loading) {
            fetchFloats(page + 1);
        }
    };

    const handleApplyFilters = (newFilters: any) => {
        setFilters(newFilters);
        fetchFloats(1, true, newFilters);
    };

    const handleDelete = async (id: string) => {
        Alert.alert(
            "Delete Float",
            "Are you sure you want to delete this float?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const token = await SecureStore.getItemAsync('authToken');
                            const response = await fetch(`${BACKEND_URL}/floats/delete/${id}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (response.ok) {
                                setFloats(prev => prev.filter(item => item.id !== id));
                            } else {
                                Alert.alert("Error", "Failed to delete float");
                            }
                        } catch (error) {
                            Alert.alert("Error", "Network error");
                        }
                    }
                }
            ]
        );
    };

    const openEditModal = (item: FloatItem) => {
        setCurrentFloat(item);
        setEditText(item.text);
        setModalVisible(true);
    };

    const handleUpdate = async () => {
        if (!editText.trim() || !currentFloat) return;
        setUpdating(true);
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const response = await fetch(`${BACKEND_URL}/floats/update/${currentFloat.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: editText })
            });

            if (response.ok) {
                setFloats(prev => prev.map(item =>
                    item.id === currentFloat.id ? { ...item, text: editText } : item
                ));
                setModalVisible(false);
            } else {
                Alert.alert("Error", "Failed to update float");
            }
        } catch (error) {
            Alert.alert("Error", "Network error");
        } finally {
            setUpdating(false);
        }
    };

    const renderItem = ({ item }: { item: FloatItem }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>{item.text}</Text>
            <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openEditModal(item)} style={styles.actionButton}>
                    <Ionicons name="pencil" size={20} color="#4caf50" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionButton}>
                    <Ionicons name="trash" size={20} color="#ff4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>My Floats</Text>
            </View>

            <FilterSortBar onApply={handleApplyFilters} />

            <FlatList
                data={floats}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading && !refreshing ? <ActivityIndicator color="#fff" /> : null}
                ListEmptyComponent={!loading ? <Text style={styles.emptyText}>No floats yet. Create one!</Text> : null}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Float</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={editText}
                            onChangeText={setEditText}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleUpdate}
                                disabled={updating}
                            >
                                {updating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
        marginBottom: 10,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 10,
    },
    actionButton: {
        marginLeft: 15,
        padding: 5,
    },
    emptyText: {
        color: '#888',
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        backgroundColor: '#000',
        borderRadius: 8,
        padding: 15,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#333',
    },
    saveButton: {
        backgroundColor: '#4caf50',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
