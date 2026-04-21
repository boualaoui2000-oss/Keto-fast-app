import React from 'react';
import FastingRing from './FastingRing';
import MacrosDisplay from './MacrosDisplay';
import HydrationTracker from './HydrationTracker';
import QuickActions from './QuickActions';
import WeeklyMealPlanner from './WeeklyMealPlanner';
import DataIntegrityReminders from './DataIntegrityReminders';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, Dumbbell, Brain, Zap, Clock, Info, TrendingDown, Sparkles, ChevronRight } from 'lucide-react';
import { RECIPES } from '@/data/recipes';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { format, differenceInDays, differenceInWeeks, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardProps {
  userProfile: any;
  fastingSession: any;
  consumedMacros: any;
  hydration: number;
  onAddHydration: (amount: number) => void;
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ 
  userProfile, 
  fastingSession, 
  consumedMacros, 
  hydration,
  onAddHydration,
  onNavigate
}: DashboardProps) {
  // Pick a random recipe for "Next Meal" for demo purposes
  const nextMeal = RECIPES[Math.floor(Math.random() * 20)];

  // Generate dynamic weekly data based on user weight
  const userWeight = userProfile.weight || 85;
  
  const createdDate = userProfile.createdAt ? parseISO(userProfile.createdAt) : new Date();
  const dayCount = differenceInDays(new Date(), createdDate) + 1;
  const weekCount = differenceInWeeks(new Date(), createdDate) + 1;
  const formattedDate = format(new Date(), 'EEEE d MMMM', { locale: fr });

  const weeklyData = [
    { day: 'Lun', weight: userWeight + 1.1 },
    { day: 'Mar', weight: userWeight + 0.8 },
    { day: 'Mer', weight: userWeight + 0.9 },
    { day: 'Jeu', weight: userWeight + 0.4 },
    { day: 'Ven', weight: userWeight + 0.1 },
    { day: 'Sam', weight: userWeight - 0.2 },
    { day: 'Dim', weight: userWeight },
  ];

  const handleQuickAction = (id: string) => {
    switch (id) {
      case 'meal':
        onNavigate('nutrition');
        break;
      case 'weight':
        onNavigate('analytics');
        break;
      case 'water':
        onAddHydration(250);
        break;
      case 'workout':
        onNavigate('fitness');
        break;
      default:
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase">Bonjour, {userProfile.displayName || 'Ketoer'} !</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {formattedDate} • Semaine {weekCount}, Jour {dayCount}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold shadow-sm border border-yellow-200">
            <Zap className="h-3 w-3 fill-current" />
            SCORE CÉTOSE: 8.5
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Info className="h-2.5 w-2.5" /> Basé sur vos macros & jeûne
          </p>
        </div>
      </header>

      <DataIntegrityReminders userProfile={userProfile} onNavigate={onNavigate} />

      {/* AI Insight Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="h-16 w-16 text-primary" />
        </div>
        <CardContent className="p-5 flex items-start gap-4">
          <div className="bg-primary/20 p-2.5 rounded-xl shrink-0">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold flex items-center gap-2">
              Conseil Keto AI du jour
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              "Votre glycémie est stable. C'est le moment idéal pour votre séance de sport à jeun. Ajoutez une pincée de sel marin à votre eau pour maintenir vos électrolytes."
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Planner & Diet Evolution */}
      <WeeklyMealPlanner userProfile={userProfile} />

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} userProfile={userProfile} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fasting Section */}
        {(userProfile.programType === 'fasting' || userProfile.programType === 'both') && (
          <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-br from-orange-50 to-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-500" /> Jeûne Intermittent
              </CardTitle>
              <CardDescription className="text-xs">Protocole {fastingSession.type}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-4">
              <FastingRing 
                startTime={new Date(fastingSession.startTime)} 
                targetHours={fastingSession.targetDuration} 
                isFasting={fastingSession.status === 'active'} 
              />
              <div className="mt-6 flex gap-3 w-full">
                <Button className="flex-1 bg-orange-500 hover:bg-orange-600 shadow-md">
                  {fastingSession.status === 'active' ? 'Arrêter le jeûne' : 'Démarrer le jeûne'}
                </Button>
                <Button variant="outline" className="flex-1">Ajuster</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Macros Section */}
        {(userProfile.programType === 'keto' || userProfile.programType === 'both') && (
          <MacrosDisplay 
            consumed={consumedMacros} 
            targets={userProfile.targetMacros} 
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Overview Sparkline */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-500" /> Tendance Poids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorWeight)" 
                  />
                  <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-bold text-green-600">-1.1 kg cette semaine</span>
              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2">Détails <ChevronRight className="h-3 w-3 ml-1" /></Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Meal */}
        {(userProfile.programType === 'keto' || userProfile.programType === 'both') && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Utensils className="h-4 w-4 text-green-500" /> Prochain Repas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative group">
                  <img 
                    src={nextMeal.image} 
                    alt={nextMeal.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                    <Clock className="h-3 w-3" /> {nextMeal.time}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm line-clamp-1">{nextMeal.title}</h4>
                  <p className="text-xs text-muted-foreground">{nextMeal.calories} kcal • {nextMeal.carbs}g glucides</p>
                </div>
                <Button variant="secondary" size="sm" className="w-full text-xs">Voir la recette</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hydration */}
        <HydrationTracker 
          current={hydration} 
          target={2500} 
          onUpdate={onAddHydration} 
        />
      </div>

      {/* Daily Workout Summary */}
      <Card className="bg-blue-50/50 border-blue-100">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <Dumbbell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm">HIIT Brûle-Graisse</h4>
              <p className="text-xs text-muted-foreground">25 minutes • Intensité haute • 320 kcal est.</p>
            </div>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Démarrer</Button>
        </CardContent>
      </Card>
    </div>
  );
}


