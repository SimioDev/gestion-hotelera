import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

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

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
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

      await axios.post('http://backend:3000/hotels', hotelData, {
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
        <TextInput
          style={styles.input}
          placeholder="Ej: hotel, motel"
          value={form.type}
          onChangeText={text => handleChange('type', text)}
        />
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
        <Text style={styles.label}>Dirección</Text>
        <TextInput
          style={styles.input}
          placeholder="Dirección"
          value={form.address}
          onChangeText={text => handleChange('address', text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ciudad</Text>
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={form.city}
          onChangeText={text => handleChange('city', text)}
        />
      </View>
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
        <Text style={styles.label}>Precio (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Precio por noche"
          value={form.price}
          onChangeText={text => handleChange('price', text)}
          keyboardType="numeric"
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
});
