"use client"
import React, { useState } from 'react';

const MensajeroPage = () => {
  const [pedidoId, setPedidoId] = useState('');
  const [pedidoInfo, setPedidoInfo] = useState(null);
  const [usuarioNombre, setUsuarioNombre] = useState('');
  const [mensajeroNombre, setMensajeroNombre] = useState('');
  const [error, setError] = useState('');

  const handlePedidoIdChange = (e) => {
    setPedidoId(e.target.value);
  };

  const handleBuscarPedido = async () => {
    setError('');
    setPedidoInfo(null);
    setUsuarioNombre('');
    setMensajeroNombre('');
    try {
      const response = await fetch(`http://localhost:5000/api/servicios/${pedidoId}`);
      if (!response.ok) {
        throw new Error('Pedido no encontrado');
      }
      const data = await response.json();
      setPedidoInfo(data);

      const usuarioResponse = await fetch(`http://localhost:5000/api/usuarios/${data.usuarioID}`);
      if (!usuarioResponse.ok) {
        throw new Error('Usuario no encontrado');
      }
      const usuarioData = await usuarioResponse.json();
      setUsuarioNombre(usuarioData.login);

      const mensajeroResponse = await fetch(`http://localhost:5000/api/mensajeros/${data.mensajeroID}`);
      if (!mensajeroResponse.ok) {
        throw new Error('Mensajero no encontrado');
      }
      const mensajeroData = await mensajeroResponse.json();
      setMensajeroNombre(mensajeroData.nombre);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-base-100 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center">Seguimiento del Pedido</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={pedidoId}
            onChange={handlePedidoIdChange}
            placeholder="Ingrese el número de seguimiento"
            className="input input-bordered w-3/4"
          />
          <button
            onClick={handleBuscarPedido}
            className="btn btn-primary"
          >
            Buscar
          </button>
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {pedidoInfo && (
          <div className="card bg-base-100 shadow-xl p-4">
            <div className="card-body">
              <h3 className="card-title text-primary text-center mb-4">Detalles del Pedido</h3>
              <div className="space-y-2">
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Pedido ID:</span>
                  <span>{pedidoInfo.id}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Usuario:</span>
                  <span>{usuarioNombre}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Mensajero:</span>
                  <span>{mensajeroNombre}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Fecha Solicitud:</span>
                  <span>{new Date(pedidoInfo.fecha_solicitud).toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Tipo Transporte:</span>
                  <span>{pedidoInfo.tipo_transporte}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Número de Paquetes:</span>
                  <span>{pedidoInfo.numero_paquetes}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Estado:</span>
                  <span>{pedidoInfo.estado}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Origen:</span>
                  <span>{pedidoInfo.origen}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Destino:</span>
                  <span>{pedidoInfo.destino}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Ciudad:</span>
                  <span>{pedidoInfo.ciudad}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Descripción:</span>
                  <span>{pedidoInfo.descripcion}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Foto:</span>
                  <span>
                    {pedidoInfo.fotoURL ? (
                      <a href={`http://localhost:5000${pedidoInfo.fotoURL}`} target="_blank" rel="noopener noreferrer">
                        <img src={`http://localhost:5000${pedidoInfo.fotoURL}`} alt="Foto del pedido" className="w-32 h-32 object-cover cursor-pointer" />
                      </a>
                    ) : (
                      'No hay foto disponible'
                    )}
                  </span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Fecha Creación:</span>
                  <span>{new Date(pedidoInfo.createdAt).toLocaleString()}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-3">
                  <span className="font-bold">Fecha Actualización:</span>
                  <span>{new Date(pedidoInfo.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );


};

export default MensajeroPage;
