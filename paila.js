import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Home() {
    // ... (El código anterior se mantiene igual)

    return (
        <div className="min-h-screen bg-gray-100 text-black">
            <Head>
                <title>Panel de Control</title>
                <link rel="icon" href="/favicon-192.png" />
            </Head>
            <Navbar />
            <Sidebar />
            <main className="pt-20 md:ml-64 p-4">
                <section className="mt-8">
                    <div className="card bg-white shadow">
                        <div className="card-body">
                            <h2 className="card-title">Solicitud de Servicio de Transporte</h2>
                            <div className="flex items-center justify-center min-h-screen text-white">
                                <div className="w-full max-w-md p-8 space-y-6 bg-base-100 shadow-lg rounded-xl">
                                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Origen</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="origin"
                                                value={formData.origin}
                                                onChange={handleChange}
                                                placeholder="Ingrese el origen"
                                                className="input input-bordered"
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Destino</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="destination"
                                                value={formData.destination}
                                                onChange={handleChange}
                                                placeholder="Ingrese el destino"
                                                className="input input-bordered"
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Ciudad</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="Ingrese la ciudad"
                                                className="input input-bordered"
                                                required
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Descripción</span>
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                placeholder="Ingrese una descripción"
                                                className="textarea textarea-bordered"
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Tipo de Transporte</span>
                                            </label>
                                            <select
                                                name="transportType"
                                                value={formData.transportType}
                                                onChange={handleChange}
                                                className="select select-bordered"
                                                required
                                            >
                                                <option value="moto">Moto</option>
                                                <option value="carro">Carro</option>
                                                <option value="camion">Camión</option>
                                            </select>
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text">Número de Paquetes</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="packages"
                                                value={formData.packages}
                                                onChange={handleChange}
                                                placeholder="Ingrese el número de paquetes"
                                                className="input input-bordered"
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
                    <div className="card bg-white shadow">
                        <div className="card-body">
                            <h2 className="card-title">Sucursales</h2>
                            <section className="flex items-center mb-4">
                                <div className="card bg-white shadow">
                                    <div className="card-body">
                                        <h2 className="card-title">Sucursales</h2>
                                        <section className="flex items-center mb-4">
                                            <div className="form-control mr-4">
                                                <input
                                                    type="text"
                                                    placeholder="Buscar por ID o nombre de la sucursal"
                                                    className="input input-bordered w-full text-white"
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
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}