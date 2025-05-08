import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

interface CreateFormProps {
    token: string | null;
    userChainName: string | null;
    onCreate: (newHotel: any) => void;
    onSuccess: () => void;
    onMapClick: (lat: number, lon: number) => void;
    tempLocation: [number, number] | null;
    setTempLocation: (location: [number, number] | null) => void;
    setMapCenter: (center: [number, number]) => void;
}

export default function CreateForm({
    token,
    userChainName,
    onCreate,
    onSuccess,
    onMapClick,
    tempLocation,
    setTempLocation,
    setMapCenter,
}: CreateFormProps) {
    const [newHotel, setNewHotel] = useState({
        type: '',
        name: '',
        address: '',
        city: '',
        phone: '',
        employees: 0,
        services: [] as string[],
        price: 0,
        logoUrl: '',
        managerName: '',
        managerEmail: '',
        location: { type: 'Point', coordinates: [0, 0] },
    });
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);

    const handleSearchAddress = async () => {
        if (!newHotel.address || !newHotel.city) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos requeridos',
                text: 'Por favor, ingresa la ciudad y la dirección específica para buscar',
            });
            return;
        }

        try {
            const query = `${newHotel.address}, ${newHotel.city}, Colombia`;
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
                params: {
                    q: query,
                    format: 'json',
                    addressdetails: 1,
                    limit: 5,
                    countrycodes: 'CO',
                },
                headers: {
                    'User-Agent': 'GestionInmobiliariaApp/1.0 (tu-email@example.com)',
                },
            });

            const suggestions = response.data.map((item: any) => ({
                display_name: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
            }));
            setAddressSuggestions(suggestions);

            if (suggestions.length > 0) {
                setTempLocation([suggestions[0].lat, suggestions[0].lon]);
                setNewHotel({
                    ...newHotel,
                    address: suggestions[0].display_name,
                    location: { type: 'Point', coordinates: [suggestions[0].lon, suggestions[0].lat] },
                });
                setMapCenter([suggestions[0].lat, suggestions[0].lon]);
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin resultados',
                    text: 'No se encontraron direcciones en Colombia. Intenta con otra búsqueda.',
                });
            }
        } catch (error) {
            console.error('Error searching address:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo buscar la dirección. Intenta de nuevo.',
            });
        }
    };

    const handleSelectAddress = (suggestion: any) => {
        setNewHotel({
            ...newHotel,
            address: suggestion.display_name,
            location: { type: 'Point', coordinates: [suggestion.lon, suggestion.lat] },
        });
        setTempLocation([suggestion.lat, suggestion.lon]);
        setMapCenter([suggestion.lat, suggestion.lon]);
        setAddressSuggestions([]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(filesArray);
        }
    };

    const handleAddService = () => {
        Swal.fire({
            title: 'Agregar servicio',
            input: 'text',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return '¡Debes ingresar un servicio!';
                }
            },
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                setNewHotel({
                    ...newHotel,
                    services: [...newHotel.services, result.value],
                });
            }
        });
    };

    const handleRemoveService = (service: string) => {
        setNewHotel({
            ...newHotel,
            services: newHotel.services.filter((s) => s !== service),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tempLocation) {
            Swal.fire({
                icon: 'warning',
                title: 'Ubicación requerida',
                text: 'Por favor, selecciona una ubicación en el mapa o busca una dirección',
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('type', newHotel.type);
            formData.append('name', `${userChainName || 'Cadena sin nombre'} - ${newHotel.name}`);
            formData.append('address', newHotel.address);
            formData.append('city', newHotel.city);
            if (newHotel.phone) formData.append('phone', newHotel.phone);
            if (newHotel.type === 'hotel') {
                formData.append('employees', newHotel.employees.toString());
                formData.append('logoUrl', newHotel.logoUrl);
                if (newHotel.managerName) formData.append('managerName', newHotel.managerName);
                if (newHotel.managerEmail) formData.append('managerEmail', newHotel.managerEmail);
            } else {
                formData.append('price', newHotel.price.toString());
            }
            newHotel.services.forEach((service, index) => {
                formData.append(`services[${index}]`, service);
            });
            formData.append('location', JSON.stringify({ type: 'Point', coordinates: [tempLocation[1], tempLocation[0]] }));
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            const response = await axios.post('http://localhost:3000/hotels', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Backend response for new hotel:', response.data);

            onCreate(response.data);
            setNewHotel({
                type: '',
                name: '',
                address: '',
                city: '',
                phone: '',
                employees: 0,
                services: [],
                price: 0,
                logoUrl: '',
                managerName: '',
                managerEmail: '',
                location: { type: 'Point', coordinates: [0, 0] },
            });
            setSelectedFiles([]);
            setTempLocation(null);
            setAddressSuggestions([]);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: `${newHotel.type === 'hotel' ? 'Hotel' : 'Propiedad'} creada exitosamente`,
            });
            onSuccess();
        } catch (error) {
            console.error('Error creating property:', error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || `Error al crear ${newHotel.type === 'hotel' ? 'el hotel' : 'la propiedad'}`,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-text mb-2 text-center">Crear Nueva</h2>
            <p className="text-sm text-gray-500 mb-2 text-left">
                Busca una dirección o haz clic en el mapa para seleccionar la ubicación
            </p>
            {tempLocation && (
                <p className="text-sm text-gray-600 mb-2 text-center">
                    Ubicación seleccionada: Lat {tempLocation[0].toFixed(4)}, Lon{' '}
                    {tempLocation[1].toFixed(4)}
                </p>
            )}
            <div className="centered-content">
                <div className="mb-2">
                    <select
                        value={newHotel.type}
                        onChange={(e) => setNewHotel({ ...newHotel, type: e.target.value })}
                        className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                        required
                    >
                        <option value="">Selecciona el tipo</option>
                        <option value="hotel">Hotel</option>
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="terreno">Terreno</option>
                    </select>
                </div>
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={newHotel.name}
                        onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                        className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                        required
                    />
                </div>
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Ciudad (ej. Bogotá)"
                        value={newHotel.city}
                        onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
                        className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                        required
                    />
                </div>
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Dirección específica (ej. Calle 123 #45-67)"
                        value={newHotel.address}
                        onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                        className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                        required
                    />
                </div>
                <button
                    type="button"
                    onClick={handleSearchAddress}
                    className="w-full max-w-xs p-2 bg-gray-500 text-white rounded-md mb-2 mx-auto block"
                >
                    Buscar dirección
                </button>
                {addressSuggestions.length > 0 && (
                    <ul className="mb-2 border rounded max-h-40 overflow-y-auto w-full max-w-xs mx-auto">
                        {addressSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelectAddress(suggestion)}
                                className="p-2 hover:bg-gray-200 cursor-pointer text-center"
                            >
                                {suggestion.display_name}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mb-2">
                    <input
                        type="text"
                        placeholder="Teléfono"
                        value={newHotel.phone}
                        onChange={(e) => setNewHotel({ ...newHotel, phone: e.target.value })}
                        className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                    />
                </div>
                {newHotel.type === 'hotel' && (
                    <>
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-1 text-center">
                                Número de empleados:
                            </label>
                            <input
                                type="number"
                                placeholder="Número de empleados"
                                value={newHotel.employees}
                                onChange={(e) => setNewHotel({ ...newHotel, employees: +e.target.value })}
                                className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="URL del logo"
                                value={newHotel.logoUrl}
                                onChange={(e) => setNewHotel({ ...newHotel, logoUrl: e.target.value })}
                                className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="Nombre del gerente"
                                value={newHotel.managerName}
                                onChange={(e) => setNewHotel({ ...newHotel, managerName: e.target.value })}
                                className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="email"
                                placeholder="Email del gerente"
                                value={newHotel.managerEmail}
                                onChange={(e) => setNewHotel({ ...newHotel, managerEmail: e.target.value })}
                                className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                            />
                        </div>
                    </>
                )}
                {newHotel.type !== 'hotel' && newHotel.type && (
                    <div className="mb-2">
                        <input
                            type="number"
                            placeholder="Precio"
                            value={newHotel.price}
                            onChange={(e) => setNewHotel({ ...newHotel, price: +e.target.value })}
                            className="w-full max-w-xs p-2 border rounded-md mx-auto block"
                            required
                        />
                    </div>
                )}
                <div className="mb-2">
                    <label className="text-sm text-gray-600 block text-center">Servicios:</label>
                    <div className="flex flex-wrap gap-2 mb-2 justify-center">
                        {newHotel.services.map((service, index) => (
                            <div key={index} className="flex items-center bg-gray-200 px-2 py-1 rounded">
                                <span>{service}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveService(service)}
                                    className="ml-2 text-red-500"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleAddService}
                        className="w-full max-w-xs p-2 bg-gray-500 text-white rounded-md mx-auto block"
                    >
                        Agregar servicio
                    </button>
                </div>
            </div>
            <div className="mb-2">
                <label className="text-sm text-gray-600 text-left block">Subir imágenes (máximo 5):</label>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded-md"
                />
                {selectedFiles.length > 0 && (
                    <p className="text-sm text-gray-600 mt-1 text-center">
                        {selectedFiles.length} archivo(s) seleccionado(s)
                    </p>
                )}
            </div>
            <button
                type="submit"
                className="w-full max-w-xs bg-primary text-secondary py-2 rounded-md hover:bg-opacity-90 mx-auto block"
            >
                Crear {newHotel.type === 'hotel' ? 'Hotel' : 'Propiedad'}
            </button>
        </form>
    );
}