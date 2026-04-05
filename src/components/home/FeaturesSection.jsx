// frontend/src/components/home/FeaturesSection.jsx
import { 
  FaUserMd, 
  FaHospital, 
  FaChartLine, 
  FaCalendarCheck, 
  FaChartBar,
  FaBell 
} from "react-icons/fa";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: FaUserMd,
      title: "Doctor Management",
      description: "Easily add, manage and track doctors. Monitor their interest level and engagement with your services.",
      color: "blue"
    },
    {
      icon: FaHospital,
      title: "Hospital Onboarding",
      description: "Add and manage hospitals, track their status and interest in your services.",
      color: "green"
    },
    {
      icon: FaChartLine,
      title: "Activity Tracking",
      description: "Track your visits, follow-ups, and interactions with doctors and hospitals in real-time.",
      color: "purple"
    },
    {
      icon: FaCalendarCheck,
      title: "Appointment Insights",
      description: "Monitor how doctors are engaging with patients and track appointment activity.",
      color: "orange"
    },
    {
      icon: FaChartBar,
      title: "Performance Dashboard",
      description: "Get real-time insights into your performance — doctors added, hospitals onboarded, and engagement stats.",
      color: "red"
    },
    {
      icon: FaBell,
      title: "Smart Notifications",
      description: "Get instant alerts for follow-ups, new appointments, and important updates.",
      color: "indigo"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to <span className="text-blue-600">Succeed</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed specifically for Medical Representatives
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;