import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';
import { FileText, CheckCircle } from 'lucide-react';

const Summary: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useWizard();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
       <div className="bg-white border border-stone-200 p-8 md:p-12 shadow-sm max-w-2xl mx-auto relative">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-stone-900 via-stone-500 to-stone-200"></div>
         
         <div className="flex items-center gap-3 mb-8 text-stone-400">
           <FileText size={20} />
           <span className="text-xs font-bold uppercase tracking-widest">Executive Brief</span>
         </div>

         <h2 className="text-4xl font-serif text-stone-900 mb-6">System Directive: {data.businessName || "Project Alpha"}</h2>
         
         <div className="prose prose-stone">
           <p className="lead">
             Prepared for <strong>{data.fullName}</strong>. This document outlines the strategic deployment of AI infrastructure tailored for the <strong>{data.industry}</strong> sector.
           </p>
           <hr className="border-stone-100 my-6" />
           <h3 className="font-serif text-lg">Core Objectives</h3>
           <ul className="list-disc pl-5 space-y-2 text-stone-600">
             <li>Establish a truth baseline for {data.services.length > 0 ? data.services[0] : 'operations'}.</li>
             <li>Reduce friction in cross-departmental data flows.</li>
             <li>Deploy scalable agentic interfaces.</li>
           </ul>
         </div>

         <div className="mt-12 p-4 bg-green-50 border border-green-100 rounded-sm flex items-center gap-4">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-800">Ready for Execution</p>
              <p className="text-xs text-green-700">All systems validated. Dashboard environment provisioned.</p>
            </div>
         </div>
       </div>

       <div className="flex justify-center">
         <button 
           onClick={() => navigate('/app/dashboard')}
           className="bg-stone-900 text-white px-12 py-4 rounded-sm text-base font-medium hover:bg-stone-800 shadow-xl transition-all hover:-translate-y-1"
         >
           Enter Dashboard
         </button>
       </div>
    </div>
  );
};

export default Summary;