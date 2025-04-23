'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                email,
                password,
            });
            localStorage.setItem('token', response.data.access_token);
            router.push('/');
        } catch (err) {
            setError('Credenciales inválidas');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 relative">
            <div className="absolute inset-0 z-0 opacity-60">
                <Image
                    src="/fondo.jpg"
                    alt="Fondo de login"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
            </div>

            <div className="bg-white p-8 rounded-lg shadow-xl w-96 z-10 border border-gray-200">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">Iniciar Sesión</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-2"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
