// frontend/src/components/home/HowItWorks.jsx
import { FaUserPlus, FaHospital, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

const steps = [
  {
    icon: FaUserPlus,
    title: "Register as MR",
    description: "Create your account and get access to the CRM dashboard.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: FaHospital,
    title: "Add Doctors & Hospitals",
    description: "Start onboarding healthcare professionals and institutions.",
    color: "from-green-500 to-green-600"
  },
  {
    icon: FaChartLine,
    title: "Track & Grow",
    description: "Monitor performance and build strong healthcare connections.",
    color: "from-purple-500 to-purple-600"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It <span className="text-blue-600">Works</span>
          </h2>
          <p className="text-xl text-gray-600">
            Get started in three simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center relative z-10"
              >
                <div className="flex justify-center mb-6">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-4xl shadow-lg`}>
                    <step.icon size={40} />
                  </div>
                </div>
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 border-4 border-blue-600">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-8">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;