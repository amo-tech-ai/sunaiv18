import { IndustryPack } from './packs/interfaces';
import { FASHION_PACK } from './packs/fashion';
import { SAAS_PACK } from './packs/saas';
import { REAL_ESTATE_PACK } from './packs/real_estate';
import { AGENCY_PACK } from './packs/agency';
import { GENERIC_PACK } from './packs/generic';

// Re-export interfaces so consumers don't break
export * from './packs/interfaces';

export const getIndustryPack = (industry: string | undefined | null): IndustryPack => {
  if (!industry) return GENERIC_PACK;
  
  const ind = industry.toLowerCase();
  
  if (ind.includes('fashion') || ind.includes('retail')) return FASHION_PACK;
  if (ind.includes('saas') || ind.includes('technology')) return SAAS_PACK;
  if (ind.includes('real estate')) return REAL_ESTATE_PACK;
  if (ind.includes('agency') || ind.includes('consulting') || ind.includes('services')) return AGENCY_PACK;
  
  // Fallback
  return GENERIC_PACK;
};