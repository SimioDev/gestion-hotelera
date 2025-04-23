'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Hotel } from '@/types/hotel';
import { useEffect } from 'react';

const customIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const tempIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface MapProps {
    hotels: Hotel[];
    center: [number, number];
    onMapClick?: (lat: number, lon: number) => void;
    tempLocation?: [number, number] | null;
}

function MapUpdater({ center, onMapClick }: { center: [number, number]; onMapClick?: (lat: number, lon: number) => void }) {
    const map = useMap();

    useEffect(() => {
        map.setView(center, map.getZoom());
    }, [center, map]);

    useEffect(() => {
        if (onMapClick) {
            const handleClick = (e: L.LeafletMouseEvent) => {
                onMapClick(e.latlng.lat, e.latlng.lng);
            };
            map.on('click', handleClick);
            return () => {
                map.off('click', handleClick);
            };
        }
    }, [map, onMapClick]);

    return null;
}

export default function Map({ hotels, center, onMapClick, tempLocation }: MapProps) {
    return (
        <MapContainer center={center} zoom={6} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="Desarrollado por: Nestor Cabrera"
            />
            <MapUpdater center={center} onMapClick={onMapClick} />
            {hotels.map((hotel) => {
                if (
                    hotel.location?.coordinates &&
                    Array.isArray(hotel.location.coordinates) &&
                    hotel.location.coordinates.length === 2 &&
                    typeof hotel.location.coordinates[0] === 'number' &&
                    typeof hotel.location.coordinates[1] === 'number'
                ) {
                    return (
                        <Marker
                            key={hotel.id}
                            position={[hotel.location.coordinates[1], hotel.location.coordinates[0]]}
                            icon={customIcon}
                        >
                            <Popup>
                                <strong>{hotel.type === 'hotel' ? hotel.name : `${hotel.type} - ${hotel.name}`}</strong>
                                <br />
                                Dirección: {hotel.address}
                                <br />
                                Ciudad: {hotel.city}
                                {hotel.type === 'hotel' ? (
                                    <>
                                        {hotel.phone && (
                                            <>
                                                <br />
                                                Teléfono: {hotel.phone}
                                            </>
                                        )}
                                        {hotel.employees != null && (
                                            <>
                                                <br />
                                                Empleados: {hotel.employees}
                                            </>
                                        )}
                                        {hotel.services && hotel.services.length > 0 && (
                                            <>
                                                <br />
                                                Servicios: {hotel.services.join(', ')}
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {hotel.price != null && (
                                            <>
                                                <br />
                                                Precio: ${hotel.price}
                                            </>
                                        )}
                                    </>
                                )}
                            </Popup>
                        </Marker>
                    );
                }
                return null;
            })}
            {tempLocation && (
                <Marker position={tempLocation} icon={tempIcon}>
                    <Popup>Nueva ubicación</Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
