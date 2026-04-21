import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Ruler, FileText, Trophy } from 'lucide-react';
import WeightTracker from './WeightTracker';
import BodyMeasurements from './BodyMeasurements';
import WeeklyReport from './WeeklyReport';
import Gamification from './Gamification';
import { UserProfile } from '@/types';

interface AnalyticsDashboardProps {
  userProfile: UserProfile;
  onUpdateProfile: (data: Partial<UserProfile>) => void;
}

export default function AnalyticsDashboard({ userProfile, onUpdateProfile }: AnalyticsDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState('weight');

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Suivi & Analytics</h1>
          <p className="text-muted-foreground">Visualisez vos progrès et célébrez vos victoires.</p>
        </div>
      </header>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-muted/50">
          <TabsTrigger value="weight" className="flex flex-col gap-1 py-2 data-[state=active]:bg-background">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs">Poids</span>
          </TabsTrigger>
          <TabsTrigger value="measurements" className="flex flex-col gap-1 py-2 data-[state=active]:bg-background">
            <Ruler className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs">Mesures</span>
          </TabsTrigger>
          <TabsTrigger value="report" className="flex flex-col gap-1 py-2 data-[state=active]:bg-background">
            <FileText className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs">Rapports</span>
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex flex-col gap-1 py-2 data-[state=active]:bg-background">
            <Trophy className="h-4 w-4" />
            <span className="text-[10px] sm:text-xs">Succès</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="mt-0 focus-visible:outline-none">
          <WeightTracker userProfile={userProfile} onUpdateProfile={onUpdateProfile} />
        </TabsContent>

        <TabsContent value="measurements" className="mt-0 focus-visible:outline-none">
          <BodyMeasurements userProfile={userProfile} onUpdateProfile={onUpdateProfile} />
        </TabsContent>

        <TabsContent value="report" className="mt-0 focus-visible:outline-none">
          <WeeklyReport userProfile={userProfile} />
        </TabsContent>

        <TabsContent value="badges" className="mt-0 focus-visible:outline-none">
          <Gamification userProfile={userProfile} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
