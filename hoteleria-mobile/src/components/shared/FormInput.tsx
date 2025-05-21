import React, { useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FormInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    required?: boolean;
    keyboardType?: 'default' | 'number-pad' | 'decimal-pad' | 'numeric' | 'email-address' | 'phone-pad';
    editable?: boolean;
}

const FormInput = ({
                       label,
                       value,
                       onChangeText,
                       placeholder,
                       required = false,
                       keyboardType = 'default',
                       editable = true
                   }: FormInputProps) => {
    const inputRef = useRef<TextInput>(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setNativeProps({ text: value || '' });
        }
    }, [value]);

    return (
        <View style={styles.inputContainer}>
            <Text style={required ? styles.labelRequired : styles.label}>
                {label}
            </Text>
            <TextInput
                ref={inputRef}
                style={[
                    styles.input,
                    !editable && styles.disabledInput
                ]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                editable={editable}
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
    disabledInput: {
        backgroundColor: '#E5E7EB',
        color: '#6B7280',
    }
});

export default FormInput;
