import React from 'react';
import { Hotel } from '@/types/hotel';
import { FaTrash, FaInfoCircle } from 'react-icons/fa';

interface HotelListProps {
    hotels: Hotel[];
    onSelectHotel: (hotel: Hotel) => void;
    onDeleteHotel: (id: number) => void;
    onShowDetails: (hotel: Hotel) => void;
}

export default function HotelList({ hotels, onSelectHotel, onDeleteHotel, onShowDetails }: HotelListProps) {
    return (
        <div className="space-y-4">
            {hotels.map((hotel) => (
                <div
                    key={hotel.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative"
                >
                    <div className="absolute top-2 right-2 flex flex-col items-end space-y-2">
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                onDeleteHotel(hotel.id);
                            }}
                            className="text-red-500 hover:text-red-700"
                            title="Eliminar"
                        >
                            <FaTrash size={16} />
                        </button>
                        <button
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                onShowDetails(hotel);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                            title="Ver detalles"
                        >
                            <FaInfoCircle size={16} />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-text mb-2">
                        {hotel.type === 'hotel' ? hotel.name : `${hotel.type} - ${hotel.name}`}
                    </h2>
                    <p className="text-lg text-gray-700">{hotel.address}</p>
                </div>
            ))}
        </div>
    );
}
