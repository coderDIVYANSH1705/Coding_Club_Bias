import HeroScroller from './Components/Hero';
import HeaderSection from './Components/HeaderSection';
import CodingClubHeader from './Components/Header';
import Terminal from './Components/Terminal';
import AboutClub from './Components/About';
import ClubTechStack from './Components/TechnologyArsenal';
import TechCentre from './Components/TechCentre';
import ScrollSequence from './Components/TechCentre';
export default function Page() {
  return (
    <main>
      <HeaderSection />
      <HeroScroller />
      <Terminal />
      <AboutClub />
      <ClubTechStack />
      <ScrollSequence />
    </main>
  );
}