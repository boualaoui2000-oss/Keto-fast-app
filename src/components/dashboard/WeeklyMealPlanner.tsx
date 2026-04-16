import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Utensils, Zap, Leaf, Plus, Info, Apple, Heart } from 'lucide-react';
import { RECIPES } from '@/data/recipes';

interface WeeklyMealPlannerProps {
  userProfile: any;
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MEAL_TYPES = ['Petit-Déjeuner', 'Déjeuner', 'Dîner'];

export default function WeeklyMealPlanner({ userProfile }: WeeklyMealPlannerProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [plannedMeals, setPlannedMeals] = useState<Record<string, any>>({});

  // Mock health suggestions
  const healthBoosters = [
    { name: 'Graines de Chia', type: 'Fibre', benefit: 'Digestion', icon: '🌱' },
    { name: 'Baies d\'Açaï', type: 'Antioxydant', benefit: 'Énergie', icon: '🫐' },
    { name: 'Avocat', type: 'Bonnes graisses', benefit: 'Satiété', icon: '🥑' },
    { name: 'Épinards', type: 'Fer', benefit: 'Vitalité', icon: '🥬' },
  ];

  const generatePlan = (dayIndex: number) => {
    const day = DAYS[dayIndex];
    const suggestions = MEAL_TYPES.map(type => {
      const categoryRecipes = RECIPES.filter(r => r.category === type);
      return categoryRecipes[Math.floor(Math.random() * categoryRecipes.length)];
    });

    setPlannedMeals(prev => ({
      ...prev,
      [day]: suggestions
    }));
  };

  const currentDayMeals = plannedMeals[DAYS[selectedDay]] || [];
  const totalCalories = currentDayMeals.reduce((acc: number, m: any) => acc + (m?.calories || 0), 0);
  const totalCarbs = currentDayMeals.reduce((acc: number, m: any) => acc + (m?.carbs || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Diet Status */}
        <Card className="md:col-span-1 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Plan Actuel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="bg-background capitalize">{userProfile.programType}</Badge>
              <Badge variant="outline" className="bg-background">{userProfile.ketoLevel}</Badge>
              <Badge variant="outline" className="bg-background">{userProfile.fastingProtocol}</Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Évolution du régime</span>
                <span>Très bien</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '85%' }} />
              </div>
              <p className="text-[10px] text-muted-foreground">
                85% d'adhérence aux macros cette semaine.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Planner */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" /> Planning Repas
                </CardTitle>
                <CardDescription className="text-xs">Optimisez votre nutrition pour la semaine</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => generatePlan(selectedDay)}>
                <Zap className="h-3 w-3 mr-1 fill-primary text-primary" /> Auto-générer
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 mb-4 overflow-x-auto pb-2 scrollbar-none">
              {DAYS.map((day, idx) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex-1 min-w-[40px] py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedDay === idx 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {MEAL_TYPES.map((type, idx) => {
                const meal = currentDayMeals[idx];
                return (
                  <div key={type} className="flex items-center gap-3 p-2 rounded-xl border border-dashed border-muted-foreground/20 hover:border-primary/50 transition-colors group">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {meal ? (
                        <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <Utensils className="h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-primary uppercase">{type}</p>
                      {meal ? (
                        <h4 className="text-sm font-medium truncate">{meal.title}</h4>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">Non programmé</p>
                      )}
                    </div>
                    {meal ? (
                      <div className="text-right shrink-0">
                        <p className="text-xs font-bold">{meal.calories} kcal</p>
                        <p className="text-[10px] text-muted-foreground">{meal.carbs}g glucides</p>
                      </div>
                    ) : (
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {currentDayMeals.length > 0 && (
              <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs">
                <span className="font-medium">Total du jour :</span>
                <div className="flex gap-4">
                  <span className="font-bold">{totalCalories} kcal</span>
                  <span className={`font-bold ${totalCarbs > 30 ? 'text-red-500' : 'text-green-500'}`}>
                    {totalCarbs}g glucides
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Health Boosters */}
      <Card className="bg-green-50/30 border-green-200/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-green-700">
            <Leaf className="h-4 w-4" /> Volet Santé : Super-aliments
          </CardTitle>
          <CardDescription className="text-xs">Optimisez vos apports en micronutriments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {healthBoosters.map((booster) => (
              <div key={booster.name} className="bg-white/80 border border-green-100 p-3 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="text-2xl group-hover:scale-110 transition-transform">{booster.icon}</div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate">{booster.name}</h4>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] px-1 bg-green-100 text-green-700 rounded-sm font-medium">{booster.type}</span>
                    <span className="text-[9px] text-muted-foreground truncate">{booster.benefit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-white/50 rounded-lg border border-green-100 text-[11px] text-green-800 flex items-start gap-2">
            <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
            <p>
              <strong>Astuce Santé :</strong> Intégrer des fibres (graines de chia) et des antioxydants (baies) aide à mieux gérer l'insuline et soutient votre système immunitaire pendant le jeûne intermittent.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
