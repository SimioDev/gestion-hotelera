import React from 'react';
import { Hotel } from '@/types/hotel';

interface PropertyDetailsPanelProps {
    property: Hotel;
    onBack: () => void;
}

export default function PropertyDetailsPanel({ property }: PropertyDetailsPanelProps) {
    const formattedPrice = property.price
        ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' })
            .format(Number(property.price))
            .replace('COP', '$')
        : null;

    const hasValidCoordinates = property.location &&
        property.location.coordinates &&
        property.location.coordinates.length === 2;

    return (
        <div className="rounded-lg shadow-lg overflow-hidden w-full h-full flex flex-col max-h-[calc(100vh-32px)]">
            <div className="bg-primary px-6 py-4">
                <h2 className="text-2xl font-bold">{property.name}</h2>
                <div className="flex justify-between items-center mt-1">
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full">
                        {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                    </span>
                    {property.price && (
                        <span className="font-semibold">{formattedPrice}</span>
                    )}
                </div>
            </div>

            {/* Contenido principal con scroll */}
            <div className="flex-1 overflow-y-auto">
                {/* Información de ubicación */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Ubicación</h3>
                    <div className="space-y-2">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-primary mt-0.5 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-gray-700">{property.address}</p>
                                <p className="text-gray-600">{property.city}</p>
                            </div>
                        </div>

                        {hasValidCoordinates && (
                            <div className="mt-2 text-sm text-gray-500">
                                <p>Lat: {property.location.coordinates[1]}, Lon: {property.location.coordinates[0]}</p>
                                <p className="mt-1 text-primary underline cursor-pointer">
                                    <a
                                        href={`https://www.google.com/maps?q=${property.location.coordinates[1]},${property.location.coordinates[0]}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Ver en Google Maps
                                    </a>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información de contacto */}
                {(property.phone || property.managerName || property.managerEmail) && (
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Información de contacto</h3>
                        <div className="space-y-2">
                            {property.phone && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <span className="text-gray-700">{property.phone}</span>
                                </div>
                            )}

                            {property.managerName && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-gray-700">{property.managerName}</span>
                                </div>
                            )}

                            {property.managerEmail && (
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span className="text-gray-700">{property.managerEmail}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Detalles específicos */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Detalles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {property.employees != null && (
                            <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                                <svg className="w-5 h-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                                <div>
                                    <span className="block text-xs text-gray-500 font-medium">Empleados</span>
                                    <span className="block text-gray-700 font-semibold">{property.employees}</span>
                                </div>
                            </div>
                        )}

                        {property.price != null && (
                            <div className="flex items-center bg-green-50 p-3 rounded-lg">
                                <svg className="w-5 h-5 text-primary mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <span className="block text-xs text-gray-500 font-medium">Precio</span>
                                    <span className="block text-gray-700 font-semibold">{formattedPrice}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Servicios */}
                {property.services && property.services.length > 0 && (
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Servicios</h3>
                        <div className="flex flex-wrap gap-2">
                            {property.services.map((service, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                                >
                                    <svg className="w-4 h-4 mr-1.5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Imágenes */}
                {property.images && property.images.length > 0 && (
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Imágenes</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {property.images.map((img, idx) => {
                                const src = img.startsWith('http') ? img : `http://localhost:3000${img.startsWith('/') ? img : '/uploads/' + img}`;
                                return (
                                    <div key={idx} className="relative group overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                        <img
                                            src={src}
                                            alt={`Imagen ${idx + 1}`}
                                            className="w-full h-40 object-cover transform group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.png'; }}
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
