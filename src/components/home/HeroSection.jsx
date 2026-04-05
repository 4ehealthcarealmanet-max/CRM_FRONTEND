// frontend/src/components/home/HeroSection.jsx
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Empowering Medical Representatives with{" "}
              <span className="text-blue-600">Smart Healthcare CRM</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Manage Doctors, Hospitals & Patient Engagement — All in One Platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/login"
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 text-lg"
              >
                Login <FaArrowRight size={18} />
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-lg"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <img
              src="https://img.freepik.com/free-vector/doctors-team-consulting-patient-clinic_1262-21404.jpg"
              alt="Doctor and MR Meeting"
              className="rounded-2xl shadow-2xl"
            />
            {/* Decorative Elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;