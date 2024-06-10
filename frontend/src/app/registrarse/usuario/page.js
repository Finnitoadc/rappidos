// pages/login.js
'use client'
import React, { useState } from 'react';

const Register = () => {
 
  const [clienteID, setClienteID] = useState('');
  const [login, setLogin] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [direccion, setDireccion] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({clienteID , login, contrasena, direccion, email, telefono }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log('Error:', res.status, errorData);
        throw new Error(`Error: ${res.status} - ${errorData.message || 'Server Error'}`);
      }

      const data = await res.json();
      console.log('Usuario registrado:', data);

      // Resetear los campos del formulario
      setClienteID('');
      setLogin('');
      setContrasena('');
      setDireccion('');
      setEmail('');
      setTelefono('');

      // Mostrar mensaje de éxito (puedes usar un toast o un componente de alerta)
      alert('Usuario registrado con éxito');

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
        <h2 className="text-2xl font-bold text-center">Registrar Nuevo Usuario</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Usuario</span>
            </label>
            <input
              type="text"
              placeholder="Usuario"
              className="input input-bordered"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
            />
            <label className="label">
              <span className="label-text">ClienteID</span>
            </label>
            <input
              type="text"
              placeholder="ClienteID"
              className="input input-bordered"
              value={clienteID}
              onChange={(e) => setClienteID(e.target.value)}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Contraseña</span>
            </label>
            <input
              type="contrasena"
              placeholder="Contraseña"
              className="input input-bordered"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Email"
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
            <button type="submit" className="btn btn-primary w-full">
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
