import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Layers, Database, Cpu } from 'lucide-react';

const Step3Recommendations: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="border-b border-stone-200 pb-6">
          <h2 className="text-4xl font-serif text-stone-900 mb-2">Proposed Architecture</h2>
          <p className="text-stone-500">Based on your diagnostics, we recommend the following system composition.</p>
      </header>

      <div className="grid gap-6">
        {[
          { icon: Layers, title: "Core Workflow Engine", desc: "Centralized orchestration for your services." },
          { icon: Database, title: "Unified Data Layer", desc: "Single source of truth for customer data." },
          { icon: Cpu, title: "Agentic Interface", desc: "AI-driven interaction layer for end-users." }
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-6 border border-stone-200 bg-white shadow-sm">
             <div className="p-3 bg-stone-100 rounded-sm text-stone-900">
               <item.icon size={24} strokeWidth={1.5} />
             </div>
             <div>
               <h3 className="text-xl font-serif text-stone-900 mb-1">{item.title}</h3>
               <p className="text-stone-500 text-sm">{item.desc}</p>
             </div>
             <button className="ml-auto text-xs font-bold uppercase tracking-wider text-accent-600 border border-accent-200 px-3 py-1 rounded-full hover:bg-accent-50">
               Review
             </button>
          </div>
        ))}
      </div>

      <div className="pt-8 flex justify-between">
        <button onClick={() => navigate('/app/wizard/step-2')} className="text-stone-500 hover:text-stone-900 px-4 py-3 text-sm font-medium flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={() => navigate('/app/wizard/summary')} className="bg-stone-900 text-white px-8 py-3 rounded-sm text-sm font-medium flex items-center gap-2 hover:bg-stone-800 transition-colors">
          Finalize & View Summary <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Step3Recommendations;