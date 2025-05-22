import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import FormInput from '../components/shared/FormInput';
import FormButton from '../components/shared/FormButton';

const ProfileScreen = () => {
    const [userProfile, setUserProfile] = useState({
        username: '',
        email: '',
        chainName: '',
        role: '',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiBaseUrl] = useState('https://32c4-186-103-58-124.ngrok-free.app');

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
                Alert.alert('Error', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                return;
            }

            const response = await axios.get(`${apiBaseUrl}/users/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Perfil de usuario:', response.data);
            setUserProfile({
                username: response.data.username || '',
                email: response.data.email || '',
                chainName: response.data.chainName || '',
                role: response.data.role || '',
            });
        } catch (error) {
            console.error('Error al obtener perfil de usuario:', error);
            Alert.alert('Error', 'No se pudo cargar tu información de perfil');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeChainName = async () => {
        if (!userProfile.chainName.trim()) {
            Alert.alert('Error', 'El nombre de la cadena no puede estar vacío');
            return;
        }

        setIsSubmitting(true);
        try {
            const token = await SecureStore.getItemAsync('token');
            if (!token) {
                Alert.alert('Error', 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                return;
            }

            const response = await axios.patch(
                `${apiBaseUrl}/users/me/chain-name`,
                { chainName: userProfile.chainName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Respuesta actualización:', response.data);
            Alert.alert('Éxito', 'El nombre de tu cadena hotelera ha sido actualizado.');
            await SecureStore.setItemAsync('userChainName', userProfile.chainName);
        } catch (error) {
            console.error('Error al actualizar nombre de cadena:', error);
            console.error('Detalles del error:', error.response ?
                `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}` :
                'Sin respuesta del servidor');

            Alert.alert(
                'Error',
                error.response?.data?.message ||
                `No se pudo actualizar el nombre de la cadena: ${error.message}`
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateField = (field: string, value: string) => {
        setUserProfile({
            ...userProfile,
            [field]: value
        });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Cargando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Información de Usuario</Text>
                <FormInput
                    label="Correo electrónico"
                    value={userProfile.email}
                    onChangeText={(text) => handleUpdateField('email', text)}
                    placeholder="Correo electrónico"
                    required={false}
                    editable={false}
                />
            </View>

            <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Configuración de Cadena Hotelera</Text>

                <FormInput
                    label="Nombre de la Cadena"
                    value={userProfile.chainName}
                    onChangeText={(text) => handleUpdateField('chainName', text)}
                    placeholder="Ingresa el nombre de tu cadena hotelera"
                    required={true}
                />

                <View style={styles.buttonContainer}>
                    <FormButton
                        title={isSubmitting ? "Actualizando..." : "Actualizar Nombre de Cadena"}
                        onPress={handleChangeChainName}
                        type="primary"
                        icon="save"
                        disabled={isSubmitting}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F3F4F6',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#4B5563',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#2563EB',
    },
    profileSection: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        color: '#1F2937',
    },
    buttonContainer: {
        marginTop: 16,
    },
});

export default ProfileScreen;
