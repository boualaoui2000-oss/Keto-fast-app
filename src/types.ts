export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  age?: number;
  weight?: number; // in kg
  targetWeight?: number; // in kg
  height?: number; // in cm
  gender?: 'male' | 'female' | 'other';
  goal: 'lose' | 'maintain' | 'gain';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  dietPreference: 'omnivore' | 'vegetarian' | 'vegan';
  programType: 'fasting' | 'keto' | 'both';
  allergies: string[];
  healthConditions: string[];
  fastingProtocol: string; // e.g., '16:8'
  ketoLevel: 'beginner' | 'intermediate' | 'advanced';
  targetMacros: Macros;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FastingSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  targetDuration: number; // in hours
  status: 'active' | 'completed' | 'interrupted';
  type: string; // protocol name
}

export interface MealLog {
  id: string;
  userId: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface HydrationLog {
  id: string;
  userId: string;
  date: string;
  amount: number; // in ml
}

export interface WeightLog {
  id: string;
  userId: string;
  date: string;
  weight: number;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string;
  type: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  caloriesBurned: number;
}
