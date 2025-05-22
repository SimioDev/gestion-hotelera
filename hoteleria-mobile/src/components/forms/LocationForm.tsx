import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import FormInput from '../shared/FormInput';
import FormButton from '../shared/FormButton';
import AddressModal from './AddressModal';

interface LocationFormProps {
    form: {
        address: string;
        city: string;
        latitude: string;
        longitude: string;
    };
    onChange: (name: string, value: string) => void;
    onLocationChange?: (lat: number, lon: number) => void;
}

const LocationForm = ({ form, onChange, onLocationChange }: LocationFormProps) => {
    const [localForm, setLocalForm] = useState({
        address: form.address || '',
        city: form.city || '',
        latitude: form.latitude || '',
        longitude: form.longitude || ''
    });
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);

    useEffect(() => {
        setLocalForm({
            address: form.address || '',
            city: form.city || '',
            latitude: form.latitude || '',
            longitude: form.longitude || ''
        });
    }, [form]);

    const updateLocation = (lat: number, lon: number, address: string, city: string) => {
        setLocalForm({
            latitude: lat.toString(),
            longitude: lon.toString(),
            address: address,
            city: city
        });

        onChange('latitude', lat.toString());
        onChange('longitude', lon.toString());
        onChange('address', address);
        onChange('city', city);

        if (onLocationChange) {
            onLocationChange(lat, lon);
        }

        console.log(`Ubicación actualizada: Lat: ${lat}, Lon: ${lon}, Dir: ${address}, Ciudad: ${city}`);
    };

    const handleLocalChange = (name: string, value: string) => {
        setLocalForm(prev => ({ ...prev, [name]: value }));
        onChange(name, value);
    };

    const handleSearchAddress = async () => {
        if (!localForm.address || !localForm.city) {
            Alert.alert('Campos requeridos', 'Por favor, ingresa la ciudad y la dirección específica para buscar');
            return;
        }

        setIsLoading(true);
        try {
            const query = `${localForm.address}, ${localForm.city}, Colombia`;
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5,
                    countrycodes: 'CO',
                },
                headers: {
                    'User-Agent': 'GestionInmobiliariaApp/1.0 (tu-email@example.com)',
                },
            });

            const suggestions = response.data.map((item: any) => ({
                display_name: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
            }));

            setAddressSuggestions(suggestions);

            if (suggestions.length > 0) {
                setModalVisible(true);
            } else {
                Alert.alert('Sin resultados', 'No se encontraron direcciones en Colombia. Intenta con otra búsqueda.');
            }
        } catch (error) {
            console.error('Error searching address:', error);
            Alert.alert('Error', 'No se pudo buscar la dirección. Intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAddress = (suggestion: any) => {
        updateLocation(
            suggestion.lat,
            suggestion.lon,
            suggestion.display_name,
            localForm.city
        );

        setModalVisible(false);
        setAddressSuggestions([]);
    };

    const useCurrentLocation = async () => {
        setIsUsingCurrentLocation(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permiso denegado',
                    'Necesitamos permisos de ubicación para usar esta función.',
                    [
                        { text: 'Cancelar' },
                        {
                            text: 'Solicitar permisos',
                            onPress: async () => await Location.requestForegroundPermissionsAsync()
                        }
                    ]
                );
                setIsUsingCurrentLocation(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            const { latitude, longitude } = location.coords;
            console.log(`Ubicación obtenida: Lat: ${latitude}, Lon: ${longitude}`);

            try {
                const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                    params: {
                        lat: latitude,
                        lon: longitude,
                        format: 'json',
                    },
                    headers: {
                        'User-Agent': 'GestionInmobiliariaApp/1.0 (tu-email@example.com)',
                    },
                });

                const address = response.data.display_name;
                const city = response.data.address.city ||
                    response.data.address.town ||
                    response.data.address.village ||
                    response.data.address.county ||
                    'Desconocida';

                updateLocation(latitude, longitude, address, city);

                Alert.alert('Éxito', 'Se ha usado tu ubicación actual como dirección del inmueble');
            } catch (error) {
                updateLocation(latitude, longitude, 'Mi ubicación actual', localForm.city || 'Desconocida');

                Alert.alert(
                    'Ubicación detectada',
                    'No pudimos determinar la dirección exacta, pero guardamos tus coordenadas.'
                );
            }
        } catch (error) {
            console.error('Error al obtener ubicación:', error);
            Alert.alert('Error', 'No se pudo obtener tu ubicación actual.');
        } finally {
            setIsUsingCurrentLocation(false);
        }
    };

    return (
        <>
            <FormInput
                label="Ciudad (ej. Bogotá)"
                value={localForm.city}
                onChangeText={(text) => handleLocalChange('city', text)}
                placeholder="Ciudad"
                required
            />

            <FormInput
                label="Dirección específica (ej. Calle 123 #45-67)"
                value={localForm.address}
                onChangeText={(text) => handleLocalChange('address', text)}
                placeholder="Dirección"
                required
            />

            <View style={styles.buttonContainer}>
                <View style={styles.buttonWrapper}>
                    <FormButton
                        title={isLoading ? "Buscando..." : "Buscar dirección"}
                        onPress={handleSearchAddress}
                        icon="search"
                        disabled={isLoading}
                        type="primary"
                    />
                </View>

                <View style={styles.buttonWrapper}>
                    <FormButton
                        title={isUsingCurrentLocation ? "Obteniendo..." : "Usar mi ubicación"}
                        onPress={useCurrentLocation}
                        icon="locate"
                        disabled={isUsingCurrentLocation}
                        type="secondary"
                    />
                </View>
            </View>

            {(isLoading || isUsingCurrentLocation) && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563EB" />
                </View>
            )}

            <FormInput
                label="Latitud"
                value={localForm.latitude}
                onChangeText={(text) => handleLocalChange('latitude', text)}
                placeholder="Latitud (ej: 4.7110)"
                keyboardType="numeric"
                required
            />

            <FormInput
                label="Longitud"
                value={localForm.longitude}
                onChangeText={(text) => handleLocalChange('longitude', text)}
                placeholder="Longitud (ej: -74.0721)"
                keyboardType="numeric"
                required
            />

            <AddressModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                suggestions={addressSuggestions}
                onSelectAddress={handleSelectAddress}
            />
        </>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 5,
    },
});

export default LocationForm;
