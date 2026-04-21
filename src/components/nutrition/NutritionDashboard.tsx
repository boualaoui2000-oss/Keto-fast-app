import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BookOpen, ClipboardList, ShoppingCart, Utensils } from 'lucide-react';
import NutritionLibrary from './NutritionLibrary';
import WeeklyMealPlan from './WeeklyMealPlan';
import FoodJournal from './FoodJournal';
import ShoppingList from './ShoppingList';
import { UserProfile } from '@/types';

interface NutritionDashboardProps {
  userProfile: UserProfile;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
}

export default function NutritionDashboard({ userProfile, onUpdateProfile }: NutritionDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState('plan');

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nutrition & Repas</h1>
          <p className="text-muted-foreground">Gérez votre alimentation keto et vos objectifs nutritionnels.</p>
        </div>
      </header>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-muted/50">
          <TabsTrigger value="plan" className="flex flex-col gap-1 py-2 data-[state=active]:bg-background">
            <Calendar className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs">Plan Hebdo</span>
          </TabsTrigger>
          <TabsTrigger value="library" className="flex flex-col gap-1 py-2 data-[state=active]:bg-background">
            <BookOpen className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs">Recettes</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex flex-col gap-1 py-2 data-[state=active]:bg-background">
            <ClipboardList className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs">Journal</span>
          </TabsTrigger>
          <TabsTrigger value="shopping" className="flex flex-col gap-1 py-2 data-[state=active]:bg-background">
            <ShoppingCart className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs">Courses</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plan" className="mt-0 focus-visible:outline-none">
          <WeeklyMealPlan userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="library" className="mt-0 focus-visible:outline-none">
          <NutritionLibrary />
        </TabsContent>

        <TabsContent value="journal" className="mt-0 focus-visible:outline-none">
          <FoodJournal userProfile={userProfile} onUpdateProfile={onUpdateProfile} />
        </TabsContent>

        <TabsContent value="shopping" className="mt-0 focus-visible:outline-none">
          <ShoppingList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
