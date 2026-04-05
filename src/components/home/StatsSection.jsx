// frontend/src/components/home/StatsSection.jsx
import { FaUserMd, FaHospital, FaCalendarCheck } from "react-icons/fa";

const StatsSection = () => {
  console.log("StatsSection rendering..."); // Debug log

  const stats = [
    {
      icon: FaUserMd,
      value: "1000+",
      label: "Doctors",
      color: "text-blue-600"
    },
    {
      icon: FaHospital,
      value: "500+",
      label: "Hospitals",
      color: "text-green-600"
    },
    {
      icon: FaCalendarCheck,
      value: "10K+",
      label: "Appointments Managed",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-blue-100">
            Growing stronger every day
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20">
              <stat.icon className={`w-16 h-16 mx-auto mb-4 ${stat.color}`} />
              <div className="text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <p className="text-xl text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

