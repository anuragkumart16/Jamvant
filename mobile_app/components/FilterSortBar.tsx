import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FilterSortBarProps {
    onApply: (filters: any) => void;
    initialSortBy?: string;
    initialOrder?: 'asc' | 'desc';
}

export default function FilterSortBar({ onApply, initialSortBy = 'createdAt', initialOrder = 'desc' }: FilterSortBarProps) {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [order, setOrder] = useState<'asc' | 'desc'>(initialOrder);
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const [showFilters, setShowFilters] = useState(false);

    // Date Picker State
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const handleApply = () => {
        onApply({
            search,
            sortBy,
            order,
            startDate: startDate ? startDate.toISOString() : undefined,
            endDate: endDate ? endDate.toISOString() : undefined,
        });
        setShowFilters(false);
    };

    const toggleOrder = () => {
        setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    const clearFilters = () => {
        setSearch('');
        setSortBy('createdAt');
        setOrder('desc');
        setStartDate(undefined);
        setEndDate(undefined);
        onApply({ sortBy: 'createdAt', order: 'desc' });
        setShowFilters(false);
    };

    const onStartDateChange = (event: any, selectedDate?: Date) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const onEndDateChange = (event: any, selectedDate?: Date) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search..."
                        placeholderTextColor="#888"
                        value={search}
                        onChangeText={setSearch}
                        onSubmitEditing={handleApply}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
                    <Ionicons name="options" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={showFilters}
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filter & Sort</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <Ionicons name="close" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Sort Order</Text>
                            <TouchableOpacity style={styles.row} onPress={toggleOrder}>
                                <Text style={styles.label}>Date Created</Text>
                                <View style={styles.orderButton}>
                                    <Text style={styles.orderText}>{order === 'asc' ? 'Oldest First' : 'Newest First'}</Text>
                                    <Ionicons name={order === 'asc' ? 'arrow-up' : 'arrow-down'} size={16} color="#fff" style={{ marginLeft: 5 }} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Date Range</Text>

                            <View style={styles.dateRow}>
                                <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
                                    <Text style={styles.dateLabel}>Start: {startDate ? startDate.toLocaleDateString() : 'Any'}</Text>
                                </TouchableOpacity>
                                {showStartPicker && (
                                    <DateTimePicker
                                        value={startDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={onStartDateChange}
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>

                            <View style={styles.dateRow}>
                                <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
                                    <Text style={styles.dateLabel}>End: {endDate ? endDate.toLocaleDateString() : 'Any'}</Text>
                                </TouchableOpacity>
                                {showEndPicker && (
                                    <DateTimePicker
                                        value={endDate || new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={onEndDateChange}
                                        maximumDate={new Date()}
                                    />
                                )}
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearFilters}>
                                <Text style={styles.buttonText}>Clear</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.applyButton]} onPress={handleApply}>
                                <Text style={styles.buttonText}>Apply</Text>
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
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: '#1a1a1a',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        marginRight: 10,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    filterButton: {
        padding: 8,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 400,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#888',
        marginBottom: 10,
        fontSize: 14,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
    },
    label: {
        color: '#fff',
        fontSize: 16,
    },
    orderButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderText: {
        color: '#fff',
        marginRight: 5,
    },
    dateRow: {
        marginBottom: 10,
    },
    dateButton: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 8,
    },
    dateLabel: {
        color: '#fff',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    clearButton: {
        backgroundColor: '#444',
    },
    applyButton: {
        backgroundColor: '#4caf50',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
