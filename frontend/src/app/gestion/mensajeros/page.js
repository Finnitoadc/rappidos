"use client"
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';

export default function Home() {
  const [mensajeros, setMensajeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMensajero, setEditingMensajero] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const fetchMensajeros = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mensajeros');
        const data = await response.json();
        console.log('Mensajeros:', data);
        setMensajeros(data);
        setLoading(false);
      } catch (error) {
        console.error('Error buscando mensajeros:', error);
        setLoading(false);
      }
    };

    fetchMensajeros();
  }, []);

  const handleEdit = (mensajero) => {
    setEditingMensajero({ ...mensajero });
    dialogRef.current.showModal();
  };

  const handleCreateMensajero = () => {
    setEditingMensajero({}); // Establecer un objeto vacío para un nuevo mensajero
    dialogRef.current.showModal();
  };

  const handleDelete = async (mensajeroId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este mensajero?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/mensajeros/${mensajeroId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setMensajeros(mensajeros.filter(m => m.id !== mensajeroId));
          console.log("Mensajero eliminado con éxito");
        } else {
          console.error("Error al eliminar mensajero");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (window.confirm("¿Estás seguro de que quieres guardar estos cambios?")) {
      try {
        const res = editingMensajero.id
          ? await fetch(`http://localhost:5000/api/mensajeros/${editingMensajero.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(editingMensajero),
            })
          : await fetch('http://localhost:5000/api/mensajeros', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(editingMensajero),
            });
  
        if (res.ok) {
          if (editingMensajero.id) {
            setMensajeros(mensajeros.map(m => m.id === editingMensajero.id ? editingMensajero : m));
          } else {
            const nuevoMensajero = await res.json();
            setMensajeros([...mensajeros, nuevoMensajero]);
          }
          dialogRef.current.close();
          console.log("Mensajero guardado con éxito");
        } else {
          console.error("Error al guardar mensajero");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const mensajerosFiltrados = mensajeros.filter(mensajero => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      mensajero.id.toString().includes(searchTermLower) ||
      mensajero.nombre.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-900 text-base-content">
      <Head>
        <title>Panel de Control</title>
        <link rel="icon" href="/favicon-192.png" />
      </Head>
      <Navbar />
      <Sidebar />
      <main className="pt-20 md:ml-64 p-4">
        <section className="mt-8">
          <div className="card bg-gray-800 shadow-xl">
            <div className="card-body">
              <button
                onClick={handleCreateMensajero}
                className="btn btn-primary btn-sm mb-3"
              >
                Crear Mensajero
              </button>
              <h2 className="card-title">Mensajeros</h2>
              <div className="form-control mb-4">
                <input
                  type="text"
                  placeholder="Buscar por ID o nombre del mensajero"
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Dirección</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center">Cargando...</td>
                      </tr>
                    ) : (
                      mensajerosFiltrados.map((mensajero) => (
                        <tr key={mensajero.id} className="hover:bg-base-300">
                          <td>{mensajero.id}</td>
                          <td>{mensajero.nombre}</td>
                          <td>{mensajero.direccion}</td>
                          <td>{mensajero.email}</td>
                          <td>{mensajero.telefono}</td>
                          <td>
                            <button onClick={() => handleEdit(mensajero)} className="btn btn-sm btn-info mr-2">Editar</button>
                            <button onClick={() => handleDelete(mensajero.id)} className="btn btn-sm btn-error">Eliminar</button>
                          </td>
                        </tr>
                      ))
                    )}
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
          <h3 className="font-bold text-lg">Editar Mensajero</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                value={editingMensajero?.nombre || ''}
                onChange={e => setEditingMensajero({ ...editingMensajero, nombre: e.target.value })}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Dirección</span>
              </label>
              <input
                type="text"
                value={editingMensajero?.direccion || ''}
                onChange={e => setEditingMensajero({ ...editingMensajero, direccion: e.target.value })}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={editingMensajero?.email || ''}
                onChange={e => setEditingMensajero({ ...editingMensajero, email: e.target.value })}
                className="input input-bordered"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Teléfono</span>
              </label>
              <input
                type="tel"
                value={editingMensajero?.telefono || ''}
                onChange={e => setEditingMensajero({ ...editingMensajero, telefono: e.target.value })}
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
