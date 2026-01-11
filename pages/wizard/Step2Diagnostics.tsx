import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getIndustryPack } from '../../data/industryPacks';

const Step2Diagnostics: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useWizard();

  // Get Industry Pack based on context selection
  const industryPack = useMemo(() => {
    return getIndustryPack(data.industry);
  }, [data.industry]);

  const handleContinue = () => navigate('/app/wizard/step-3');
  const handleBack = () => navigate('/app/wizard/step-1');

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <header className="border-b border-stone-200 pb-6">
          <h2 className="text-4xl font-serif text-stone-900 mb-2">Operational Diagnostics</h2>
          <p className="text-stone-500">
            We've generated these questions based on your profile as a <span className="font-semibold text-stone-900">{industryPack.name}</span> business.
          </p>
      </header>

      <div className="space-y-10">
        {industryPack.diagnostics.map((section, sectionIdx) => (
          <div key={sectionIdx} className="space-y-6">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider">{section.title}</h3>
            
            <div className="grid gap-6">
              {section.questions.map((q) => (
                <div key={q.id} className="p-6 border border-stone-200 bg-white rounded-sm hover:border-accent-400 transition-colors group">
                  <h4 className="text-lg font-serif text-stone-900 mb-4">{q.text}</h4>
                  <div className="space-y-3">
                    {q.options.map((opt, optIdx) => (
                      <label key={optIdx} className="flex items-center gap-3 p-3 border border-stone-100 rounded-sm cursor-pointer hover:bg-stone-50 transition-colors">
                        <input type="radio" name={q.id} className="accent-stone-900 w-4 h-4" />
                        <span className="text-sm text-stone-600">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 flex justify-between">
        <button 
          onClick={handleBack}
          className="text-stone-500 hover:text-stone-900 px-4 py-3 text-sm font-medium flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button 
          onClick={handleContinue}
          className="bg-stone-900 text-white px-8 py-3 rounded-sm text-sm font-medium flex items-center gap-2 hover:bg-stone-800 transition-colors"
        >
          Generate Architecture
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Step2Diagnostics;
