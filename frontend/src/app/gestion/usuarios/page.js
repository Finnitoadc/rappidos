"use client"
import Head from 'next/head';
import Navbar from '../../components/navbar';
import Sidebar from '../../components/sidebar';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUsuario, setEditingUsuario] = useState(null);
  const dialogRef = useRef(null);


  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/usuarios/');
        const data = await res.json();
        console.log('Usuarios:', data);
        setUsuarios(data);
      } catch (error) {
        console.error("Error buscando usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const filteredUsuarios = usuarios.filter(usuario => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      usuario.id.toString().includes(searchTermLower) ||
      usuario.login.toLowerCase().includes(searchTermLower)
    );
  });

  const handleEdit = (usuario) => {
    setEditingUsuario({ ...usuario });
    dialogRef.current.showModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          setUsuarios(usuarios.filter(c => c.id !== id));
          console.log("usuario eliminado con éxito");
          fetchUsuarios();
        } else {
          console.error("Error al eliminar usuario");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  
  const handleSaveEdit = async () => {
    if (window.confirm("¿Estás seguro de que quieres guardar estos cambios?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/usuarios/${editingUsuario.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingUsuario),
        });
        if (res.ok) {
          setUsuarios(usuarios.map(c => c.id === editingUsuario.id ? editingUsuario : c));
          dialogRef.current.close();
          console.log("usuario actualizado con éxito");
          fetchUsuarios();
        } else {
          console.error("Error al actualizar usuario");
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
      {/* Contenido principal */}
      <main className="pt-20 md:ml-64 p-4">
        {/* Sección de usuarios */}
        <section className="mt-8">
          <div className="card bg-gray-800 shadow">
            <div className="card-body">
              <h2 className="card-title">Usuarios</h2>
              <section className="mt-3">
                <div>
                  <input 
                    type="text" 
                    placeholder="Buscar por ID o login del usuario" 
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
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.id}</td>
                        <td>{usuario.login}</td>
                        <td>{usuario.direccion}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.telefono}</td>
                        <td>
                          <button onClick={() => handleEdit(usuario)} className="btn btn-sm btn-info mr-2">Editar</button>
                          <button onClick={() => handleDelete(usuario.id)} className="btn btn-sm btn-error">Eliminar</button>
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
          <h3 className="font-bold text-lg">Editar Usuario</h3>
          <div className="py-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Nombre</span>
              </label>
              <input 
                type="text" 
                value={editingUsuario?.login || ''} 
                onChange={e => setEditingUsuario({...editingUsuario, login: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Dirección</span>
              </label>
              <input 
                type="text" 
                value={editingUsuario?.direccion || ''} 
                onChange={e => setEditingUsuario({...editingUsuario, direccion: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Email</span>
              </label>
              <input 
                type="email" 
                value={editingUsuario?.email || ''} 
                onChange={e => setEditingUsuario({...editingUsuario, email: e.target.value})}
                className="input input-bordered bg-gray-700 text-white"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-white">Teléfono</span>
              </label>
              <input 
                type="tel" 
                value={editingUsuario?.telefono || ''} 
                onChange={e => setEditingUsuario({...editingUsuario, telefono: e.target.value})}
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