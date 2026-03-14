import HeroScroller from '../Components/Hero';
import HeaderSection from '../Components/HeaderSection';
import CodingClubHeader from '../Components/HeaderSection';
import Terminal from '../Components/Terminal';
import About3D from '@/Components/About';
import ClubTechStack from '../Components/TechnologyArsenal';
import TechCentre from '../Components/TechCentre';
import ScrollSequence from '../Components/TechCentre';
import EventGallery from '../Components/EventGallery';
import JoinClubForm from '../Components/JoinClub';
import LeadershipSection from '@/Components/leadership';
import RadarAbout from '@/Components/AboutTheClub';
import Footer from '@/Components/footer';
import AboutBento from '@/Components/AboutTheClub';
export default function Page() {
  return (
    <main>
      <HeaderSection />
      <HeroScroller />
      <AboutBento />
      <Terminal />
      <About3D />
      <ClubTechStack />
      <EventGallery />
      <JoinClubForm />
      <LeadershipSection />
      <Footer />
    </main>
  );
}