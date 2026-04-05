// frontend/src/components/home/CTAFooter.jsx
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const CTAFooter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Start Managing Your Medical Network Today
        </h2>
        <p className="text-xl text-blue-100 mb-10">
          Join thousands of Medical Representatives who are already growing their network
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2 text-lg font-semibold"
          >
            Register Now <FaArrowRight size={18} />
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition text-lg font-semibold"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTAFooter;