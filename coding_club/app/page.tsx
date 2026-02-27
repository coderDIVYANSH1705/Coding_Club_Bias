import HeroScroller from './Components/Hero';
import HeaderSection from './Components/HeaderSection';
import CodingClubHeader from './Components/Header';
import Terminal from './Components/Terminal';
export default function Page() {
  return (
    <main>
      <HeaderSection />
      <HeroScroller />
      <Terminal />
    </main>
  );
}