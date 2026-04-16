import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Droplets, Plus, Minus } from 'lucide-react';

interface HydrationTrackerProps {
  current: number;
  target: number;
  onUpdate: (amount: number) => void;
}

export default function HydrationTracker({ current, target, onUpdate }: HydrationTrackerProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div className="p-4 border rounded-xl bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Droplets className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Hydratation</h3>
            <p className="text-xs text-muted-foreground">Objectif: {target}ml</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-blue-600">{current}</span>
          <span className="text-xs text-muted-foreground ml-1">ml</span>
        </div>
      </div>
      
      <div className="relative h-4 w-full bg-blue-50 rounded-full overflow-hidden mb-4">
        <div 
          className="h-full bg-blue-500 transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onUpdate(250)}
        >
          <Plus className="h-4 w-4 mr-1" /> 250ml
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onUpdate(500)}
        >
          <Plus className="h-4 w-4 mr-1" /> 500ml
        </Button>
      </div>
    </div>
  );
}
