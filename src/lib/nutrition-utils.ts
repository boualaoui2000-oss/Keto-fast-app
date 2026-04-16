import { Macros } from "../types";
import { KETO_RATIOS } from "../constants";

/**
 * Calculates TDEE (Total Daily Energy Expenditure) using Mifflin-St Jeor Equation
 */
export function calculateTDEE(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activityMultiplier: number
): number {
  let bmr: number;
  
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  return Math.round(bmr * activityMultiplier);
}

/**
 * Calculates Keto Macros based on TDEE and goal
 */
export function calculateKetoMacros(tdee: number, goal: 'lose' | 'maintain' | 'gain'): Macros {
  let targetCalories: number;
  
  switch (goal) {
    case 'lose':
      targetCalories = tdee * 0.8; // 20% deficit
      break;
    case 'gain':
      targetCalories = tdee * 1.1; // 10% surplus
      break;
    default:
      targetCalories = tdee;
  }
  
  return {
    calories: Math.round(targetCalories),
    fats: Math.round((targetCalories * KETO_RATIOS.fats) / 9),
    protein: Math.round((targetCalories * KETO_RATIOS.protein) / 4),
    carbs: Math.round((targetCalories * KETO_RATIOS.carbs) / 4),
  };
}
