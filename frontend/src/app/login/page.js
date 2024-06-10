// pages/login.js
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/usuarios/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena: password }),
      });

      if (!response.ok) {
        throw new Error('Credenciales de inicio de sesion invalidas');
      }

      const data = await response.json();
      console.log('Inicio de sesion exitoso', data);

      // Almacenar el ID del usuario y el clienteID en el localStorage
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('clienteID', data.user.clienteID);

      // Redirigir a la interfaz con los IDs
      router.push(`/interface?userId=${data.user.id}&clienteID=${data.user.clienteID}`);
    } catch (error) {
      console.error('Error:', error);
      setError('Inicio de sesion fallido. Por favor verifica tu correo y contraseña.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-base-100 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500">{error}</p>}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email address</span>
            </label>
            <input
              type="email"
              placeholder="Email address"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="checkbox" />
              <span className="ml-2 text-sm">Remember me</span>
            </label>
            <a href="/registrarse/usuario" className="text-sm link link-hover">
              Crear cuenta
            </a>
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
