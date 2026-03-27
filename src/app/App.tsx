import { BrowserRouter, Routes, Route } from 'react-router';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { CustomCursor } from '@/app/components/CustomCursor';
import { HomePage } from '@/pages/HomePage';
import { About } from '@/app/components/About';
import { Downloads } from '@/app/components/Downloads';
import { MiraComingSoon } from '@/app/components/MiraComingSoon';
import { MouseFollower } from '@/app/components/MouseFollower';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 transition-colors duration-300 cursor-none relative" style={{ position: 'relative' }}>
        <CustomCursor />
        <MouseFollower />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/mira-ai" element={<MiraComingSoon />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}