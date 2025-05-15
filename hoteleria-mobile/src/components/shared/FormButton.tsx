import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FormButtonProps {
    title: string;
    onPress: () => void;
    icon?: string;
    type?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

const FormButton = ({
                        title,
                        onPress,
                        icon,
                        type = 'primary',
                        disabled = false
                    }: FormButtonProps) => {
    const getButtonStyle = () => {
        switch (type) {
            case 'primary':
                return styles.primaryButton;
            case 'secondary':
                return styles.secondaryButton;
            case 'danger':
                return styles.dangerButton;
            default:
                return styles.primaryButton;
        }
    };

    const getTextStyle = () => {
        switch (type) {
            case 'primary':
            case 'secondary':
            case 'danger':
                return styles.buttonText;
            default:
                return styles.buttonText;
        }
    };

    return (
        <TouchableOpacity
            style={[getButtonStyle(), disabled && styles.disabledButton]}
            onPress={onPress}
            disabled={disabled}
        >
            {icon && <Ionicons name={icon} size={20} color="white" style={styles.icon} />}
            <Text style={getTextStyle()}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    primaryButton: {
        backgroundColor: '#2563EB',
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: '#10B981',
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dangerButton: {
        backgroundColor: '#EF4444',
        padding: 12,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: 'white',
        fontWeight: '500',
    },
    icon: {
        marginRight: 5,
    },
});

export default FormButton;
