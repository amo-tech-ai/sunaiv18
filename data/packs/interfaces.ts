export interface DiagnosticOption {
  label: string;
  value: string;
  mapped_system_id?: string;
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  type: 'single' | 'multi' | 'rating';
  options: DiagnosticOption[];
}

export interface DiagnosticSection {
  title: string;
  questions: DiagnosticQuestion[];
}

export interface IndustryPack {
  id: string;
  name: string;
  diagnostics: DiagnosticSection[];
}