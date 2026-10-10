import About from '@/components/About';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import Resume from '@/components/Resume';
import Skills from '@/components/Skills';

export default function Home() {
  return (
    <main className="main">
      <Hero />
      <About />
      <Skills />
      <Resume />
      <Portfolio />
      <Contact />
    </main>
  );
}
