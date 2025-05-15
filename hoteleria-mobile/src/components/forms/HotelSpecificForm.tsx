import React from 'react';
import FormInput from '../shared/FormInput';

interface HotelSpecificFormProps {
    form: {
        employees: string;
        logoUrl: string;
        managerName: string;
        managerEmail: string;
    };
    onChange: (name: string, value: string) => void;
}

const HotelSpecificForm = ({ form, onChange }: HotelSpecificFormProps) => {
    return (
        <>
            <FormInput
                label="Número de Empleados"
                value={form.employees}
                onChangeText={(text) => onChange('employees', text)}
                placeholder="Número de empleados"
                keyboardType="numeric"
                required
            />

            <FormInput
                label="URL del Logo"
                value={form.logoUrl}
                onChangeText={(text) => onChange('logoUrl', text)}
                placeholder="URL del logo"
                required
            />

            <FormInput
                label="Nombre del Gerente (opcional)"
                value={form.managerName}
                onChangeText={(text) => onChange('managerName', text)}
                placeholder="Nombre del gerente"
            />

            <FormInput
                label="Email del Gerente (opcional)"
                value={form.managerEmail}
                onChangeText={(text) => onChange('managerEmail', text)}
                placeholder="Email del gerente"
                keyboardType="email-address"
            />
        </>
    );
};

export default HotelSpecificForm;
