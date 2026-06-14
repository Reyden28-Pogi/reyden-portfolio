import { usePortfolioData, useVisitTracker } from "../hooks/usePortfolioData";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MarqueeBanner from "../components/MarqueeBanner";
import About from "../components/About";
import Projects from "../components/Projects";
import Certificates from "../components/Certificates";
import Skills from "../components/Skills";
import Pricing from "../components/Pricing";
import Contact from "../components/Contact";
import ConsentBanner from "../components/ConsentBanner";

export default function Portfolio() {
  const { data } = usePortfolioData();
  useVisitTracker();

  return (
    <>
      <Navbar data={data} />
      <Hero data={data} />
      <MarqueeBanner />
      <About data={data} />
      <Projects data={data} />
      <Certificates data={data} />
      <Skills data={data} />
      <Pricing data={data} />
      <Contact data={data} />
      <ConsentBanner />
    </>
  );
}