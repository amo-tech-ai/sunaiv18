import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';
import { Input, TextArea } from '../../components/ui/Input';
import { Industry, SERVICES_LIST } from '../../types';
import { Check, Upload, AlertCircle, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { analyzeBusinessContext } from '../../services/geminiService';

const Step1Context: React.FC = () => {
  const { data, updateData, setAnalysis, saveStep, isLoading: isSessionLoading } = useWizard();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Debounce analysis trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.businessName && data.description.length > 10) {
        setAnalysis({ status: 'analyzing' });
        analyzeBusinessContext(data).then(result => {
          setAnalysis({ status: 'idle', content: result });
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [data.businessName, data.description, data.industry, data.services]);

  const toggleService = (service: string) => {
    const current = data.services;
    if (current.includes(service)) {
      updateData({ services: current.filter(s => s !== service) });
    } else {
      updateData({ services: [...current, service] });
    }
  };

  const handleContinue = async () => {
    if (!data.businessName || !data.fullName) return;
    
    setIsSaving(true);
    try {
      // Save data to Supabase
      await saveStep(1, data);
      navigate('/app/wizard/step-2');
    } catch (error) {
      console.error("Failed to save progress", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isSessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="animate-spin text-stone-300" size={32} />
        <p className="text-stone-400 text-sm animate-pulse">Restoring session...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex justify-between items-end border-b border-stone-200 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-stone-900 mb-2">Tell us about your business</h2>
          <p className="text-stone-500">Let's build your truth baseline.</p>
        </div>
        <div className="bg-green-50 text-green-700 px-3 py-1 rounded-sm border border-green-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Check size={12} />
          Verified Entity
        </div>
      </header>

      <div className="space-y-8">
        <Input 
          label="Full Name" 
          placeholder="e.g. Sanjiv" 
          value={data.fullName}
          onChange={(e) => updateData({ fullName: e.target.value })}
        />
        
        <Input 
          label="Business Name" 
          placeholder="e.g. FashionOS" 
          value={data.businessName}
          onChange={(e) => updateData({ businessName: e.target.value })}
        />
        
        <Input 
          label="Website" 
          placeholder="https://" 
          value={data.website}
          onChange={(e) => updateData({ website: e.target.value })}
        />

        <div className="space-y-1.5 w-full">
           <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Industry</label>
           <div className="relative">
             <select 
                className="w-full bg-transparent border-b border-stone-200 py-3 text-lg text-stone-900 focus:outline-none focus:border-stone-900 appearance-none font-serif"
                value={data.industry}
                onChange={(e) => updateData({ industry: e.target.value })}
             >
               <option value="" disabled>Select an industry...</option>
               {Object.values(Industry).map(ind => (
                 <option key={ind} value={ind}>{ind}</option>
               ))}
             </select>
             <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
               ▼
             </div>
           </div>
        </div>

        <div className="relative">
           <TextArea 
             label="Short Description" 
             placeholder="Describe what your business does..."
             value={data.description}
             onChange={(e) => updateData({ description: e.target.value })}
           />
           {/* AI Detected Badge floating near description */}
           {data.description.length > 20 && (
             <div className="hidden md:flex absolute -right-4 top-0 translate-x-full w-48 bg-white border border-stone-100 p-3 shadow-sm rounded-sm text-xs text-stone-500 flex-col gap-1">
               <div className="flex items-center gap-1 text-accent-600 font-bold mb-1">
                 <Activity size={10} />
                 <span>AI Detected</span>
               </div>
               <p>Based on signals:</p>
               <p className="italic text-stone-400">Offline heuristic matching, Keyword analysis</p>
             </div>
           )}
        </div>

        <div className="p-8 border-2 border-dashed border-stone-200 rounded-sm bg-stone-50/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-stone-50 transition-colors group">
          <Upload className="text-stone-300 group-hover:text-stone-500 mb-3 transition-colors" size={24} />
          <p className="text-sm font-medium text-stone-600">Drop brand guides, pitch decks, or requirements here</p>
          <p className="text-xs text-stone-400 mt-1">PDF, Images, TXT supported for AI Analysis (Max 10MB)</p>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Current / Planned Services</label>
          <div className="flex flex-wrap gap-2">
            {SERVICES_LIST.map(service => (
              <button
                key={service}
                onClick={() => toggleService(service)}
                className={`
                  px-4 py-2 rounded-full text-sm border transition-all
                  ${data.services.includes(service) 
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md' 
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}
                `}
              >
                {data.services.includes(service) ? '+ ' : '+ '}{service}
              </button>
            ))}
          </div>
        </div>

        {/* Business Model / Maturity Indicators (Static for visual parity with screenshot) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 border border-stone-100 rounded-sm">
            <span className="block text-[10px] font-bold text-stone-400 uppercase mb-1">Business Model</span>
            <span className="text-sm font-medium text-stone-900">
              {data.industry ? `Detected ${data.industry.split('/')[0]}` : 'Waiting for input...'}
            </span>
          </div>
          <div className="p-4 bg-stone-50 border border-stone-100 rounded-sm">
             <div className="flex justify-between items-start mb-1">
               <span className="block text-[10px] font-bold text-stone-400 uppercase">Digital Maturity</span>
               <span className="text-xs font-bold">2/5</span>
             </div>
             <div className="flex gap-1 h-1.5 mt-2">
               <div className="w-8 bg-accent-500 rounded-full"></div>
               <div className="w-8 bg-accent-500 rounded-full"></div>
               <div className="w-8 bg-stone-200 rounded-full"></div>
               <div className="w-8 bg-stone-200 rounded-full"></div>
               <div className="w-8 bg-stone-200 rounded-full"></div>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button 
          onClick={handleContinue}
          disabled={!data.businessName || !data.fullName || isSaving}
          className="bg-stone-900 text-white px-8 py-3 rounded-sm text-sm font-medium flex items-center gap-2 hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step1Context;