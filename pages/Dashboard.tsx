import React from 'react';
import { useWizard } from '../context/WizardContext';
import { BarChart, Activity, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { data } = useWizard();

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Dashboard Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-400 flex flex-col">
        <div className="p-6">
           <h1 className="text-white font-serif text-xl tracking-tight">Sun AI Agency</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-6">
           <div className="px-2 py-2 text-white bg-stone-800 rounded-sm flex items-center gap-3">
             <Activity size={18} />
             <span className="text-sm font-medium">Overview</span>
           </div>
           <div className="px-2 py-2 hover:bg-stone-800 rounded-sm flex items-center gap-3 transition-colors cursor-pointer">
             <Users size={18} />
             <span className="text-sm font-medium">Agents</span>
           </div>
           <div className="px-2 py-2 hover:bg-stone-800 rounded-sm flex items-center gap-3 transition-colors cursor-pointer">
             <BarChart size={18} />
             <span className="text-sm font-medium">Metrics</span>
           </div>
        </nav>
        <div className="p-6 border-t border-stone-800">
           <Link to="/" className="flex items-center gap-3 hover:text-white transition-colors">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
           </Link>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto">
         <header className="flex justify-between items-center mb-12">
            <div>
               <h2 className="text-3xl font-serif text-stone-900">{data.businessName || "My Project"}</h2>
               <p className="text-stone-500 text-sm mt-1">System Status: <span className="text-green-600 font-bold">Operational</span></p>
            </div>
            <div className="flex gap-4">
               <button className="bg-white border border-stone-200 text-stone-900 px-4 py-2 rounded-sm text-sm font-medium shadow-sm">
                 Documentation
               </button>
               <button className="bg-stone-900 text-white px-4 py-2 rounded-sm text-sm font-medium shadow-sm">
                 New Agent
               </button>
            </div>
         </header>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Active Agents', val: '3', trend: '+1 this week' },
              { label: 'Tasks Automated', val: '1,240', trend: '+12% vs last month' },
              { label: 'Efficiency Score', val: '94/100', trend: 'Optimal' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 border border-stone-200 shadow-sm rounded-sm">
                 <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{stat.label}</p>
                 <p className="text-4xl font-serif text-stone-900 mb-2">{stat.val}</p>
                 <p className="text-xs text-green-600 font-medium">{stat.trend}</p>
              </div>
            ))}
         </div>

         <div className="bg-white border border-stone-200 rounded-sm shadow-sm h-96 flex items-center justify-center">
            <div className="text-center text-stone-400">
               <BarChart size={48} className="mx-auto mb-4 opacity-50" />
               <p className="text-sm">Real-time telemetry will appear here once agents are deployed.</p>
            </div>
         </div>
      </main>
    </div>
  );
};

export default Dashboard;