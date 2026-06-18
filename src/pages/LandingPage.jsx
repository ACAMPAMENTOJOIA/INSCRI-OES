import './LandingPage.css';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import EventsGallery from '../components/EventsGallery';
import RulesSection from '../components/RulesSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Hero />
      <AboutSection />
      <EventsGallery />
      <RulesSection />
      <Footer />
    </div>
  );
}
