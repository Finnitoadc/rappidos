"use client"
import React, { useEffect, useState } from 'react';

const MensajeroPage = () => {
  const [mensajeroId, setMensajeroId] = useState('');
  const [password, setPassword] = useState('');
  const [servicios, setServicios] = useState([]);
  const [solicitados, setSolicitados] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_MENSAJERO_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  useEffect(() => {
    if (isAuthenticated && mensajeroId) {
      const fetchServicios = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/servicios/mensajeros/${mensajeroId}`);
          if (!response.ok) {
            throw new Error('La respuesta no fue OK');
          }
          const data = await response.json();
          setServicios(data);
        } catch (error) {
          console.error('Error buscando en servicios:', error);
        }
      };

      fetchServicios();
    }
  }, [isAuthenticated, mensajeroId]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchSolicitados = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/servicios/solicitados');
          if (!response.ok) {
            throw new Error('La respuesta no fue correcta OK');
          }
          const data = await response.json();
          setSolicitados(data);
        } catch (error) {
          console.error('Error buscando solicitados:', error);
        }
      };

      fetchSolicitados();
    }
  }, [isAuthenticated]);

  const handleEntregado = async (servicioId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/servicios/${servicioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: 'Entregado',
          mensajeroID: mensajeroId
        })
      });

      if (response.ok) {
        const updatedServicios = servicios.map(servicio =>
          servicio.id === servicioId ? { ...servicio, estado: 'Entregado' } : servicio
        );
        setServicios(updatedServicios);
      } else {
        console.error('Error actualizando estado del servicio ');
      }
    } catch (error) {
      console.error('Error actualizando estado del servicio :', error);
    }
  };

  const handleRecoger = async (servicioId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/servicios/${servicioId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: 'Recogido',
          mensajeroID: mensajeroId
        })
      });

      if (response.ok) {
        const updatedSolicitados = solicitados.map(servicio =>
          servicio.id === servicioId ? { ...servicio, estado: 'Recogido', mensajeroID: mensajeroId } : servicio
        );
        setSolicitados(updatedSolicitados);
      } else {
        console.error('Error actualizando estado del servicio ');
      }
    } catch (error) {
      console.error('Error actualizando estado del servicio :', error);
    }
  };

  const SubirFoto = ({ servicioId }) => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
      setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('id', servicioId);

      try {
        const response = await fetch('http://localhost:5000/api/servicios/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('Imagen subida con éxito');
        } else {
          alert('Error al subir la imagen');
        }
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        alert('Error al subir la imagen');
      }
    };

    return (
      <div className="mt-3">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-bordered file-input-primary bg-gray-700 text-white"
        />
        <button
          onClick={handleUpload}
          className="btn btn-primary mt-3"
        >
          Subir Imagen
        </button>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="w-full max-w-xl p-8 space-y-6 bg-gray-800 shadow-xl rounded-2xl">
          <h2 className="text-3xl font-bold text-center text-primary">Iniciar Sesión</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="ID del Mensajero"
              value={mensajeroId}
              onChange={(e) => setMensajeroId(e.target.value)}
              className="input input-bordered w-full bg-gray-700 text-white"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-gray-700 text-white"
            />
            <button onClick={handleLogin} className="btn btn-primary w-full">Entrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full p-8 space-y-6 bg-gray-800 shadow-xl rounded-2xl lg:max-w-4xl">
        <h2 className="text-3xl font-bold text-center text-primary">Pedidos del Mensajero</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
            <tr>
                <th className="bg-neutral text-neutral-content">Pedido ID</th>
                <th className="bg-neutral text-neutral-content">Estado</th>
                <th className="bg-neutral text-neutral-content">Origen</th>
                <th className="bg-neutral text-neutral-content">Destino</th>
                <th className="bg-neutral text-neutral-content">Ciudad</th>
                <th className="bg-neutral text-neutral-content">Acciones</th>
                <th className="bg-neutral text-neutral-content">Foto</th>
              </tr>
            </thead>
            <tbody>
              {servicios.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-700">
                  <td>{servicio.id}</td>
                  <td>{servicio.estado}</td>
                  <td>{servicio.origen}</td>
                  <td>{servicio.destino}</td>
                  <td>{servicio.ciudad}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success mr-2"
                      onClick={() => handleEntregado(servicio.id)}
                      disabled={servicio.estado === 'Entregado'}
                    >
                      Entregado
                    </button>
                    
                  </td>
                  <SubirFoto servicioId={servicio.id} /> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="text-3xl font-bold text-center text-primary">Pedidos Solicitados</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-neutral text-neutral-content">Pedido ID</th>
                <th className="bg-neutral text-neutral-content">Estado</th>
                <th className="bg-neutral text-neutral-content">Origen</th>
                <th className="bg-neutral text-neutral-content">Destino</th>
                <th className="bg-neutral text-neutral-content">Ciudad</th>
                <th className="bg-neutral text-neutral-content">Acciones</th>
                <th className="bg-neutral text-neutral-content">Foto</th>
              </tr>
            </thead>
            <tbody>
              {solicitados.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-700">
                  <td>{servicio.id}</td>
                  <td>{servicio.estado}</td>
                  <td>{servicio.origen}</td>
                  <td>{servicio.destino}</td>
                  <td>{servicio.ciudad}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning mr-2"
                      onClick={() => handleRecoger(servicio.id)}
                      disabled={servicio.estado !== 'Solicitado'}
                    >
                      Recoger
                    </button>
                  </td>
                  <td> <SubirFoto servicioId={servicio.id} /> </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MensajeroPage;
