import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';

export default function CreateHotelScreen() {
  const [form, setForm] = useState({
    type: '',
    name: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    phone: '',
    employees: '',
    logoUrl: '',
    managerName: '',
    managerEmail: '',
    services: '',
    price: '',
    images: '',
  });
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSearchAddress = async () => {
    if (!form.address || !form.city) {
      Alert.alert('Campos requeridos', 'Por favor, ingresa la ciudad y la dirección específica para buscar');
      return;
    }

    try {
      const query = `${form.address}, ${form.city}, Colombia`;
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
    }
  };

  const handleSelectAddress = (suggestion: any) => {
    setForm({
      ...form,
      address: suggestion.display_name,
      latitude: suggestion.lat.toString(),
      longitude: suggestion.lon.toString(),
    });
    setModalVisible(false);
    setAddressSuggestions([]);
  };

  const handleSubmit = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const hotelData = {
        type: form.type,
        name: form.name,
        address: form.address,
        city: form.city,
        location: {
          type: 'Point',
          coordinates: [parseFloat(form.longitude), parseFloat(form.latitude)],
        },
        phone: form.phone || undefined,
        employees: form.employees ? parseInt(form.employees) : undefined,
        logoUrl: form.logoUrl || undefined,
        managerName: form.managerName || undefined,
        managerEmail: form.managerEmail || undefined,
        services: form.services ? form.services.split(',').map(s => s.trim()) : undefined,
        price: form.price ? parseFloat(form.price) : undefined,
        images: form.images ? form.images.split(',').map(i => i.trim()) : undefined,
      };

      await axios.post('https://28c8-181-33-164-13.ngrok-free.app/hotels', hotelData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Alert.alert('Éxito', 'Hotel creado exitosamente');
      setForm({
        type: '',
        name: '',
        address: '',
        city: '',
        latitude: '',
        longitude: '',
        phone: '',
        employees: '',
        logoUrl: '',
        managerName: '',
        managerEmail: '',
        services: '',
        price: '',
        images: '',
      });
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el hotel');
    }
  };

  return (
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Crear Hotel</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tipo</Text>
          <Picker
              selectedValue={form.type}
              onValueChange={(value) => handleChange('type', value)}
              style={styles.picker}
          >
            <Picker.Item label="Selecciona el tipo" value="" />
            <Picker.Item label="Hotel" value="hotel" />
            <Picker.Item label="Casa" value="casa" />
            <Picker.Item label="Apartamento" value="apartamento" />
            <Picker.Item label="Terreno" value="terreno" />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput
              style={styles.input}
              placeholder="Nombre del hotel"
              value={form.name}
              onChangeText={text => handleChange('name', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ciudad (ej. Bogotá)</Text>
          <TextInput
              style={styles.input}
              placeholder="Ciudad"
              value={form.city}
              onChangeText={text => handleChange('city', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Dirección específica (ej. Calle 123 #45-67)</Text>
          <TextInput
              style={styles.input}
              placeholder="Dirección"
              value={form.address}
              onChangeText={text => handleChange('address', text)}
          />
        </View>
        <Button title="Buscar dirección" onPress={handleSearchAddress} color="#6B7280" />
        <Modal isVisible={isModalVisible} onBackdropPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sugerencias de Dirección</Text>
            <FlatList
                data={addressSuggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectAddress(item)}
                        style={styles.suggestionItem}
                    >
                      <Text>{item.display_name}</Text>
                    </TouchableOpacity>
                )}
                style={styles.suggestionList}
            />
            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#EF4444" />
          </View>
        </Modal>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Latitud</Text>
          <TextInput
              style={styles.input}
              placeholder="Latitud (ej: 4.7110)"
              value={form.latitude}
              onChangeText={text => handleChange('latitude', text)}
              keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Longitud</Text>
          <TextInput
              style={styles.input}
              placeholder="Longitud (ej: -74.0721)"
              value={form.longitude}
              onChangeText={text => handleChange('longitude', text)}
              keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Teléfono (opcional)</Text>
          <TextInput
              style={styles.input}
              placeholder="Teléfono"
              value={form.phone}
              onChangeText={text => handleChange('phone', text)}
          />
        </View>
        {form.type === 'hotel' && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Número de Empleados (opcional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Número de empleados"
                    value={form.employees}
                    onChangeText={text => handleChange('employees', text)}
                    keyboardType="numeric"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>URL del Logo (opcional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="URL del logo"
                    value={form.logoUrl}
                    onChangeText={text => handleChange('logoUrl', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre del Gerente (opcional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre del gerente"
                    value={form.managerName}
                    onChangeText={text => handleChange('managerName', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email del Gerente (opcional)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email del gerente"
                    value={form.managerEmail}
                    onChangeText={text => handleChange('managerEmail', text)}
                    keyboardType="email-address"
                />
              </View>
            </>
        )}
        {form.type !== 'hotel' && form.type && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Precio (opcional)</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Precio por noche"
                  value={form.price}
                  onChangeText={text => handleChange('price', text)}
                  keyboardType="numeric"
              />
            </View>
        )}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Servicios (opcional, separados por comas)</Text>
          <TextInput
              style={styles.input}
              placeholder="Ej: wifi, piscina"
              value={form.services}
              onChangeText={text => handleChange('services', text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Imágenes (opcional, URLs separadas por comas)</Text>
          <TextInput
              style={styles.input}
              placeholder="URLs de imágenes"
              value={form.images}
              onChangeText={text => handleChange('images', text)}
          />
        </View>
        <Button title="Crear Hotel" onPress={handleSubmit} color="#2563EB" />
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2563EB',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
  },
  suggestionList: {
    maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
});
