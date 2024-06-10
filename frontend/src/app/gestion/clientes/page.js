"use client"
import Head from 'next/head';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/clientes');
        const data = await res.json();
        console.log('Clientes:', data);
        setClientes(data);
      } catch (error) {
        console.error("Error buscando clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(cliente => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      cliente.ID_cliente.toString().includes(searchTermLower) ||
      cliente.nombre.toLowerCase().includes(searchTermLower)
    );
  });

  

  const handleEdit = (cliente) => {
    setEditingCliente({ ...cliente });
    dialogRef.current.showModal();
  };

  const handleDelete = async (clienteId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/clientes/${clienteId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setClientes(clientes.filter(c => c.ID_cliente !== clienteId));
          console.log("Cliente eliminado con éxito");
          fetchClientes();
        } else {
          console.error("Error al eliminar cliente");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  

  const handleSaveEdit = async () => {
    if (window.confirm("¿Estás seguro de que quieres guardar estos cambios?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/clientes/${editingCliente.ID_cliente}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingCliente),
        });
        if (res.ok) {
          setClientes(clientes.map(c => c.ID_cliente === editingCliente.ID_cliente ? editingCliente : c));
          dialogRef.current.close();
          console.log("Cliente actualizado con éxito");
          fetchClientes();
        } else {
          console.error("Error al actualizar cliente");
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
      {/* Main content */}
      <main className="pt-20 md:ml-64 p-4">
        {/* Sección de Clientes */}
        <section className="mt-8">
          <div className="card bg-gray-800 shadow">
            <div className="card-body">
              <h2 className="card-title">Clientes</h2>
              <section className="mt-3">
                <div>
                  <input 
                    type="text" 
                    placeholder="Buscar por ID o nombre del cliente" 
                    className="input input-bordered w-full bg-gray-700 text-white" 
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
                      <th>Ciudad</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClientes.map((cliente) => (
                      <tr key={cliente.ID_cliente}>
                        <td>{cliente.ID_cliente}</td>
                        <td>{cliente.nombre}</td>
                        <td>{cliente.direccion}</td>
                        <td>{cliente.ciudad}</td>
                        <td>{cliente.email}</td>
                        <td>{cliente.telefono}</td>
                        <td>
                          <button onClick={() => handleEdit(cliente)} className="btn btn-sm btn-info mr-2">Editar</button>
                          <button onClick={() => handleDelete(cliente.ID_cliente)} className="btn btn-sm btn-error">Eliminar</button>
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
          <h3 className="font-bold text-lg">Editar Cliente</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Nombre</span>
              </label>
              <input 
                type="text" 
                value={editingCliente?.nombre || ''} 
                onChange={e => setEditingCliente({...editingCliente, nombre: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Dirección</span>
              </label>
              <input 
                type="text" 
                value={editingCliente?.direccion || ''} 
                onChange={e => setEditingCliente({...editingCliente, direccion: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Ciudad</span>
              </label>
              <input 
                type="text" 
                value={editingCliente?.ciudad || ''} 
                onChange={e => setEditingCliente({...editingCliente, ciudad: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Email</span>
              </label>
              <input 
                type="email" 
                value={editingCliente?.email || ''} 
                onChange={e => setEditingCliente({...editingCliente, email: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Teléfono</span>
              </label>
              <input 
                type="tel" 
                value={editingCliente?.telefono || ''} 
                onChange={e => setEditingCliente({...editingCliente, telefono: e.target.value})}
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
    </div>
  );
}