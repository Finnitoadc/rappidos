"use client";
import Head from 'next/head';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    city: '',
    description: '',
    transportType: 'moto',
    packages: 1,
  });

  const [userId, setUserId] = useState('');
  const [clientId, setClientId] = useState('');

  const [sucursales, setSucursales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSucursal, setEditingSucursal] = useState(null);
  const [nuevaSucursal, setNuevaSucursal] = useState({ nombre: '', direccion: '', telefono: '' });
  const dialogRef = useRef(null);
  const nuevaSucursalDialogRef = useRef(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    const clientID = localStorage.getItem('clienteID');
    if (id && clientID) {
      setUserId(id);
      setClientId(clientID);
    }
  }, []);

  useEffect(() => {
    const fetchSucursales = async (clientId) => {
      try {
        const response = await fetch(`http://localhost:5000/api/sucursales/cliente/${clientId}`);
        if (!response.ok) {
          throw new Error('La respuesta no fue OK');
        }
        const data = await response.json();
        console.log('Sucursales:', data);
        setSucursales(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    if (clientId) {
      fetchSucursales(clientId);
    }
  }, [clientId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos del formulario enviado:', formData);

    if (userId && clientId) {
      try {
        const response = await fetch('http://localhost:5000/api/servicios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clienteID: clientId,
            usuarioID: userId,
            fecha_solicitud: new Date().toISOString(),
            tipo_transporte: formData.transportType,
            numero_paquetes: formData.packages,
            estado: 'Solicitado',
            origen: formData.origin,
            destino: formData.destination,
            ciudad: formData.city,
            descripcion: formData.description,
          }),
        });

        if (!response.ok) {
          throw new Error('Error enviando formulario');
        }

        const data = await response.json();
        console.log('Envio de formulario exitoso:', data);
      } catch (error) {
        console.error('Error:', error);
      }
    } else {
      console.error('ID del cliente o usuario no encontrado. Por favor iniciar sesión.');
    }
  };

  const filteredSucursales = sucursales.filter(sucursal => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      sucursal.id.toString().includes(searchTermLower) ||
      sucursal.nombre.toLowerCase().includes(searchTermLower)
    );
  });

  const handleEdit = (sucursal) => {
    setEditingSucursal({ ...sucursal });
    dialogRef.current.showModal();
  };

  const handleDelete = async (sucursalId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta sucursal?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/sucursales/${sucursalId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setSucursales(sucursales.filter(s => s.id !== sucursalId));
          console.log("Sucursal eliminada con éxito");
        } else {
          console.error("Error al eliminar sucursal");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (window.confirm("¿Estás seguro de que quieres guardar estos cambios?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/sucursales/${editingSucursal.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingSucursal),
        });
        if (res.ok) {
          setSucursales(sucursales.map(s => s.id === editingSucursal.id ? editingSucursal : s));
          dialogRef.current.close();
          console.log("Sucursal actualizada con éxito");
        } else {
          console.error("Error al actualizar sucursal");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleCreateSucursal = async () => {
    if (window.confirm("¿Estás seguro de que quieres crear esta sucursal?")) {
      try {
        const res = await fetch('http://localhost:5000/api/sucursales', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clienteID: clientId,
            telefono: nuevaSucursal.telefono,
            nombre: nuevaSucursal.nombre,
            direccion: nuevaSucursal.direccion,
          }),
        });
        if (res.ok) {
          const newBranch = await res.json();
          setSucursales([...sucursales, newBranch]);
          nuevaSucursalDialogRef.current.close();
          console.log("Sucursal creada con éxito");
        } else {
          console.error("Error al crear sucursal");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Panel de Control</title>
        <link rel="icon" href="/favicon-192.png" />
      </Head>
      <Navbar />
      <Sidebar />
      <main className="pt-20 md:ml-64 p-4">
        <section className="mt-8">
          <div className="card bg-gray-800 shadow">
            <div className="card-body">
              <h2 className="card-title">Solicitud de Servicio de Transporte</h2>
              <div className="flex items-center justify-center text-white">
                <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 shadow-lg rounded-xl">
                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-white">Origen</span>
                      </label>
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        placeholder="Ingrese el origen"
                        className="input input-bordered bg-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-white">Destino</span>
                      </label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="Ingrese el destino"
                        className="input input-bordered bg-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-white">Ciudad</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Ingrese la ciudad"
                        className="input input-bordered bg-gray-700 text-white"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-white">Descripción</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Ingrese una descripción"
                        className="textarea textarea-bordered bg-gray-700 text-white"
                        required
                      ></textarea>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-white">Tipo de Transporte</span>
                      </label>
                      <select
                        name="transportType"
                        value={formData.transportType}
                        onChange={handleChange}
                        className="select select-bordered bg-gray-700 text-white"
                        required
                      >
                        <option value="moto">Moto</option>
                        <option value="carro">Carro</option>
                        <option value="camion">Camión</option>
                      </select>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-white">Número de Paquetes</span>
                      </label>
                      <input
                        type="number"
                        name="packages"
                        value={formData.packages}
                        onChange={handleChange}
                        placeholder="Ingrese el número de paquetes"
                        className="input input-bordered bg-gray-700 text-white"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <button type="submit" className="btn btn-primary w-full">
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="card bg-gray-800 shadow">
            <div className="card-body">
              <h2 className="card-title">Sucursales</h2>
              <section className="flex items-center mb-4">
                <div className="form-control mr-4">
                  <input 
                    type="text" 
                    placeholder="Buscar por ID o nombre de la sucursal" 
                    className="input input-bordered w-full bg-gray-700 text-white" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button onClick={() => nuevaSucursalDialogRef.current.showModal()} className="btn btn-primary">Crear Sucursal</button>
              </section>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Dirección</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSucursales.map((sucursal) => (
                      <tr key={sucursal.id}>
                        <td>{sucursal.id}</td>
                        <td>{sucursal.nombre}</td>
                        <td>{sucursal.direccion}</td>
                        <td>{sucursal.telefono}</td>
                        <td>
                          <button onClick={() => handleEdit(sucursal)} className="btn btn-sm btn-info mr-2">Editar</button>
                          <button onClick={() => handleDelete(sucursal.id)} className="btn btn-sm btn-error">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal de Edición */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box bg-gray-800 text-white">
          <h3 className="font-bold text-lg">Editar Sucursal</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Nombre</span>
              </label>
              <input 
                type="text" 
                value={editingSucursal?.nombre || ''} 
                onChange={e => setEditingSucursal({...editingSucursal, nombre: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Dirección</span>
              </label>
              <input 
                type="text" 
                value={editingSucursal?.direccion || ''} 
                onChange={e => setEditingSucursal({...editingSucursal, direccion: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Teléfono</span>
              </label>
              <input 
                type="tel" 
                value={editingSucursal?.telefono || ''} 
                onChange={e => setEditingSucursal({...editingSucursal, telefono: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
          </div>
          <div className="modal-action">
            <button onClick={handleSaveEdit} className="btn btn-success">Guardar</button>
            <form method="dialog">
              <button className="btn btn-error">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Modal de Creación */}
      <dialog ref={nuevaSucursalDialogRef} className="modal">
        <div className="modal-box bg-gray-800 text-white">
          <h3 className="font-bold text-lg">Crear Sucursal</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Nombre</span>
              </label>
              <input 
                type="text" 
                value={nuevaSucursal.nombre}
                onChange={e => setNuevaSucursal({...nuevaSucursal, nombre: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Dirección</span>
              </label>
              <input 
                type="text" 
                value={nuevaSucursal.direccion}
                onChange={e => setNuevaSucursal({...nuevaSucursal, direccion: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Teléfono</span>
              </label>
              <input 
                type="tel" 
                value={nuevaSucursal.telefono}
                onChange={e => setNuevaSucursal({...nuevaSucursal, telefono: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
          </div>
          <div className="modal-action">
            <button onClick={handleCreateSucursal} className="btn btn-success">Guardar</button>
            <form method="dialog">
              <button className="btn btn-error">Cerrar</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
