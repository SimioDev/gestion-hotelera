import Swal from 'sweetalert2';

interface UserInfoProps {
    user: { id: number; email: string; chainName: string | null } | null;
    token: string | null;
    onUpdateChainName: (newChainName: string) => void;
}

export default function UserInfo({ user, token, onUpdateChainName }: UserInfoProps) {
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
                const response = await fetch('http://localhost:3000/users/me/chain-name', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ chainName: value }),
                });
                if (!response.ok) throw new Error('Error al actualizar el nombre de la cadena');
                const updatedUser = await response.json();
                onUpdateChainName(updatedUser.chainName);
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
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-text">Información del Usuario</h2>
            <p className="text-sm text-gray-600 mt-2">
                Nombre de la cadena: {user?.chainName || 'Sin nombre'}
            </p>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
            <button
                onClick={handleUpdateChainName}
                className="mt-2 w-full bg-primary text-secondary py-2 rounded-md hover:bg-opacity-90"
            >
                Editar nombre de la cadena
            </button>
        </div>
    );
}
