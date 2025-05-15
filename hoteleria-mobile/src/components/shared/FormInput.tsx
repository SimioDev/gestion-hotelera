import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    required?: boolean;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
}

const FormInput = ({
                       label,
                       value,
                       onChangeText,
                       placeholder,
                       required = false,
                       keyboardType = 'default'
                   }: FormInputProps) => {
    // Referencia al input para poder actualizarlo programáticamente si es necesario
    const inputRef = useRef<TextInput>(null);

    // Verificamos si el valor cambia externamente
    useEffect(() => {
        if (inputRef.current) {
            // Si el valor cambia externamente, nos aseguramos que el input lo refleje
            inputRef.current.setNativeProps({ text: value || '' });
        }
    }, [value]);

    // Añadimos un log para verificar qué valores están llegando al componente
    console.log(`Renderizando FormInput - "${label}": "${value}"`);

    return (
        <View style={styles.inputContainer}>
            <Text style={required ? styles.labelRequired : styles.label}>
                {label}
            </Text>
            <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                defaultValue={value || ''}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 8,
    },
    labelRequired: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 8,
        textDecorationLine: 'underline',
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

export default FormInput;
