// pages/login.js
'use client'
import React, { useState } from 'react';


const Register = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, direccion, ciudad, email, telefono }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Error:', res.status, errorData);
        throw new Error(`Error: ${res.status} - ${errorData.message || 'Server Error'}`);
      }

      const data = await res.json();
      console.log('Cliente registrado:', data);

      // Resetear los campos del formulario
      setNombre('');
      setDireccion('');
      setCiudad('');
      setEmail('');
      setTelefono('');

      // Mostrar mensaje de éxito (puedes usar un toast o un componente de alerta)
      alert('Cliente registrado con éxito');

    } catch (error) {
      console.error("Error registrando cliente:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-base-100 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center">Registrar Nuevo Cliente</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Nombre</span>
            </label>
            <input
              type="text"
              placeholder="Nombre"
              className="input input-bordered"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Dirección</span>
            </label>
            <input
              type="text"
              placeholder="Dirección"
              className="input input-bordered"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Ciudad</span>
            </label>
            <input
              type="text"
              placeholder="Ciudad"
              className="input input-bordered"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Correo</span>
            </label>
            <input
              type="email"
              placeholder="Correo"
              className="input input-bordered"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Teléfono</span>
            </label>
            <input
              type="tel"
              placeholder="Teléfono"
              className="input input-bordered"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
          {error && (
            <div className="alert alert-error mt-4">
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
