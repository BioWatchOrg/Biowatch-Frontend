import CtaSection from '../components/CtaSection';
import FeaturesSection from '../components/FeaturesSection';
import Hero from '../components/Hero';
import LandingFooter from '../components/LandingFooter';
import LandingNavbar from '../components/LandingNavbar';
import StatsSection from '../components/StatsSection';

function LandingPage() {
  return (
    <div className="lp-page">
      <LandingNavbar />
      <main className="lp-main">
        <Hero />
        <FeaturesSection />
        <StatsSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
