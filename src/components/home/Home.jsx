import BenefitsSection from "./BenefitsSection";
import CTAFooter from "./CTAFooter";
import FeaturesSection from "./FeaturesSection";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import Navbar from "./Navbar";
import StatsSection from "./StatsSection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
     
       <Navbar/>
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <StatsSection/>
      <BenefitsSection/>
      <CTAFooter />
      <Footer />
    </div>
  );
};

export default HomePage;