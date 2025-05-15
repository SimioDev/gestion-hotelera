import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import FormInput from '../shared/FormInput';

interface BasicInfoFormProps {
    form: {
        type: string;
        name: string;
        phone: string;
    };
    onChange: (name: string, value: string) => void;
}

const BasicInfoForm = ({ form, onChange }: BasicInfoFormProps) => {
    return (
        <>
            <View style={styles.inputContainer}>
                <Picker
                    selectedValue={form.type}
                    onValueChange={(value) => onChange('type', value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Selecciona el tipo" value="" />
                    <Picker.Item label="Hotel" value="hotel" />
                    <Picker.Item label="Casa" value="casa" />
                    <Picker.Item label="Apartamento" value="apartamento" />
                    <Picker.Item label="Terreno" value="terreno" />
                </Picker>
            </View>

            <FormInput
                label="Nombre"
                value={form.name}
                onChangeText={(text) => onChange('name', text)}
                placeholder="Nombre del inmueble"
                required
            />

            <FormInput
                label="Teléfono (opcional)"
                value={form.phone}
                onChangeText={(text) => onChange('phone', text)}
                placeholder="Teléfono"
                keyboardType="phone-pad"
            />
        </>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
    },
    picker: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 6,
        backgroundColor: '#F9FAFB',
    },
});

export default BasicInfoForm;
