import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, Utensils, Info } from 'lucide-react';
import { RECIPES } from '@/data/recipes';
import { Recipe } from './RecipeCard';
import { UserProfile } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface MealPlanDay {
  date: string;
  meals: {
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
    snack: Recipe;
  };
}

const PROTOCOL_MEALS: Record<string, any> = {
  '16:8': {
    breakfast: { title: 'Omelette Berbère aux Tomates', calories: 280, carbs: 6, protein: 18, fats: 22, image: 'https://picsum.photos/seed/omelette-keto/400/225' },
    lunch: { title: 'Oeufs brouillés au beurre & Avocat', calories: 550, carbs: 4, protein: 25, fats: 45, image: 'https://picsum.photos/seed/eggs-avocado/400/225' },
    dinner: { title: 'Poulet rôti & Légumes au beurre', calories: 650, carbs: 6, protein: 35, fats: 52, image: 'https://picsum.photos/seed/roast-chicken/400/225' },
    snack: { title: 'Noix de macadamia & Chocolat noir', calories: 250, carbs: 3, protein: 5, fats: 24, image: 'https://picsum.photos/seed/nuts-choco/400/225' }
  },
  '18:6': {
    breakfast: null, // Skipped in 18:6
    lunch: { title: 'Bowl keto : thon, oeuf & avocat', calories: 580, carbs: 5, protein: 35, fats: 42, image: 'https://picsum.photos/seed/keto-bowl/400/225' },
    dinner: { title: 'Saumon & Purée de chou-fleur', calories: 620, carbs: 5, protein: 38, fats: 48, image: 'https://picsum.photos/seed/salmon-cauli/400/225' },
    snack: { title: 'Concombre & Cream cheese', calories: 200, carbs: 3, protein: 8, fats: 16, image: 'https://picsum.photos/seed/cucumber-cream/400/225' }
  },
  '20:4': {
    breakfast: null,
    lunch: { title: 'Steak de boeuf & Oeufs au plat', calories: 750, carbs: 5, protein: 48, fats: 58, image: 'https://picsum.photos/seed/steak-eggs/400/225' },
    dinner: { title: 'Yogourt grec & Noix mélangées', calories: 350, carbs: 6, protein: 12, fats: 28, image: 'https://picsum.photos/seed/greek-yogurt/400/225' },
    snack: { title: 'Bouillon d\'os & Bacon', calories: 280, carbs: 1, protein: 15, fats: 22, image: 'https://picsum.photos/seed/bone-broth/400/225' }
  }
};

