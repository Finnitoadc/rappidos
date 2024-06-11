"use client";
import Head from 'next/head';
import Navbar from '../app/components/navbar.js';
import Sidebar from '../app/components/sidebar.js';
import { useEffect, useState } from 'react';
import { generatePDF } from './utils/pdfUtil.js';

export default function Home() {
  const [services, setServices] = useState([]);
  const [totalEnProgreso, setTotalEnProgreso] = useState(0);
  const [totalCompletados, setTotalCompletados] = useState(0);
  const [totalMensuales, setTotalMensuales] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalMensajeros, setTotalMensajeros] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [pedidosCliente, setPedidosCliente] = useState([]);
  const [pedidosMensajero, setPedidosMensajero] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mensajeros, setMensajeros] = useState([]);
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/servicios');
        const data = await response.json();
        setServices(data);
        setTotalPedidos(data.length); 
      } catch (error) {
        console.error('Error buscando servicios:', error);
      }
    };

    const fetchEnProgreso = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/servicios/cuentas/en-progreso');
        const data = await response.json();
        setTotalEnProgreso(data.count);
      } catch (error) {
        console.error('Error buscando pedidos en progreso:', error);
      }
    };

    const fetchCompletados = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/servicios/cuentas/completados');
        const data = await response.json();
        setTotalCompletados(data.count);
      } catch (error) {
        console.error('Error buscando pedidos completados :', error);
      }
    };

    const fetchMensuales = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/servicios/cuentas/2024/06');
        const data = await response.json();
        setTotalMensuales(data.count);
      } catch (error) {
        console.error('Error buscando conteo mensual:', error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/clientes');
        const data = await response.json();
        setClientes(data);
        setTotalClientes(data.length);
      } catch (error) {
        console.error('Error buscando total de clientes:', error);
      }
    };

    const fetchMensajeros = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/mensajeros');
        const data = await response.json();
        setMensajeros(data);
        setTotalMensajeros(data.length);
      } catch (error) {
        console.error('Error buscando el total de mensajeros:', error);
      }
    };

    fetchServices();
    fetchEnProgreso();
    fetchCompletados();
    fetchMensuales();
    fetchClientes();
    fetchMensajeros();
  }, []);

  const fetchPedidos = async () => {
    try {
      const year = startDate.split('-')[0];
      const month = startDate.split('-')[1];

      const responsePedidosCliente = await fetch(`http://localhost:5000/api/servicios/mes/${year}/${month}`);
      const dataPedidosCliente = await responsePedidosCliente.json();
      setPedidosCliente(dataPedidosCliente);

      const responsePedidosMensajero = await fetch(`http://localhost:5000/api/servicios/atendidos/${year}/${month}`);
      const dataPedidosMensajero = await responsePedidosMensajero.json();
      setPedidosMensajero(dataPedidosMensajero);

      generatePDF(dataPedidosCliente, dataPedidosMensajero, clientes, mensajeros);
    } catch (error) {
      console.error('Error buscando pedidos:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-base-content">
      <Head>
        <title>Panel de Control</title>
        <link rel="icon" href="/favicon-192.png" />
      </Head>
      <Navbar />
      <Sidebar />
      {/* Contenido principal */}
      <main className="pt-20 md:ml-64 p-4">
        {/* Sección de Resumen/Estadísticas */}
        <section className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Total de Pedidos</h2>
                <p>{totalPedidos}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Pedidos en Progreso</h2>
                <p>{totalEnProgreso}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Pedidos Completados</h2>
                <p>{totalCompletados}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Total de Clientes</h2>
                <p>{totalClientes}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Total de Mensajeros</h2>
                <p>{totalMensajeros}</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Pedidos Mensuales</h2>
                <p>{totalMensuales}</p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Sección de Pedidos Recientes */}
        <section className="mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Pedidos</h2>
              <section className="mt-3">
                <div className="form-control mb-4">
                  <input
                    type="text"
                    placeholder="Buscar por código de pedido"
                    className="input input-bordered w-full"
                  />
                </div>
              </section>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Código de Pedido</th>
                      <th>Estado</th>
                      <th>Origen</th>
                      <th>Destino</th>
                      <th>Mensajero</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-base-300">
                        <td>#{service.id}</td>
                        <td>
                          <span className={`badge ${service.estado === 'solicitado' ? 'badge-warning' : service.estado === 'en progreso' ? 'badge-info' : 'badge-success'}`}>
                            {service.estado}
                          </span>
                        </td>
                        <td>{service.origen}</td>
                        <td>{service.destino}</td>
                        <td>{service.mensajeroID}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
  
        {/* Selección de Fecha y Botón */}
        <div className="flex flex-col items-center mt-8">
          <label className="text-white mb-4">Seleccionar Fecha:</label>
          <input
            type="month"
            className="input input-bordered mb-4"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <button onClick={fetchPedidos} className="btn btn-success">Generar PDF</button>
        </div>
      </main>
    </div>
  );
}
