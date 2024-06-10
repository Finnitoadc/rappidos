import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white fixed top-16 hidden md:block">
      <div className="p-4">
        <nav>
          <ul className="menu">
            <li className="my-2">
              <Link href="/">Inicio</Link>
            </li>
            <li className="my-2">
              <Link href="/login">Iniciar Sesión</Link>
            </li>
            <li className="my-2">
              <Link href="/seguimiento">Seguimiento de Pedidos</Link>
            </li>
            <li className="my-2">
              <Link href="/gestion/usuarios">Gestión usuarios</Link>
            </li>
            <li className="my-2">
              <Link href="/gestion/clientes">Gestión de Clientes</Link>
            </li>
            <li className="my-2">
              <Link href="/gestion/mensajeros">Gestión de Mensajeros</Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
