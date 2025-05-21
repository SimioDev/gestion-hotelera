import { FaSignOutAlt, FaHome, FaUser, FaPlus } from 'react-icons/fa';
import HotelList from './HotelList';
import UserInfo from './UserInfo';
import CreateForm from './CreateForm';
import { Hotel } from '@/types/hotel';
import { useState } from 'react';
import PropertyDetailsPanel from './PropertyDetailsPanel';

interface SidebarProps {
    view: 'general' | 'user' | 'create';
    setView: (view: 'general' | 'user' | 'create') => void;
    hotels: Hotel[];
    user: { id: number; email: string; chainName: string | null } | null;
    token: string | null;
    onSelectHotel: (hotel: Hotel) => void;
    onDeleteHotel: (id: number) => void;
    onUpdateChainName: (newChainName: string) => void;
    onCreateHotel: (newHotel: any) => void;
    onMapClick: (lat: number, lon: number) => void;
    tempLocation: [number, number] | null;
    setTempLocation: (location: [number, number] | null) => void;
    setMapCenter: (center: [number, number]) => void;
    onLogout: () => void;
}

export default function Sidebar({
    view,
    setView,
    hotels,
    user,
    token,
    onSelectHotel,
    onDeleteHotel,
    onUpdateChainName,
    onCreateHotel,
    onMapClick,
    tempLocation,
    setTempLocation,
    setMapCenter,
    onLogout,
}: SidebarProps) {
    const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

    const handleShowDetails = (hotel: Hotel) => {
        setSelectedHotel(hotel);
    };
    const handleBackToList = () => {
        setSelectedHotel(null);
    };
    const handleHomeClick = () => {
        setView('general');
        setSelectedHotel(null);
    };

    return (
        <div className="w-1/4 p-4 bg-gray-100 overflow-y-auto h-screen">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-primary">EliteStay Manager</h1>
                <button
                    onClick={onLogout}
                    className="text-primary hover:text-opacity-80 flex items-center"
                    title="Cerrar sesión"
                >
                    <FaSignOutAlt size={20} />
                </button>
            </div>
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={handleHomeClick}
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
                    title="Crear Propiedad/Hotel"
                >
                    <FaPlus size={20} />
                </button>
            </div>

            {view === 'general' && !selectedHotel && (
                hotels.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        Actualmente no cuentas con ningún registro.
                    </div>
                ) : (
                    <HotelList hotels={hotels} onSelectHotel={onSelectHotel} onDeleteHotel={onDeleteHotel} onShowDetails={handleShowDetails} />
                )
            )}

            {view === 'general' && selectedHotel && (
                <PropertyDetailsPanel property={selectedHotel} onBack={handleBackToList} />
            )}

            {view === 'user' && (
                <UserInfo user={user} token={token} onUpdateChainName={onUpdateChainName} />
            )}

            {view === 'create' && (
                <CreateForm
                    token={token}
                    userChainName={user?.chainName}
                    onCreate={onCreateHotel}
                    onMapClick={onMapClick}
                    tempLocation={tempLocation}
                    setTempLocation={setTempLocation}
                    setMapCenter={setMapCenter}
                />
            )}
        </div>
    );
}