import React from 'react';
import { View, StyleSheet } from 'react-native';
import FormInput from '../shared/FormInput';
import FormButton from '../shared/FormButton';

interface ServicesFormProps {
    form: {
        services: string;
        images: string;
    };
    onChange: (name: string, value: string) => void;
}

const ServicesForm = ({ form, onChange }: ServicesFormProps) => {
    return (
        <>
            <FormInput
                label="Servicios (opcional, separados por comas)"
                value={form.services}
                onChangeText={(text) => onChange('services', text)}
                placeholder="Ej: wifi, piscina"
            />

            <FormInput
                label="Imágenes (opcional, URLs separadas por comas)"
                value={form.images}
                onChangeText={(text) => onChange('images', text)}
                placeholder="URLs de imágenes"
            />
        </>
    );
};

export default ServicesForm;
