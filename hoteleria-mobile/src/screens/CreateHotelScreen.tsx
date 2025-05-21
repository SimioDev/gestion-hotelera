import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Componentes de formulario
import BasicInfoForm from '../components/forms/BasicInfoForm';
import LocationForm from '../components/forms/LocationForm';
import HotelSpecificForm from '../components/forms/HotelSpecificForm';
import PropertySpecificForm from '../components/forms/PropertySpecificForm';
import ServicesForm from '../components/forms/ServicesForm';
import FormButton from '../components/shared/FormButton';

const CreateHotelScreen = () => {
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

  const [formUpdated, setFormUpdated] = useState(0);
  const [mapLocation, setMapLocation] = useState(null);

  const handleChange = (name: string, value: string) => {
    console.log(`Actualizando ${name} = ${value}`);
    setForm(prevForm => {
      const newForm = { ...prevForm, [name]: value };
      return newForm;
    });
    setFormUpdated(prev => prev + 1);
  };

  useEffect(() => {
    console.log('Form state actualizado:', form);
  }, [form, formUpdated]);

  const handleLocationChange = (lat: number, lon: number) => {
    console.log(`Ubicación actualizada en componente principal: Lat: ${lat}, Lon: ${lon}`);
    setMapLocation([lat, lon]);
  };

  const validateRequiredFields = () => {
    const requiredFields = [
      { name: 'type', label: 'tipo' },
      { name: 'name', label: 'nombre' },
      { name: 'city', label: 'ciudad' },
      { name: 'address', label: 'dirección' },
      { name: 'latitude', label: 'latitud' },
      { name: 'longitude', label: 'longitud' },
    ];

    if (form.type === 'hotel') {
      requiredFields.push(
          { name: 'employees', label: 'número de empleados' },
          { name: 'logoUrl', label: 'URL del logo' }
      );
    } else if (form.type) {
      requiredFields.push({ name: 'price', label: 'precio' });
    }

    requiredFields.forEach(field => {
      console.log(`${field.name}: "${form[field.name]}"`);
    });

    const missingFields = requiredFields.filter(field => !form[field.name]);

    if (missingFields.length > 0) {
      const fieldLabels = missingFields.map(field => field.label);
      Alert.alert(
          'Campos requeridos',
          `Por favor, complete los siguientes campos: ${fieldLabels.join(', ')}.`
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateRequiredFields()) {
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('token');

      const latitude = parseFloat(form.latitude);
      const longitude = parseFloat(form.longitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        Alert.alert('Error', 'Las coordenadas de latitud y longitud deben ser números válidos');
        return;
      }

      const hotelData = {
        type: form.type,
        name: form.name,
        address: form.address,
        city: form.city,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude],
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

      const response = await axios.post('https://77a8-190-60-32-86.ngrok-free.app/hotels', hotelData, {
        headers: { Authorization: `Bearer ${token}` },
      });


      Alert.alert('Éxito', 'Inmueble creado exitosamente');
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
      setMapLocation(null);
    } catch (error) {
      console.error('Error al crear inmueble:', error);
      console.error('Detalles del error:', error.response ? JSON.stringify(error.response.data) : 'Sin respuesta del servidor');
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear el inmueble');
    }
  };

  return (
      <ScrollView style={styles.container}>
        <BasicInfoForm form={form} onChange={handleChange} />

        <LocationForm
            form={form}
            onChange={handleChange}
            onLocationChange={handleLocationChange}
        />

        {form.type === 'hotel' && (
            <HotelSpecificForm form={form} onChange={handleChange} />
        )}

        {form.type !== 'hotel' && form.type && (
            <PropertySpecificForm form={form} onChange={handleChange} />
        )}

        <ServicesForm form={form} onChange={handleChange} />

        <View style={styles.submitButtonContainer}>
          <FormButton
              title={`Crear ${form.type === 'hotel' ? 'Hotel' : 'Inmueble'}`}
              onPress={handleSubmit}
              type="primary"
              icon="add-circle"
          />
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
  submitButtonContainer: {
    marginVertical: 20,
  },
  locationInfo: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 6,
    marginVertical: 10,
  },
  locationText: {
    textAlign: 'center',
    color: '#4B5563',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CreateHotelScreen;