export default function WeeklyMealPlan({ userProfile }: { userProfile: UserProfile }) {
  const [plan, setPlan] = useState<MealPlanDay[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const protocol = userProfile.fastingProtocol || '16:8';

  const generatePlan = () => {
    setIsGenerating(true);
    const newPlan: MealPlanDay[] = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    
    const breakfasts = RECIPES.filter(r => r.category === 'Petit-Déjeuner');
    const lunches = RECIPES.filter(r => r.category === 'Déjeuner');
    const dinners = RECIPES.filter(r => r.category === 'Dîner');
    const snacks = RECIPES.filter(r => r.category === 'Collation');

    const protocolDefaults = PROTOCOL_MEALS[protocol] || PROTOCOL_MEALS['16:8'];

    days.forEach((day, i) => {
      // 5:2 Protocol Logic
      const isFastDay = protocol === '5:2' && (i === 1 || i === 4); // Mardi & Vendredi

      if (isFastDay) {
        newPlan.push({
          date: day,
          meals: {
            breakfast: { title: 'Café noir ou Thé vert', calories: 0, carbs: 0, protein: 0, fats: 0, category: 'Petit-Déjeuner', image: 'https://picsum.photos/seed/black-coffee/400/225' } as any,
            lunch: { title: 'Bouillon de légumes clair', calories: 50, carbs: 4, protein: 1, fats: 2, category: 'Déjeuner', image: 'https://picsum.photos/seed/clear-broth/400/225' } as any,
            dinner: { title: 'Soupe courgette & 2 oeufs durs', calories: 430, carbs: 4, protein: 22, fats: 32, category: 'Dîner', image: 'https://picsum.photos/seed/zucchini-soup/400/225' } as any,
            snack: { title: 'Eau citronnée', calories: 0, carbs: 0, protein: 0, fats: 0, category: 'Collation', image: 'https://picsum.photos/seed/lemon-water/400/225' } as any,
          }
        });
      } else {
        newPlan.push({
          date: day,
          meals: {
            breakfast: protocolDefaults.breakfast || breakfasts[Math.floor(Math.random() * breakfasts.length)],
            lunch: protocolDefaults.lunch || lunches[Math.floor(Math.random() * lunches.length)],
            dinner: protocolDefaults.dinner || dinners[Math.floor(Math.random() * dinners.length)],
            snack: protocolDefaults.snack || snacks[Math.floor(Math.random() * snacks.length)],
          }
        });
      }
    });

    setTimeout(() => {
      setPlan(newPlan);
      setIsGenerating(false);
      toast.success(`Plan ${protocol} généré !`);
    }, 1000);
  };

  useEffect(() => {
    if (plan.length === 0) generatePlan();
  }, []);

  const swapMeal = (mealType: keyof MealPlanDay['meals']) => {
    const categoryMap: Record<keyof MealPlanDay['meals'], string> = {
      breakfast: 'Petit-Déjeuner',
      lunch: 'Déjeuner',
      dinner: 'Dîner',
      snack: 'Collation'
    };
    
    const candidates = RECIPES.filter(r => r.category === categoryMap[mealType]);
    const currentId = plan[selectedDayIndex].meals[mealType].id;
    let next = candidates[Math.floor(Math.random() * candidates.length)];
    
    // Ensure we get a different one
    while (next.id === currentId && candidates.length > 1) {
      next = candidates[Math.floor(Math.random() * candidates.length)];
    }

    const newPlan = [...plan];
    newPlan[selectedDayIndex].meals[mealType] = next;
    setPlan(newPlan);
    toast.info("Repas remplacé !");
  };

  const currentDay = plan[selectedDayIndex];

  if (plan.length === 0) return <div className="py-20 text-center">Génération du plan...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-muted/30 p-2 rounded-xl border">
        <Button variant="ghost" size="icon" onClick={() => setSelectedDayIndex(prev => (prev > 0 ? prev - 1 : 6))}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h3 className="font-bold text-lg">{currentDay.date}</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Jour {selectedDayIndex + 1} sur 7</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelectedDayIndex(prev => (prev < 6 ? prev + 1 : 0))}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(currentDay.meals) as Array<keyof typeof currentDay.meals>).map((type) => {
          const meal = currentDay.meals[type];
          if (!meal || meal.calories === 0) return null; // Skip skipped meals or zero-cal drinks
          
          const labels: Record<keyof typeof currentDay.meals, string> = { breakfast: 'Petit-Déjeuner', lunch: 'Déjeuner', dinner: 'Dîner', snack: 'Collation' };
          
          return (
            <Card key={type} className="overflow-hidden border-l-4 border-l-primary group">
              <div className="flex h-32">
                <div className="w-32 shrink-0 relative">
                  <img src={meal.image} alt={meal.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20">
                        {labels[type]}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-muted-foreground hover:text-primary"
                        onClick={() => swapMeal(type as keyof MealPlanDay['meals'])}
                      >
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                    <h4 className="font-bold text-sm line-clamp-2 leading-tight">{meal.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-medium">
                    <span className="text-orange-600">{meal.calories} kcal</span>
                    <span className="text-blue-600">G: {meal.carbs}g</span>
                    <span className="text-red-600">P: {meal.protein}g</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Macros du jour ({protocol})</h4>
            <div className="flex gap-4 mt-1">
              <div className="text-xs">
                <span className="text-muted-foreground">Calories:</span>{' '}
                <span className="font-bold">
                  {(Object.values(currentDay.meals) as Recipe[]).reduce((acc, m) => acc + (m?.calories || 0), 0)} / {protocol === '5:2' && (selectedDayIndex === 1 || selectedDayIndex === 4) ? 500 : userProfile.targetMacros.calories}
                </span>
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Glucides:</span>{' '}
                <span className="font-bold">
                  {(Object.values(currentDay.meals) as Recipe[]).reduce((acc, m) => acc + (m?.carbs || 0), 0)}g / {userProfile.targetMacros.carbs}g
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="ml-auto" onClick={generatePlan} disabled={isGenerating}>
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Régénérer la semaine"}
          </Button>
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {plan.map((day, i) => (
          <button
            key={i}
            onClick={() => setSelectedDayIndex(i)}
            className={`shrink-0 w-12 h-16 rounded-xl border flex flex-col items-center justify-center transition-all ${
              selectedDayIndex === i 
                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' 
                : 'bg-background text-muted-foreground hover:border-primary/50'
            }`}
          >
            <span className="text-[10px] font-medium opacity-70">{day.date.substring(0, 3)}</span>
            <span className="text-sm font-bold">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
