import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Hexagon } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-4 bg-white border border-stone-200 shadow-sm rounded-full">
        <Hexagon className="text-stone-900" size={32} strokeWidth={1.5} />
      </div>
      
      <h1 className="text-5xl md:text-7xl font-serif text-stone-900 mb-6 tracking-tight">
        Sun AI Agency
      </h1>
      
      <p className="max-w-xl text-lg text-stone-500 mb-12 leading-relaxed font-light">
        Turn unclear ideas into structured, executable systems. 
        Structure first, intelligence second, automation last.
      </p>
      
      <Link 
        to="/app/wizard/step-1"
        className="group flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-sm hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
      >
        <span className="font-medium tracking-wide">Begin Diagnostics</span>
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
      
      <div className="mt-16 grid grid-cols-3 gap-8 text-xs font-bold text-stone-400 uppercase tracking-widest">
        <span>Architectural</span>
        <span>Transparent</span>
        <span>Human-First</span>
      </div>
    </div>
  );
};

export default LandingPage;