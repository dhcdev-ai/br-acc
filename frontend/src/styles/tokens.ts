export const entityColors = {
  person: "#E07A2F",
  company: "#DD6B20",
  contract: "#38A169",
  finance: "#3B82F6",
  sanction: "#DC2626",
  legal: "#CA8A04",
  health: "#EC4899",
  environment: "#0D9488",
  labor: "#64748B",
  education: "#A855F7",
  regulatory: "#2DD4BF",
  property: "#8B5CF6",
} as const;

export type EntityType = keyof typeof entityColors;
