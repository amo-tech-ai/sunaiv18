import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';
import { supabase } from '../../lib/supabase';
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { getIndustryPack } from '../../data/industryPacks';

const Step2Diagnostics: React.FC = () => {
  const navigate = useNavigate();
  const { data, sessionId, saveStep } = useWizard();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get Industry Pack based on context selection
  const industryPack = useMemo(() => {
    return getIndustryPack(data.industry);
  }, [data.industry]);

  // Restore answers if session exists
  useEffect(() => {
    const loadSavedAnswers = async () => {
      if (!sessionId || sessionId === 'guest-session') return;
      
      setLoadingAnswers(true);
      try {
        const { data: savedRow } = await supabase
          .from('wizard_answers')
          .select('data')
          .eq('session_id', sessionId)
          .eq('step_number', 2)
          .single();
          
        if (savedRow && savedRow.data) {
          setAnswers(savedRow.data as Record<string, any>);
        }
      } catch (err) {
        console.error("Failed to load step 2 answers", err);
      } finally {
        setLoadingAnswers(false);
      }
    };
    
    loadSavedAnswers();
  }, [sessionId]);

  const handleSingleSelect = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiSelect = (questionId: string, value: string) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) || [];
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) };
      }
      return { ...prev, [questionId]: [...current, value] };
    });
  };

  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await saveStep(2, answers);
      navigate('/app/wizard/step-3');
    } catch (error) {
      console.error("Failed to save step 2", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => navigate('/app/wizard/step-1');

  // Calculate completion percentage for UX (optional, but nice)
  const totalQuestions = industryPack.diagnostics.reduce((acc, sec) => acc + sec.questions.length, 0);
  const answeredCount = Object.keys(answers).length;
  const isComplete = totalQuestions > 0 && answeredCount >= totalQuestions;

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <header className="border-b border-stone-200 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-4xl font-serif text-stone-900 mb-2">Operational Diagnostics</h2>
              <p className="text-stone-500 max-w-xl">
                We've generated these questions based on your profile as a <span className="font-semibold text-stone-900">{industryPack.name}</span> business.
              </p>
            </div>
            {/* Progress Indicator */}
            <div className="hidden md:block text-right">
              <span className="text-3xl font-serif text-stone-900">{answeredCount}/{totalQuestions}</span>
              <span className="block text-xs font-bold text-stone-400 uppercase tracking-wider">Questions Answered</span>
            </div>
          </div>
      </header>

      {loadingAnswers ? (
        <div className="py-20 flex flex-col items-center justify-center text-stone-400 gap-3">
          <Loader2 className="animate-spin" size={24} />
          <p className="text-sm">Retrieving previous diagnostic data...</p>
        </div>
      ) : (
        <div className="space-y-12">
          {industryPack.diagnostics.map((section, sectionIdx) => (
            <div key={sectionIdx} className="space-y-6 animate-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${sectionIdx * 100}ms` }}>
              <h3 className="text-sm font-bold text-stone-400 uppercase tracking-wider border-b border-stone-100 pb-2">{section.title}</h3>
              
              <div className="grid gap-6">
                {section.questions.map((q) => (
                  <div key={q.id} className="p-8 border border-stone-200 bg-white rounded-sm hover:border-stone-300 transition-colors group relative overflow-hidden">
                    {/* Active Indicator Strip */}
                    {answers[q.id] && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500"></div>
                    )}
                    
                    <h4 className="text-xl font-serif text-stone-900 mb-6 pr-8">{q.text}</h4>
                    
                    {/* Answer Options */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = q.type === 'multi' 
                          ? (answers[q.id] as string[] || []).includes(opt.value)
                          : answers[q.id] === opt.value;

                        return (
                          <label 
                            key={optIdx} 
                            className={`
                              flex items-start gap-4 p-4 border rounded-sm cursor-pointer transition-all duration-200
                              ${isSelected 
                                ? 'bg-stone-900 border-stone-900 text-white shadow-md' 
                                : 'bg-white border-stone-200 hover:bg-stone-50 hover:border-stone-300 text-stone-600'}
                            `}
                          >
                            <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors
                              ${isSelected ? 'border-white bg-white/20' : 'border-stone-300'}
                            `}>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-white"></div>}
                            </div>
                            
                            <input 
                              type={q.type === 'multi' ? 'checkbox' : 'radio'} 
                              name={q.id} 
                              className="hidden"
                              value={opt.value}
                              checked={isSelected}
                              onChange={() => q.type === 'multi' 
                                ? handleMultiSelect(q.id, opt.value) 
                                : handleSingleSelect(q.id, opt.value)
                              }
                            />
                            
                            <span className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-white' : 'text-stone-700'}`}>
                              {opt.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    {/* Completion Checkmark */}
                    {answers[q.id] && (
                       <div className="absolute top-6 right-6 text-green-500 animate-in zoom-in duration-300">
                         <CheckCircle2 size={24} />
                       </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-8 flex justify-between items-center border-t border-stone-200">
        <button 
          onClick={handleBack}
          className="text-stone-500 hover:text-stone-900 px-4 py-3 text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-6">
          {!isComplete && !loadingAnswers && answeredCount > 0 && (
            <div className="hidden md:flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider bg-amber-50 px-3 py-1.5 rounded-full">
              <AlertCircle size={14} />
              <span>Partial Completion</span>
            </div>
          )}
          
          <button 
            onClick={handleContinue}
            disabled={loadingAnswers || isSaving}
            className={`
              bg-stone-900 text-white px-8 py-3 rounded-sm text-sm font-medium flex items-center gap-2 
              transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Saving...
              </>
            ) : (
              <>
                Generate Architecture
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step2Diagnostics;