import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../utils/auth/useAuth';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
    const router = useRouter();
    const { auth, signOut } = useAuth();
    const user = auth?.user;

    const handleLogout = () => {
        signOut();
        // Navigate back to the index (which will show the login prompt)
        // or since signOut clears auth, the reactive flows might handle it.
        // But good to be explicit if needed.
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const InfoItem = ({ label, value }) => (
        <View style={styles.infoItem}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value || '-'}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {/* Profile Card */}
                <View style={styles.card}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
                        </View>
                        <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
                        <Text style={styles.userRole}>{user?.job || 'Driver'}</Text>
                    </View>

                    <View style={styles.divider} />

                    <InfoItem label="Full Name" value={user?.name} />
                    <InfoItem label="IC Number" value={user?.ic_no} />
                    <InfoItem label="Phone Number" value={user?.phone_number} />
                    <InfoItem label="Address" value={user?.address} />
                </View>

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Vehicle Information</Text>
                    <View style={styles.divider} />
                    <InfoItem label="Car Model" value={user?.car_model} />
                    <InfoItem label="Car Plate" value={user?.car_plate} />
                    <InfoItem label="Insurance Policy" value={user?.insurance_policy} />
                    <InfoItem label="License Number" value={user?.license_number} />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3B82F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        borderWidth: 4,
        borderColor: '#EFF6FF',
    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '700',
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
        textAlign: 'center',
    },
    userRole: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: 16,
    },
    infoItem: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
    },
    logoutButton: {
        backgroundColor: '#EF4444',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
