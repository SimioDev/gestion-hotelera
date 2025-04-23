import { Hotel } from '@/types/hotel';
import { FaTrash } from 'react-icons/fa';

interface HotelListProps {
    hotels: Hotel[];
    onSelectHotel: (hotel: Hotel) => void;
    onDeleteHotel: (id: number) => void;
}

export default function HotelList({ hotels, onSelectHotel, onDeleteHotel }: HotelListProps) {
    return (
        <div className="space-y-4">
            {hotels.map((hotel) => (
                <div
                    key={hotel.id}
                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow relative cursor-pointer"
                    onClick={() => onSelectHotel(hotel)}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteHotel(hotel.id);
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        title="Eliminar"
                    >
                        <FaTrash size={16} />
                    </button>
                    <h2 className="text-lg font-semibold text-text">
                        {hotel.type === 'hotel' ? hotel.name : `${hotel.type} - ${hotel.name}`}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">Dirección: {hotel.address}</p>
                    <p className="text-sm text-gray-500">Ciudad: {hotel.city}</p>
                    {hotel.type === 'hotel' ? (
                        <>
                            {hotel.phone && <p className="text-sm text-gray-500">Teléfono: {hotel.phone}</p>}
                            {hotel.employees != null && (
                                <p className="text-sm text-gray-500">Empleados: {hotel.employees}</p>
                            )}
                            {hotel.managerName && <p className="text-sm text-gray-500">Gerente: {hotel.managerName}</p>}
                            {hotel.managerEmail && (
                                <p className="text-sm text-gray-500">Email Gerente: {hotel.managerEmail}</p>
                            )}
                            {hotel.services && hotel.services.length > 0 && (
                                <p className="text-sm text-gray-500">Servicios: {hotel.services.join(', ')}</p>
                            )}
                            {hotel.logoUrl && (
                                <img src={hotel.logoUrl} alt="Logo" className="w-16 h-16 mt-2 object-cover" />
                            )}
                        </>
                    ) : (
                        <>
                            {hotel.price != null && <p className="text-sm text-gray-500">Precio: ${hotel.price}</p>}
                        </>
                    )}
                    {hotel.images && hotel.images.length > 0 && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Imágenes:</p>
                            <div className="flex space-x-2">
                                {hotel.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Imagen ${index + 1}`}
                                        className="w-16 h-16 object-cover"
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
