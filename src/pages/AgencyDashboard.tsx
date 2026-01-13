import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Search,
  MessageSquare,
  LayoutGrid,
  Settings,
  Bell,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

// Mock Data Types
interface Client {
  id: string;
  name: string;
  industry: string;
  status: 'active' | 'onboarding' | 'churned';
  healthScore: number;
  healthTrend: 'up' | 'down' | 'stable';
  nextAction: string;
  revenue: string;
}

interface Insight {
  id: string;
  type: 'risk' | 'opportunity' | 'update';
  client: string;
  message: string;
  time: string;
}

const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'FashionOS', industry: 'Fashion / Retail', status: 'active', healthScore: 92, healthTrend: 'up', nextAction: 'Approve Q3 Roadmap', revenue: '$12k/mo' },
  { id: '2', name: 'TechFlow Inc', industry: 'SaaS', status: 'onboarding', healthScore: 78, healthTrend: 'stable', nextAction: 'Complete Diagnostics', revenue: '$8k/mo' },
  { id: '3', name: 'Urban Realty', industry: 'Real Estate', status: 'active', healthScore: 45, healthTrend: 'down', nextAction: 'Review Churn Risk', revenue: '$5k/mo' },
  { id: '4', name: 'Green Goods', industry: 'E-commerce', status: 'active', healthScore: 88, healthTrend: 'up', nextAction: 'Scale Ad Campaign', revenue: '$15k/mo' },
];

const MOCK_INSIGHTS: Insight[] = [
  { id: '1', type: 'risk', client: 'Urban Realty', message: 'Engagement dropped 40% this week. Schedule check-in.', time: '2h ago' },
  { id: '2', type: 'opportunity', client: 'FashionOS', message: 'Ready for "AI Customer Support" upsell based on usage.', time: '4h ago' },
  { id: '3', type: 'update', client: 'TechFlow Inc', message: 'Diagnostics completed. Waiting for approval.', time: '1d ago' },
];

const AgencyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = MOCK_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="flex h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden">
      {/* LEFT SIDEBAR - Global Nav */}
      <aside className="w-64 bg-stone-900 text-stone-400 flex flex-col shrink-0">
        <div className="p-6">
           <h1 className="text-white font-serif text-xl tracking-tight flex items-center gap-2">
             <LayoutGrid size={20} className="text-accent-500"/>
             Sun Agency
           </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-6">
           <div className="px-3 py-2 text-white bg-stone-800 rounded-sm flex items-center gap-3">
             <Users size={18} />
             <span className="text-sm font-medium">Clients</span>
           </div>
           <div className="px-3 py-2 hover:bg-stone-800 rounded-sm flex items-center gap-3 transition-colors cursor-pointer">
             <Activity size={18} />
             <span className="text-sm font-medium">Projects</span>
           </div>
           <div className="px-3 py-2 hover:bg-stone-800 rounded-sm flex items-center gap-3 transition-colors cursor-pointer">
             <TrendingUp size={18} />
             <span className="text-sm font-medium">Growth</span>
           </div>
        </nav>

        <div className="p-6 border-t border-stone-800 space-y-1">
           <div className="px-3 py-2 hover:bg-stone-800 rounded-sm flex items-center gap-3 transition-colors cursor-pointer">
              <Settings size={18} />
              <span className="text-sm">Settings</span>
           </div>
           <div className="flex items-center gap-3 px-3 py-4 mt-2">
             <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center text-xs text-white font-bold">
               JD
             </div>
             <div className="text-xs">
               <p className="text-white font-medium">John Doe</p>
               <p className="opacity-60">Admin</p>
             </div>
           </div>
        </div>
      </aside>

      {/* CENTER PANEL - Client Overview */}
      <main className="flex-1 flex flex-col min-w-0 border-r border-stone-200 bg-white">
        {/* Top Header */}
        <header className="h-16 border-b border-stone-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 w-1/2">
            <Search className="text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full bg-transparent outline-none text-sm placeholder:text-stone-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
             <button className="p-2 text-stone-400 hover:text-stone-900 transition-colors">
               <Bell size={18} />
             </button>
             <button className="bg-stone-900 text-white px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors">
               Add Client
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
           {/* KPI Row */}
           <div className="grid grid-cols-3 gap-6 mb-10">
              <div className="p-6 border border-stone-200 rounded-sm bg-stone-50">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Total MRR</p>
                <p className="text-3xl font-serif text-stone-900">$42,000</p>
                <div className="flex items-center gap-1 text-green-600 text-xs font-medium mt-2">
                   <TrendingUp size={14} />
                   <span>+12% vs last month</span>
                </div>
              </div>
              <div className="p-6 border border-stone-200 rounded-sm bg-stone-50">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Active Clients</p>
                <p className="text-3xl font-serif text-stone-900">14</p>
                <div className="flex items-center gap-1 text-stone-500 text-xs font-medium mt-2">
                   <span>2 Onboarding</span>
                </div>
              </div>
              <div className="p-6 border border-stone-200 rounded-sm bg-stone-50">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">At Risk</p>
                <p className="text-3xl font-serif text-stone-900">1</p>
                <div className="flex items-center gap-1 text-red-600 text-xs font-medium mt-2">
                   <AlertTriangle size={14} />
                   <span>Requires attention</span>
                </div>
              </div>
           </div>

           {/* Client List */}
           <h2 className="text-lg font-serif text-stone-900 mb-6">Active Portfolio</h2>
           <div className="grid gap-4">
              {filteredClients.map(client => (
                <div
                  key={client.id}
                  onClick={() => navigate('/app/dashboard')} // navigating to generic dashboard for demo
                  className="group flex items-center justify-between p-5 border border-stone-200 rounded-sm hover:border-stone-900 hover:shadow-sm transition-all cursor-pointer bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-bold text-sm">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900 group-hover:text-accent-600 transition-colors">{client.name}</h3>
                      <p className="text-xs text-stone-500">{client.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                     <div className="text-right">
                        <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Health</p>
                        <div className={`px-2 py-0.5 rounded-full text-xs font-bold border inline-flex items-center gap-1 ${getHealthColor(client.healthScore)}`}>
                           {client.healthScore}/100
                        </div>
                     </div>

                     <div className="text-right hidden md:block w-32">
                        <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Status</p>
                        <p className="text-sm font-medium capitalize">{client.status}</p>
                     </div>

                     <div className="text-right hidden lg:block w-48">
                        <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">Next Action</p>
                        <p className="text-sm text-stone-600 truncate">{client.nextAction}</p>
                     </div>

                     <ChevronRight className="text-stone-300 group-hover:text-stone-900" size={20} />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR - AI Intelligence */}
      <aside className="w-80 bg-stone-50 border-l border-stone-200 shrink-0 flex flex-col">
         <div className="p-6 border-b border-stone-200">
            <h2 className="font-serif text-lg text-stone-900 flex items-center gap-2">
              <MessageSquare size={18} className="text-accent-600"/>
              Agency Intelligence
            </h2>
            <p className="text-xs text-stone-500 mt-1">Real-time cross-client analysis</p>
         </div>

         <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {MOCK_INSIGHTS.map(insight => (
              <div key={insight.id} className="bg-white p-4 border border-stone-200 rounded-sm shadow-sm relative">
                <div className="absolute top-4 right-4 text-[10px] text-stone-400 font-medium">{insight.time}</div>
                <div className="flex items-center gap-2 mb-2">
                   {insight.type === 'risk' && <AlertTriangle size={14} className="text-red-500" />}
                   {insight.type === 'opportunity' && <TrendingUp size={14} className="text-green-500" />}
                   {insight.type === 'update' && <Activity size={14} className="text-blue-500" />}
                   <span className="text-xs font-bold uppercase tracking-wider text-stone-500">{insight.type}</span>
                </div>
                <p className="text-xs font-bold text-stone-900 mb-1">{insight.client}</p>
                <p className="text-sm text-stone-600 leading-relaxed">{insight.message}</p>
                <button className="mt-3 text-xs text-accent-600 font-medium hover:underline flex items-center gap-1">
                  View Context <ArrowUpRight size={12} />
                </button>
              </div>
            ))}

            <div className="p-4 bg-stone-100 rounded-sm text-center">
               <p className="text-xs text-stone-500 mb-2">AI is monitoring 14 data streams</p>
               <div className="flex justify-center gap-1">
                 <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-pulse"></span>
                 <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-pulse delay-75"></span>
                 <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-pulse delay-150"></span>
               </div>
            </div>
         </div>
      </aside>
    </div>
  );
};

export default AgencyDashboard;