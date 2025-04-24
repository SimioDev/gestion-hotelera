'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Sidebar from '@/components/Sidebar';
import { Hotel } from '@/types/hotel';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function Home() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [view, setView] = useState<'general' | 'user' | 'create'>('general');
    const [mapCenter, setMapCenter] = useState<[number, number]>([4.5709, -74.2973]);
    const [tempLocation, setTempLocation] = useState<[number, number] | null>(null);
    const [user, setUser] = useState<{ id: number; email: string; chainName: string | null } | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        setToken(storedToken);

        if (!storedToken) {
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        if (token === null || !token) return;

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

                const fetchedHotels = hotelsResponse.data;
                console.log('Fetched hotels:', fetchedHotels);

                const parsedHotels = fetchedHotels.map((hotel: any) => {
                    let parsedLocation;
                    try {
                        parsedLocation = typeof hotel.location === 'string' ? JSON.parse(hotel.location) : hotel.location;
                    } catch (error) {
                        console.error('Error parsing location for hotel:', hotel, error);
                        parsedLocation = { type: 'Point', coordinates: [0, 0] };
                    }
                    return {
                        ...hotel,
                        location: parsedLocation,
                    };
                });

                const validHotels = parsedHotels.filter((hotel: Hotel) => {
                    const isValid =
                        hotel.location?.coordinates &&
                        Array.isArray(hotel.location.coordinates) &&
                        hotel.location.coordinates.length === 2 &&
                        typeof hotel.location.coordinates[0] === 'number' &&
                        typeof hotel.location.coordinates[1] === 'number';
                    if (!isValid) {
                        console.warn('Invalid hotel data:', hotel);
                    }
                    return isValid;
                });

                setHotels(validHotels);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar la información. Por favor, intenta de nuevo.',
                });
            }
        };
        fetchData();
    }, [token]);

    const handleDeleteHotel = async (id: number) => {
        if (!token) return;

        const result = await Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            text: `¿Quieres eliminar este ${hotels.find(h => h.id === id)?.type === 'hotel' ? 'hotel' : 'propiedad'}?`,
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
                    text: 'Eliminado exitosamente',
                });
            } catch (error) {
                console.error('Error deleting property:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al eliminar',
                });
            }
        }
    };

    const handleSelectHotel = (hotel: Hotel) => {
        if (hotel.location?.coordinates?.length === 2) {
            setMapCenter([hotel.location.coordinates[1], hotel.location.coordinates[0]]);
        }
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
        }
        setUser(null);
        setHotels([]);
        setToken(null);
        router.push('/login');
    };

    const handleMapClick = (lat: number, lon: number) => {
        if (view === 'create') {
            setTempLocation([lat, lon]);
        }
    };

    const handleUpdateChainName = (newChainName: string) => {
        setUser((prev) => (prev ? { ...prev, chainName: newChainName } : prev));
    };

    const handleCreateHotel = async (newHotel: any) => {
        console.log('New hotel created:', newHotel);

        const isValid =
            newHotel.location?.coordinates &&
            Array.isArray(newHotel.location.coordinates) &&
            newHotel.location.coordinates.length === 2 &&
            typeof newHotel.location.coordinates[0] === 'number' &&
            typeof newHotel.location.coordinates[1] === 'number';

        if (!isValid) {
            console.warn('New hotel has invalid coordinates:', newHotel);
            Swal.fire({
                icon: 'warning',
                title: 'Advertencia',
                text: 'El hotel/propiedad creado tiene datos inválidos y no se mostrará en la lista. Por favor, verifica los datos.',
            });
            return;
        }

        try {
            const hotelsResponse = await axios.get('http://localhost:3000/hotels', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const fetchedHotels = hotelsResponse.data;
            console.log('Fetched hotels after creation:', fetchedHotels);

            const parsedHotels = fetchedHotels.map((hotel: any) => {
                let parsedLocation;
                try {
                    parsedLocation = typeof hotel.location === 'string' ? JSON.parse(hotel.location) : hotel.location;
                } catch (error) {
                    console.error('Error parsing location for hotel:', hotel, error);
                    parsedLocation = { type: 'Point', coordinates: [0, 0] };
                }
                return {
                    ...hotel,
                    location: parsedLocation,
                };
            });

            const validHotels = parsedHotels.filter((hotel: Hotel) => {
                const isValid =
                    hotel.location?.coordinates &&
                    Array.isArray(hotel.location.coordinates) &&
                    hotel.location.coordinates.length === 2 &&
                    typeof hotel.location.coordinates[0] === 'number' &&
                    typeof hotel.location.coordinates[1] === 'number';
                if (!isValid) {
                    console.warn('Invalid hotel data:', hotel);
                }
                return isValid;
            });

            setHotels(validHotels);
            setView('general');
        } catch (error) {
            console.error('Error fetching hotels after creation:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la lista de hoteles. Por favor, recarga la página.',
            });
        }
    };

    if (token === null || !token) {
        return null;
    }

    return (
        <main className="flex min-h-screen">
            <Sidebar
                view={view}
                setView={setView}
                hotels={hotels}
                user={user}
                token={token}
                onSelectHotel={handleSelectHotel}
                onDeleteHotel={handleDeleteHotel}
                onUpdateChainName={handleUpdateChainName}
                onCreateHotel={handleCreateHotel}
                onMapClick={handleMapClick}
                tempLocation={tempLocation}
                setTempLocation={setTempLocation}
                setMapCenter={setMapCenter}
                onLogout={handleLogout}
            />
            <div className="w-3/4">
                <Map
                    hotels={hotels}
                    center={mapCenter}
                    onMapClick={handleMapClick}
                    tempLocation={tempLocation}
                />
            </div>
        </main>
    );
}