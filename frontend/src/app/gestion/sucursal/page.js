"use client"
import Head from 'next/head';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { useState, useEffect, useRef } from 'react';

export default function Sucursales() {
  const [sucursales, setSucursales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSucursal, setEditingSucursal] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sucursales');
        const data = await res.json();
        console.log('Sucursales:', data);
        setSucursales(data);
      } catch (error) {
        console.error("Error buscando sucursales:", error);
      }
    };

    fetchSucursales();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <Head>
        <title>Panel de Control - Sucursales</title>
        <link rel="icon" href="/favicon-192.png" />
      </Head>
      <Navbar />
      <Sidebar />
      {/* Contenido principal */}
      <main className="pt-20 md:ml-64 p-4">
        {/* Sección de Sucursales */}
        <section className="mt-8">
          <div className="card bg-white shadow">
            <div className="card-body">
              <h2 className="card-title">Sucursales</h2>
              <section className="mt-3">
                <div>
                  <input 
                    type="text" 
                    placeholder="Buscar por ID o nombre de la sucursal" 
                    className="input input-bordered w-full text-white" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
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
        <div className="modal-box">
          <h3 className="font-bold text-lg">Editar Sucursal</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input 
                type="text" 
                value={editingSucursal?.nombre || ''} 
                onChange={e => setEditingSucursal({...editingSucursal, nombre: e.target.value})}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Dirección</span>
              </label>
              <input 
                type="text" 
                value={editingSucursal?.direccion || ''} 
                onChange={e => setEditingSucursal({...editingSucursal, direccion: e.target.value})}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Teléfono</span>
              </label>
              <input 
                type="tel" 
                value={editingSucursal?.telefono || ''} 
                onChange={e => setEditingSucursal({...editingSucursal, telefono: e.target.value})}
                className="input input-bordered"
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
    </div>
  );
}
