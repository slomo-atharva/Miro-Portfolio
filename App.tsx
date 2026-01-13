import React, { useState } from 'react';
import { HeroCanvas } from './components/HeroCanvas';
import { AboutMeBoard } from './components/AboutMeBoard';
import { ContactBoard } from './components/ContactBoard';
import { AllWorksBoard } from './components/AllWorksBoard';
import { CommunityBoard } from './components/CommunityBoard';
import { CaseStudyBoard } from './components/CaseStudyBoard';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'about' | 'contact' | 'works' | 'community' | 'casestudy'>('home');

  return (
    <div className="w-screen h-screen relative bg-white overflow-hidden">
      {view === 'home' ? (
        <HeroCanvas onNavigate={(page) => setView(page)} />
      ) : view === 'about' ? (
        <AboutMeBoard onBack={() => setView('home')} />
      ) : view === 'contact' ? (
        <ContactBoard onBack={() => setView('home')} />
      ) : view === 'works' ? (
        <AllWorksBoard 
            onBack={() => setView('home')} 
            onSelectProject={() => setView('casestudy')}
        />
      ) : view === 'community' ? (
        <CommunityBoard onBack={() => setView('home')} />
      ) : (
        <CaseStudyBoard onBack={() => setView('works')} />
      )}
    </div>
  );
};

export default App;