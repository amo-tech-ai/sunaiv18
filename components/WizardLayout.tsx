import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useWizard } from '../context/WizardContext';
import { Brain, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

const WizardLayout: React.FC = () => {
  const location = useLocation();
  const { analysis } = useWizard();
  
  // Determine current step for UI
  let currentStep = 1;
  let stepTitle = "Getting to know your business";
  let stepDesc = "We start by understanding who you are to tailor the AI models specifically to your market context.";

  if (location.pathname.includes('step-2')) {
    currentStep = 2;
    stepTitle = "Industry Diagnostics";
    stepDesc = "Deep dive into your specific operational constraints and market realities.";
  } else if (location.pathname.includes('step-3')) {
    currentStep = 3;
    stepTitle = "System Recommendations";
    stepDesc = "Proposed architecture based on your diagnostics and business goals.";
  } else if (location.pathname.includes('summary')) {
    currentStep = 4;
    stepTitle = "Executive Summary";
    stepDesc = "A compiled brief of your new system architecture ready for execution.";
  } else if (location.pathname.includes('dashboard')) {
     // Dashboard usually takes over full screen or different layout, 
     // but for this demo, we might keep it or handle it in the Dashboard component itself.
     // If this layout wraps dashboard, we adjust:
     return <Outlet />;
  }

  return (
    <div className="flex h-screen w-full bg-stone-50 overflow-hidden text-stone-900 font-sans selection:bg-accent-500/20">
      
      {/* LEFT PANEL: Context (Read-Only) */}
      <aside className="hidden lg:flex flex-col w-80 border-r border-stone-200 bg-white p-8 h-full shrink-0">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-8 opacity-50">
            <div className="w-3 h-3 bg-stone-900 rounded-full"></div>
            <span className="text-xs font-bold tracking-widest uppercase">Sun AI Agency &copy; 2024</span>
          </div>
          
          <div className="space-y-1 mb-2">
            <span className="text-xs font-semibold text-accent-600 tracking-wider uppercase">Step {currentStep} of 4</span>
            <div className="h-0.5 w-12 bg-accent-500"></div>
          </div>
          
          <h1 className="text-3xl font-serif leading-tight mt-6 mb-4 text-stone-900">
            {stepTitle}
          </h1>
          
          <p className="text-stone-500 text-sm leading-relaxed">
            {stepDesc}
          </p>
        </div>

        {/* Progress / Status Indicators */}
        <div className="mt-auto space-y-6">
          <div className="space-y-3">
             {[1, 2, 3, 4].map(s => (
                <div key={s} className={`flex items-center gap-3 text-sm ${s === currentStep ? 'text-stone-900 font-medium' : 'text-stone-400'}`}>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs
                    ${s === currentStep ? 'border-stone-900 bg-stone-900 text-white' : 
                      s < currentStep ? 'border-stone-900 text-stone-900' : 'border-stone-200'}`}>
                    {s < currentStep ? <CheckCircle2 size={14} /> : s}
                  </div>
                  <span>
                    {s === 1 && 'Context'}
                    {s === 2 && 'Diagnostics'}
                    {s === 3 && 'Architecture'}
                    {s === 4 && 'Execution'}
                  </span>
                </div>
             ))}
          </div>
        </div>
      </aside>

      {/* CENTER PANEL: Work (Human-First) */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative scroll-smooth">
        <div className="max-w-3xl w-full mx-auto p-8 lg:p-16 flex-1 flex flex-col justify-center min-h-0">
          <Outlet />
        </div>
      </main>

      {/* RIGHT PANEL: Intelligence (AI Proposals) */}
      <aside className="hidden xl:flex flex-col w-96 border-l border-stone-200 bg-stone-50/50 p-8 h-full shrink-0">
        <div className="flex items-center gap-2 text-accent-600 mb-8">
          <ChevronRight size={16} />
          <span className="text-xs font-bold tracking-widest uppercase">Live Analysis</span>
        </div>

        <div className="flex-1 relative">
          <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
             <Brain size={120} />
          </div>

          <div className="space-y-6">
            {analysis.status === 'analyzing' && (
               <div className="flex items-center gap-3 text-stone-500 animate-pulse">
                 <Activity size={18} />
                 <span className="text-sm font-mono">Processing signals...</span>
               </div>
            )}

            {analysis.content && (
              <div className="prose prose-stone prose-sm font-mono leading-relaxed bg-white p-6 border border-stone-100 shadow-sm rounded-sm">
                 <div className="whitespace-pre-line text-stone-600">
                    {analysis.content}
                 </div>
                 {analysis.status === 'idle' && (
                   <span className="inline-block w-2 h-4 bg-accent-500 ml-1 animate-pulse align-middle"></span>
                 )}
              </div>
            )}
            
            {!analysis.content && analysis.status === 'idle' && (
               <div className="text-stone-400 text-sm italic border-l-2 border-stone-200 pl-4 py-2">
                 AI is observing. Complete the form to trigger diagnostics.
               </div>
            )}
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-stone-200">
           <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Model: Gemini 2.5 Flash</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                <span>Online</span>
              </div>
           </div>
        </div>
      </aside>
    </div>
  );
};

export default WizardLayout;