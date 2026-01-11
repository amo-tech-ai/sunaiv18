import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WizardState, BusinessContext, AnalysisState } from '../types';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

const defaultContext: BusinessContext = {
  fullName: '',
  businessName: '',
  website: '',
  industry: '',
  description: '',
  services: []
};

const WizardContext = createContext<WizardState | undefined>(undefined);

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<BusinessContext>(defaultContext);
  const [analysis, setAnalysisState] = useState<AnalysisState>({
    status: 'idle',
    content: '',
    signals: []
  });
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Initialize Session & Auth
  useEffect(() => {
    const initSession = async () => {
      setIsLoading(true);
      
      try {
        // 1. Authenticate (Anonymous) with Fallback
        let session = null;
        let currentUser: User | null = null;
        
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          session = sessionData.session;
          
          if (!session) {
            const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
            if (authError) throw authError;
            session = authData.session;
          }
          currentUser = session?.user || null;
        } catch (authError) {
          console.warn("Supabase Auth failed (likely disabled on server). Enabling Guest Mode.", authError);
          // Fallback to Guest Mode
          setUser({ id: 'guest', email: 'guest@example.com' } as User);
          setOrgId('guest-org');
          setProjectId('guest-project');
          setSessionId('guest-session');
          setIsLoading(false);
          return;
        }

        if (!currentUser) throw new Error("Failed to authenticate user.");
        setUser(currentUser);

        // 2. Identify or Create Organization
        let currentOrgId: string | null = null;
        let currentProjectId: string | null = null;

        // Check if user already belongs to a team/org
        const { data: memberships } = await supabase
          .from('team_members')
          .select('org_id')
          .eq('user_id', currentUser.id)
          .limit(1);

        if (memberships && memberships.length > 0) {
          currentOrgId = memberships[0].org_id;
          
          // Fetch existing project (assume single project for MVP)
          const { data: existingProject } = await supabase
             .from('projects')
             .select('id')
             .eq('org_id', currentOrgId)
             .limit(1)
             .single();
             
          if (existingProject) {
              currentProjectId = existingProject.id;
          }
        } else {
          // Provision New Account: Org -> Team Member -> Client -> Project
          
          // A. Create Org
          const { data: newOrg, error: orgError } = await supabase
            .from('organizations')
            .insert({ name: 'My Business' })
            .select()
            .single();
            
          if (orgError || !newOrg) throw orgError || new Error("Failed to create organization");
          currentOrgId = newOrg.id;

          // B. Add User to Org
          await supabase.from('team_members').insert({
            org_id: newOrg.id,
            user_id: currentUser.id,
            role: 'owner'
          });

          // C. Create Default Client
          const { data: newClient, error: clientError } = await supabase
            .from('clients')
            .insert({ 
                org_id: newOrg.id, 
                name: 'My Company', 
                status: 'onboarding' 
            })
            .select()
            .single();

          if (clientError || !newClient) throw clientError || new Error("Failed to create client");

          // D. Create Default Project
          const { data: newProject, error: projectError } = await supabase
             .from('projects')
             .insert({
                 org_id: newOrg.id,
                 client_id: newClient.id,
                 status: 'discovery',
                 current_step: 1,
                 progress: 0
             })
             .select()
             .single();
             
          if (projectError || !newProject) throw projectError || new Error("Failed to create project");
          currentProjectId = newProject.id;
        }

        setOrgId(currentOrgId);
        setProjectId(currentProjectId);

        // 3. Wizard Session Management
        if (currentOrgId) {
          // Check for most recent session for this project
          let sessionQuery = supabase
            .from('wizard_sessions')
            .select('*')
            .eq('org_id', currentOrgId)
            .order('updated_at', { ascending: false })
            .limit(1);

          // If we have a specific project, prefer filtering by that
          if (currentProjectId) {
             sessionQuery = sessionQuery.eq('project_id', currentProjectId);
          }

          const { data: existingSession } = await sessionQuery.single();

          if (existingSession) {
            setSessionId(existingSession.id);
            setStep(existingSession.current_step);

            // Restore Step 1 Answers
            const { data: answers } = await supabase
              .from('wizard_answers')
              .select('*')
              .eq('session_id', existingSession.id)
              .eq('step_number', 1)
              .single();

            if (answers && answers.data) {
              setData(prev => ({ ...prev, ...(answers.data as unknown as Partial<BusinessContext>) }));
            }
          } else {
            // Create New Wizard Session
            const { data: newSession, error: sessionError } = await supabase
              .from('wizard_sessions')
              .insert({
                org_id: currentOrgId,
                project_id: currentProjectId,
                current_step: 1
              })
              .select()
              .single();

            if (newSession) {
              setSessionId(newSession.id);
            } else if (sessionError) {
              console.error("Failed to create wizard session:", sessionError);
            }
          }
        }

      } catch (error) {
        console.error("Initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, []);

  const updateData = (newData: Partial<BusinessContext>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const setAnalysis = (newAnalysis: Partial<AnalysisState>) => {
    setAnalysisState(prev => ({ ...prev, ...newAnalysis }));
  };

  const saveStep = async (stepNumber: number, payload: any) => {
    // Guest Mode: Skip DB save
    if (sessionId === 'guest-session') {
      console.log("Guest Mode: Saving step locally only", stepNumber);
      if (stepNumber === 1) updateData(payload); 
      setStep(stepNumber + 1);
      return;
    }

    if (!sessionId || !orgId) {
        console.warn("No session or org ID available for saving.");
        return;
    }

    try {
      // 1. Upsert Answer
      const { data: existing } = await supabase
          .from('wizard_answers')
          .select('id')
          .eq('session_id', sessionId)
          .eq('step_number', stepNumber)
          .single();

      if (existing) {
          await supabase
              .from('wizard_answers')
              .update({ data: payload })
              .eq('id', existing.id);
      } else {
          await supabase
              .from('wizard_answers')
              .insert({
                  session_id: sessionId,
                  step_number: stepNumber,
                  data: payload,
                  org_id: orgId
              });
      }

      // 2. Update Session Step
      await supabase
          .from('wizard_sessions')
          .update({ current_step: stepNumber + 1 })
          .eq('id', sessionId);
          
      setStep(stepNumber + 1);
    } catch (error) {
      console.error("Failed to save step:", error);
      // Even if DB fails, allow user to proceed in UI
      setStep(stepNumber + 1);
    }
  };

  return (
    <WizardContext.Provider value={{ step, data, updateData, analysis, setAnalysis, sessionId, isLoading, saveStep }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};