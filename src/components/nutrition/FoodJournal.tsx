import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Barcode, Trash2, Utensils, Camera, History } from 'lucide-react';
import { UserProfile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  amount: string;
  time: string;
}

export default function FoodJournal({ userProfile }: { userProfile: UserProfile }) {
  const [entries, setEntries] = useState<FoodEntry[]>([
    { id: '1', name: 'Œufs brouillés au beurre', calories: 320, carbs: 2, protein: 18, fats: 26, amount: '2 œufs', time: '08:30' },
    { id: '2', name: 'Avocat entier', calories: 240, carbs: 3, protein: 2, fats: 22, amount: '150g', time: '10:15' },
  ]);
  const [search, setSearch] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const totalMacros = entries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories,
    carbs: acc.carbs + entry.carbs,
    protein: acc.protein + entry.protein,
    fats: acc.fats + entry.fats,
  }), { calories: 0, carbs: 0, protein: 0, fats: 0 });

  const handleAddMockFood = () => {
    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: search || 'Nouvel aliment',
      calories: 150,
      carbs: 5,
      protein: 10,
      fats: 12,
      amount: '100g',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setEntries([newEntry, ...entries]);
    setSearch('');
    toast.success("Aliment ajouté au journal");
  };

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const scanned: FoodEntry = {
        id: Date.now().toString(),
        name: 'Noix de Macadamia (Scanné)',
        calories: 200,
        carbs: 4,
        protein: 2,
        fats: 21,
        amount: '30g',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setEntries([scanned, ...entries]);
      toast.success("Code-barres reconnu : Noix de Macadamia");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MacroCard label="Calories" current={totalMacros.calories} target={userProfile.targetMacros.calories} unit="kcal" color="primary" />
        <MacroCard label="Glucides" current={totalMacros.carbs} target={userProfile.targetMacros.carbs} unit="g" color="blue-500" />
        <MacroCard label="Protéines" current={totalMacros.protein} target={userProfile.targetMacros.protein} unit="g" color="red-500" />
        <MacroCard label="Lipides" current={totalMacros.fats} target={userProfile.targetMacros.fats} unit="g" color="yellow-500" />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher ou saisir un aliment..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMockFood()}
          />
        </div>
        <Button variant="outline" size="icon" onClick={handleScan} disabled={isScanning}>
          {isScanning ? <Plus className="h-4 w-4 animate-spin" /> : <Barcode className="h-4 w-4" />}
        </Button>
        <Button onClick={handleAddMockFood}>
          <Plus className="h-4 w-4 mr-2" /> Ajouter
        </Button>
      </div>

      {isScanning && (
        <Card className="border-primary bg-primary/5 animate-pulse">
          <CardContent className="p-8 flex flex-col items-center justify-center gap-4">
            <div className="relative w-48 h-32 border-2 border-primary rounded-lg overflow-hidden flex items-center justify-center">
              <div className="absolute inset-x-0 h-0.5 bg-primary animate-scan top-0" />
              <Camera className="h-12 w-12 text-primary opacity-50" />
            </div>
            <p className="text-sm font-medium">Analyse du code-barres en cours...</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Aujourd'hui
          </h3>
          <Badge variant="secondary">{entries.length} aliments</Badge>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-xl border-2 border-dashed">
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground/30 mb-2" />
            <p className="text-muted-foreground text-sm">Votre journal est vide pour aujourd'hui.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <Card key={entry.id} className="group hover:border-primary/50 transition-colors">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {entry.time}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{entry.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{entry.amount} • {entry.calories} kcal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex gap-3 text-[10px] font-medium">
                      <span className="text-blue-600">G: {entry.carbs}g</span>
                      <span className="text-red-600">P: {entry.protein}g</span>
                      <span className="text-yellow-600">L: {entry.fats}g</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setEntries(entries.filter(e => e.id !== entry.id))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MacroCard({ label, current, target, unit, color }: any) {
  const percentage = Math.min(100, (current / target) * 100);
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">{label}</p>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-lg font-bold">{current}</span>
          <span className="text-[10px] text-muted-foreground">{unit}</span>
        </div>
        <Progress value={percentage} className={`h-1.5 bg-muted`} indicatorClassName={`bg-${color}`} />
        <p className="text-[9px] text-right mt-1 text-muted-foreground">{Math.round(percentage)}% de l'objectif</p>
      </CardContent>
    </Card>
  );
}
