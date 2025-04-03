'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Map from '@/components/Map';
import { Hotel } from '@/types/hotel';
import { useRouter } from 'next/navigation';
import { FaTrash, FaSignOutAlt, FaHome, FaUser, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

export default function Home() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [view, setView] = useState<'general' | 'user' | 'create'>('general');
    const [newHotel, setNewHotel] = useState({
        name: '',
        location: { type: 'Point', coordinates: [0, 0] },
        address: '',
        city: '',
        phone: '',
        employees: 0,
    });
    const [mapCenter, setMapCenter] = useState<[number, number]>([4.5709, -74.2973]);
    const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
    const [user, setUser] = useState<{ id: number; email: string; chainName: string | null } | null>(null);
    const router = useRouter();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [userResponse, hotelsResponse] = await Promise.all([
                    axios.get('http://localhost:3000/users/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('http://localhost:3000/hotels', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setUser(userResponse.data);
                setHotels(hotelsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `No se pudo cargar la información del usuario: ${error.response?.data?.message || error.message}. Por favor, inicia sesión nuevamente.`,
                }).then(() => {
                    localStorage.removeItem('token');
                    router.push('/login');
                });
            }
        };
        fetchData();
    }, [token, router]);

    const handleCreateHotel = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tempLocation) {
            Swal.fire({
                icon: 'warning',
                title: 'Ubicación requerida',
                text: 'Por favor, selecciona una ubicación en el mapa',
            });
            return;
        }
        try {
            const hotelData = {
                ...newHotel,
                name: `${user?.chainName || 'Cadena sin nombre'} - ${newHotel.name}`,
                location: { type: 'Point', coordinates: [tempLocation[1], tempLocation[0]] },
            };
            const response = await axios.post('http://localhost:3000/hotels', hotelData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHotels([...hotels, response.data]);
            setNewHotel({
                name: '',
                location: { type: 'Point', coordinates: [0, 0] },
                address: '',
                city: '',
                phone: '',
                employees: 0,
            });
            setTempLocation(null);
            setView('general');
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Hotel creado exitosamente',
            });
        } catch (error) {
            console.error('Error creating hotel:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al crear el hotel',
            });
        }
    };

    const handleDeleteHotel = async (id: number) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            text: '¿Quieres eliminar este hotel?',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/hotels/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHotels(hotels.filter((hotel) => hotel.id !== id));
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: 'Hotel eliminado exitosamente',
                });
            } catch (error) {
                console.error('Error deleting hotel:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al eliminar el hotel',
                });
            }
        }
    };

    const handleSelectHotel = (hotel: Hotel) => {
        setMapCenter([hotel.location.coordinates[1], hotel.location.coordinates[0]]);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setHotels([]);
        router.push('/login');
    };

    const handleMapClick = (lat: number, lon: number) => {
        if (view === 'create') {
            setTempLocation([lat, lon]);
            setNewHotel({ ...newHotel, location: { type: 'Point', coordinates: [lon, lat] } });
        }
    };

    const handleUpdateChainName = async () => {
        const { value } = await Swal.fire({
            title: 'Editar nombre de la cadena',
            input: 'text',
            inputValue: user?.chainName || '',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return '¡Debes ingresar un nombre!';
                }
            },
        });
        if (value) {
            try {
                const response = await axios.patch(
                    'http://localhost:3000/users/me/chain-name',
                    { chainName: value },
                    { headers: { Authorization: `Bearer ${token}` } },
                );
                setUser(response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Actualizado',
                    text: 'Nombre de la cadena actualizado',
                });
            } catch (error) {
                console.error('Error updating chain name:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al actualizar el nombre de la cadena',
                });
            }
        }
    };

    return (
        <main className="flex min-h-screen">
            <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-primary">Hotelería Fácil</h1>
                    <button
                        onClick={handleLogout}
                        className="text-primary hover:text-opacity-80 flex items-center"
                        title="Cerrar sesión"
                    >
                        <FaSignOutAlt size={20} />
                    </button>
                </div>
                <div className="flex space-x-4 mb-4">
                    <button
                        onClick={() => setView('general')}
                        className={`p-2 rounded-md ${view === 'general' ? 'bg-primary text-secondary' : 'bg-gray-200'}`}
                        title="General"
                    >
                        <FaHome size={20} />
                    </button>
                    <button
                        onClick={() => setView('user')}
                        className={`p-2 rounded-md ${view === 'user' ? 'bg-primary text-secondary' : 'bg-gray-200'}`}
                        title="Usuario"
                    >
                        <FaUser size={20} />
                    </button>
                    <button
                        onClick={() => setView('create')}
                        className={`p-2 rounded-md ${view === 'create' ? 'bg-primary text-secondary' : 'bg-gray-200'}`}
                        title="Crear Hotel"
                    >
                        <FaPlus size={20} />
                    </button>
                </div>

                {view === 'general' && (
                    <div className="space-y-4">
                        {hotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative cursor-pointer"
                                onClick={() => handleSelectHotel(hotel)}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteHotel(hotel.id);
                                    }}
                                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                                    title="Eliminar hotel"
                                >
                                    <FaTrash size={16} />
                                </button>
                                <h2 className="text-lg font-semibold text-text">{hotel.name}</h2>
                                <p className="text-sm text-gray-600">{hotel.city}</p>
                                <p className="text-sm text-gray-500">Dirección: {hotel.address}</p>
                                <p className="text-sm text-gray-500">Teléfono: {hotel.phone}</p>
                                <p className="text-sm text-gray-500">Empleados: {hotel.employees}</p>
                                {hotel.services && hotel.services.length > 0 && (
                                    <p className="text-sm text-gray-500">
                                        Servicios: {hotel.services.join(', ')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {view === 'user' && (
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-text">Información del Usuario</h2>
                        <p className="text-sm text-gray-600">Email: {user?.email}</p>
                        <p className="text-sm text-gray-600">
                            Nombre de la cadena: {user?.chainName || 'Sin nombre'}
                        </p>
                        <button
                            onClick={handleUpdateChainName}
                            className="mt-2 bg-primary text-secondary py-1 px-3 rounded-md hover:bg-opacity-90"
                        >
                            Editar nombre de la cadena
                        </button>
                    </div>
                )}

                {view === 'create' && (
                    <form onSubmit={handleCreateHotel} className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-text mb-2">Crear Nueva Sede</h2>
                        <p className="text-sm text-gray-500 mb-2">
                            Haz clic en el mapa para seleccionar la ubicación
                        </p>
                        {tempLocation && (
                            <p className="text-sm text-gray-600 mb-2">
                                Ubicación seleccionada: Lat {tempLocation[0].toFixed(4)}, Lon{' '}
                                {tempLocation[1].toFixed(4)}
                            </p>
                        )}
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="Nombre de la sede"
                                value={newHotel.name}
                                onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="Dirección"
                                value={newHotel.address}
                                onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="Ciudad"
                                value={newHotel.city}
                                onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="text"
                                placeholder="Teléfono"
                                value={newHotel.phone}
                                onChange={(e) => setNewHotel({ ...newHotel, phone: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <input
                                type="number"
                                placeholder="Empleados"
                                value={newHotel.employees}
                                onChange={(e) => setNewHotel({ ...newHotel, employees: +e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary text-secondary py-2 rounded-md hover:bg-opacity-90"
                        >
                            Crear Hotel
                        </button>
                    </form>
                )}
            </div>
            <div className="w-3/4">
                <Map hotels={hotels} center={mapCenter} onMapClick={handleMapClick} tempLocation={tempLocation} />
            </div>
        </main>
    );
}
