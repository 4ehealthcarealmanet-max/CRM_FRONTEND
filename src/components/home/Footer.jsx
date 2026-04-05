// frontend/src/components/home/Footer.jsx
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaUserMd } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaUserMd className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">Med<span className="text-blue-400">Bridge</span></span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering Medical Representatives with smart healthcare CRM solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-400 hover:text-blue-400 transition">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-400 hover:text-blue-400 transition">How It Works</a></li>
              <li><a href="#stats" className="text-gray-400 hover:text-blue-400 transition">Stats</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Pricing</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-400 transition">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>support@medbridge.com</li>
              <li>+91 78986-22813</li>
              <li> Shnehalata ganj Indore Madhya Pradesh</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MedBridge CRM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;