// frontend/src/components/home/BenefitsSection.jsx
import { FaClock, FaDatabase, FaChartLine, FaBell, FaUserFriends, FaRocket } from "react-icons/fa";

const benefits = [
  {
    icon: FaClock,
    title: "Save Time with Automation",
    description: "Automate routine tasks and focus on what matters most - building relationships."
  },
  {
    icon: FaDatabase,
    title: "Centralized Data Management",
    description: "All your doctor and hospital data in one secure, accessible place."
  },
  {
    icon: FaChartLine,
    title: "Real-time Tracking",
    description: "Monitor your progress and performance metrics in real-time."
  },
  {
    icon: FaBell,
    title: "Easy Follow-ups",
    description: "Never miss a follow-up with smart reminders and scheduling."
  },
  {
    icon: FaUserFriends,
    title: "Better Doctor Relationships",
    description: "Build stronger connections with personalized engagement tracking."
  },
  {
    icon: FaRocket,
    title: "Boost Productivity",
    description: "Streamline your workflow and achieve more in less time."
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">MedBridge</span>
          </h2>
          <p className="text-xl text-gray-600">
            Benefits that make a difference in your daily workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <benefit.icon size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;