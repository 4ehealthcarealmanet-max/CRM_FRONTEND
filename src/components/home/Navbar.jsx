// frontend/src/components/home/Navbar.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FaUserMd className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">Med<span className="text-blue-600">Bridge</span></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition">How It Works</a>
            <a href="#stats" className="text-gray-600 hover:text-blue-600 transition">Stats</a>
            <Link to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
              Login
            </Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <a href="#features" className="block py-2 text-gray-600 hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="block py-2 text-gray-600 hover:text-blue-600">How It Works</a>
            <a href="#stats" className="block py-2 text-gray-600 hover:text-blue-600">Stats</a>
            <div className="pt-2 space-y-2">
              <Link to="/login" className="block px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-lg">
                Login
              </Link>
              <Link to="/register" className="block px-4 py-2 text-center bg-blue-600 text-white rounded-lg">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;