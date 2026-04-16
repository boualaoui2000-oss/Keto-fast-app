import React from 'react';
import { Progress } from '@/components/ui/progress';

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

function MacroBar({ label, current, target, unit, color }: MacroBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">
          {current}{unit} / {target}{unit}
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface MacrosDisplayProps {
  consumed: { calories: number; carbs: number; protein: number; fats: number };
  targets: { calories: number; carbs: number; protein: number; fats: number };
}

export default function MacrosDisplay({ consumed, targets }: MacrosDisplayProps) {
  return (
    <div className="space-y-4 p-4 border rounded-xl bg-card">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h3 className="text-sm font-semibold">Calories</h3>
          <p className="text-2xl font-bold">{consumed.calories} <span className="text-sm font-normal text-muted-foreground">kcal</span></p>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          Objectif: {targets.calories} kcal
        </div>
      </div>
      <Progress value={(consumed.calories / targets.calories) * 100} className="h-3" />
      
      <div className="grid grid-cols-1 gap-3 mt-6">
        <MacroBar 
          label="Glucides Nets" 
          current={consumed.carbs} 
          target={targets.carbs} 
          unit="g" 
          color="bg-blue-500" 
        />
        <MacroBar 
          label="Protéines" 
          current={consumed.protein} 
          target={targets.protein} 
          unit="g" 
          color="bg-red-500" 
        />
        <MacroBar 
          label="Lipides" 
          current={consumed.fats} 
          target={targets.fats} 
          unit="g" 
          color="bg-yellow-500" 
        />
      </div>
    </div>
  );
}
