import React from 'react';
import FormInput from '../shared/FormInput';

interface PropertySpecificFormProps {
    form: {
        price: string;
    };
    onChange: (name: string, value: string) => void;
}

const PropertySpecificForm = ({ form, onChange }: PropertySpecificFormProps) => {
    return (
        <FormInput
            label="Precio (obligatorio)"
            value={form.price}
            onChangeText={(text) => onChange('price', text)}
            placeholder="Precio"
            keyboardType="numeric"
            required
        />
    );
};

export default PropertySpecificForm;
