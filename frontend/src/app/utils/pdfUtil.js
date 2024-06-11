import jsPDF from 'jspdf';

export const generatePDF = (pedidosCliente, pedidosMensajero, clientes, mensajeros) => {
  const doc = new jsPDF();

  // Agregar encabezado
  doc.setFontSize(18);
  doc.text('Reporte de Pedidos', 20, 20);

  // Sección de pedidos de cliente
  doc.setFontSize(14);
  doc.text('Pedidos por Cliente', 20, 40);
  const startYCliente = 50;
  doc.setFontSize(10);
  doc.setTextColor(100); // Gris oscuro para títulos de columna

  // Encabezados de columna
  doc.text('ID Pedido', 25, startYCliente);
  doc.text('Estado', 65, startYCliente);
  doc.text('Cliente', 105, startYCliente);

  doc.setTextColor(0); // Negro para el contenido
  let currentYCliente = startYCliente + 10;

  pedidosCliente.forEach((pedido) => {
    const cliente = clientes.find(c => c.ID_cliente === pedido.clienteID);
    doc.text(`#${pedido.id}`, 25, currentYCliente);
    doc.text(pedido.estado, 65, currentYCliente);
    doc.text(cliente?.nombre || 'Desconocido', 105, currentYCliente);
    currentYCliente += 10; // Espaciado entre filas
  });

  // Sección de pedidos de mensajero
  doc.addPage();
  doc.setFontSize(14);
  doc.text('Pedidos Atendidos por Mensajero', 20, 20);
  const startYMensajero = 30;
  doc.setFontSize(10);
  doc.setTextColor(100); // Gris oscuro para títulos de columna

  // Encabezados de columna
  doc.text('ID Pedido', 25, startYMensajero);
  doc.text('Estado', 65, startYMensajero);
  doc.text('Mensajero', 105, startYMensajero);

  doc.setTextColor(0); // Negro para el contenido
  let currentYMensajero = startYMensajero + 10;

  pedidosMensajero.forEach((pedido) => {
    const mensajero = mensajeros.find(m => m.id === pedido.mensajeroID);
    doc.text(`#${pedido.id}`, 25, currentYMensajero);
    doc.text(pedido.estado, 65, currentYMensajero);
    doc.text(mensajero?.nombre || 'Desconocido', 105, currentYMensajero);
    currentYMensajero += 10; // Espaciado entre filas
  });

  doc.save('pedidos.pdf');
};
