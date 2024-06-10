import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-800 shadow p-2 fixed top-0 left-0 flex justify-between items-center z-10">
      <h1 className="text-2xl font-bold text-white">INTERAPPIDOS</h1>
    </nav>
  );
};

export default Navbar;
