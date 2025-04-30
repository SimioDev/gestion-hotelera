import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import { Hotel } from '../types/hotel';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 4.7110, // Bogotá por defecto
    longitude: -74.0721,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchHotels();
    getUserLocation();
  }, []);

  const fetchHotels = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const response = await axios.get('https://e46e-181-33-170-84.ngrok-free.app/hotels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Hoteles recibidos:', response.data); // Para depurar
      setHotels(response.data);
    } catch (error) {
      console.log('Error al cargar hoteles:', error);
      Alert.alert('Error', 'No se pudieron cargar los hoteles');
    }
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se otorgaron permisos para acceder a la ubicación');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });
      setMapRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.log('Error al obtener la ubicación:', error);
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  const centerOnUserLocation = () => {
    if (userLocation) {
      setMapRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } else {
      Alert.alert('Ubicación no disponible', 'No se ha podido obtener tu ubicación actual');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await SecureStore.getItemAsync('token');
      await axios.delete(`https://e46e-181-33-170-84.ngrok-free.app/hotels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHotels(hotels.filter(hotel => hotel.id !== id));
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar el hotel');
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    navigation.navigate('Login');
  };

  const focusOnHotel = (hotel: Hotel) => {
    if (hotel.location && hotel.location.coordinates) {
      setMapRegion({
        latitude: hotel.location.coordinates[1],
        longitude: hotel.location.coordinates[0],
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Hotel Management</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={styles.logoutText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>

        <MapView style={styles.map} region={mapRegion}>
          {hotels.map(hotel => (
              hotel.location && hotel.location.coordinates ? (
                  <Marker
                      key={hotel.id}
                      coordinate={{
                        latitude: hotel.location.coordinates[1],
                        longitude: hotel.location.coordinates[0],
                      }}
                      title={hotel.name}
                      description={hotel.address}
                  />
              ) : null
          ))}
          {userLocation && (
              <Marker
                  coordinate={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  title="Mi Ubicación"
                  pinColor="blue"
              />
          )}
        </MapView>

        <TouchableOpacity onPress={centerOnUserLocation} style={styles.locationButton}>
          <Ionicons name="locate-outline" size={24} color="#FFF" />
        </TouchableOpacity>

        <FlatList
            data={hotels}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.hotelItem}>
                  <TouchableOpacity onPress={() => focusOnHotel(item)} style={styles.hotelInfo}>
                    <Text style={styles.hotelName}>{item.name}</Text>
                    <Text style={styles.hotelAddress}>{item.address}, {item.city}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      onPress={() => {
                        setSelectedHotel(item);
                        setModalVisible(true);
                      }}
                      style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
            )}
            style={styles.list}
        />

        <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Eliminar Hotel?</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro de que deseas eliminar {selectedHotel?.name}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => selectedHotel && handleDelete(selectedHotel.id)}
                  style={[styles.modalButton, styles.modalButtonDelete]}
              >
                <Text style={[styles.modalButtonText, { color: '#FFF' }]}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2563EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    marginLeft: 8,
    fontSize: 16,
  },
  map: {
    height: '40%',
  },
  locationButton: {
    position: 'absolute',
    top: 80,
    right: 16,
    backgroundColor: '#2563EB',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  list: {
    flex: 1,
  },
  hotelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    backgroundColor: '#FFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  hotelAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    padding: 8,
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalButtonDelete: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#2563EB',
  },
});
