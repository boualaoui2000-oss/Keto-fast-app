export const FASTING_PROTOCOLS = [
  {
    id: '16:8',
    name: 'Le 16:8',
    fastHours: 16,
    eatHours: 8,
    description: '16 heures de jeûne et 8 heures d\'alimentation. Idéal pour débuter.',
  },
  {
    id: '18:6',
    name: 'Le 18:6',
    fastHours: 18,
    eatHours: 6,
    description: 'Un peu plus intense, favorise davantage la cétose.',
  },
  {
    id: '20:4',
    name: 'Le 20:4 (Warrior Diet)',
    fastHours: 20,
    eatHours: 4,
    description: 'Fenêtre d\'alimentation très courte pour des résultats rapides.',
  },
  {
    id: '5:2',
    name: 'Le 5:2',
    fastHours: 24,
    eatHours: 24,
    description: 'Manger normalement 5 jours, jeûner ou manger très peu 2 jours.',
  },
  {
    id: 'OMAD',
    name: 'OMAD (One Meal A Day)',
    fastHours: 23,
    eatHours: 1,
    description: 'Un seul repas par jour. Pour les pratiquants avancés.',
  },
];

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sédentaire', multiplier: 1.2 },
  { id: 'light', label: 'Légèrement actif', multiplier: 1.375 },
  { id: 'moderate', label: 'Modérément actif', multiplier: 1.55 },
  { id: 'active', label: 'Très actif', multiplier: 1.725 },
  { id: 'very_active', label: 'Extrêmement actif', multiplier: 1.9 },
];

export const KETO_RATIOS = {
  fats: 0.70,
  protein: 0.25,
  carbs: 0.05,
};
