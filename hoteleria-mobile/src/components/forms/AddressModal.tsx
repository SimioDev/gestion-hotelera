import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import FormButton from '../shared/FormButton';

interface AddressModalProps {
    isVisible: boolean;
    onClose: () => void;
    suggestions: any[];
    onSelectAddress: (suggestion: any) => void;
}

const AddressModal = ({ isVisible, onClose, suggestions, onSelectAddress }: AddressModalProps) => {
    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Sugerencias de Dirección</Text>
                <FlatList
                    data={suggestions}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => onSelectAddress(item)}
                            style={styles.suggestionItem}
                        >
                            <Text>{item.display_name}</Text>
                        </TouchableOpacity>
                    )}
                    style={styles.suggestionList}
                />
                <FormButton
                    title="Cancelar"
                    onPress={onClose}
                    type="danger"
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        maxHeight: '70%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1F2937',
        textAlign: 'center',
    },
    suggestionList: {
        maxHeight: 250,
        marginBottom: 10,
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#D1D5DB',
    },
});

export default AddressModal;
