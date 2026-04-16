import React from 'react';
import { Plus, Scale, Utensils, Droplets, Dumbbell } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
  userProfile: any;
}

export default function QuickActions({ onAction, userProfile }: QuickActionsProps) {
  const allActions = [
    { id: 'meal', label: 'Repas', icon: Utensils, color: 'text-green-600', bg: 'bg-green-50', program: ['keto', 'both'] },
    { id: 'weight', label: 'Poids', icon: Scale, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'water', label: 'Eau', icon: Droplets, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { id: 'workout', label: 'Sport', icon: Dumbbell, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const actions = allActions.filter(action => 
    !action.program || action.program.includes(userProfile.programType)
  );

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all active:scale-95 group"
        >
          <div className={`p-2 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
            <action.icon className="h-5 w-5" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
