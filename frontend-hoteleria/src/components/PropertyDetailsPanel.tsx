import React from 'react';
import { Hotel } from '@/types/hotel';

interface PropertyDetailsPanelProps {
    property: Hotel;
    onBack: () => void;
}

export default function PropertyDetailsPanel({ property }: PropertyDetailsPanelProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 w-full h-full flex flex-col justify-start max-h-[calc(100vh-32px)] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-primary text-center mt-2">{property.name}</h2>
            <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-md">
                    <div className="mb-4 text-center">
                        <span className="font-semibold block">Tipo:</span>
                        <span className="block text-gray-700">{property.type}</span>
                    </div>
                    <div className="mb-4 text-center">
                        <span className="font-semibold block">Dirección:</span>
                        <span className="block text-gray-700 break-words">{property.address}</span>
                    </div>
                    <div className="mb-4 text-center">
                        <span className="font-semibold block">Ciudad:</span>
                        <span className="block text-gray-700">{property.city}</span>
                    </div>
                    {property.phone && (
                        <div className="mb-4 text-center">
                            <span className="font-semibold block">Teléfono:</span>
                            <span className="block text-gray-700">{property.phone}</span>
                        </div>
                    )}
                    {property.employees != null && (
                        <div className="mb-4 text-center">
                            <span className="font-semibold block">Empleados:</span>
                            <span className="block text-gray-700">{property.employees}</span>
                        </div>
                    )}
                    {property.managerName && (
                        <div className="mb-4 text-center">
                            <span className="font-semibold block">Gerente:</span>
                            <span className="block text-gray-700">{property.managerName}</span>
                        </div>
                    )}
                    {property.managerEmail && (
                        <div className="mb-4 text-center">
                            <span className="font-semibold block">Email Gerente:</span>
                            <span className="block text-gray-700">{property.managerEmail}</span>
                        </div>
                    )}
                    {property.services && property.services.length > 0 && (
                        <div className="mb-4 text-center">
                            <span className="font-semibold block">Servicios:</span>
                            <span className="block text-gray-700">{property.services.join(', ')}</span>
                        </div>
                    )}
                    {property.price != null && (
                        <div className="mb-4 text-center">
                            <span className="font-semibold block">Precio:</span>
                            <span className="block text-gray-700">${property.price}</span>
                        </div>
                    )}
                    {property.images && property.images.length > 0 && (
                        <div className="mb-4 text-center">
                            <span className="font-semibold block mb-1">Imágenes:</span>
                            <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
                                {property.images.map((img, idx) => {
                                    const src = img.startsWith('http') ? img : `http://localhost:3000${img.startsWith('/') ? img : '/uploads/' + img}`;
                                    return (
                                        <div key={idx} className="flex flex-col items-center">
                                            <img
                                                src={src}
                                                alt={`Imagen ${idx + 1}`}
                                                className="w-40 h-40 object-cover rounded border flex-shrink-0 bg-gray-100"
                                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.png'; }}
                                            />
                                            <span className="text-xs text-gray-500 mt-1">Imagen {idx + 1}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 