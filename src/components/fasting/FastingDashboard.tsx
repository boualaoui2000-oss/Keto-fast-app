import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, BookOpen } from 'lucide-react';
import FastingHistory from './FastingHistory';
import FastingGuide from './FastingGuide';

export default function FastingDashboard() {
  const [activeSubTab, setActiveSubTab] = useState('history');

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold">Jeûne Intermittent</h1>
        <p className="text-sm text-muted-foreground">Gérez vos sessions et apprenez les meilleures pratiques.</p>
      </header>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Historique
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" /> Guide & Protocoles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-0">
          <FastingHistory />
        </TabsContent>

        <TabsContent value="guide" className="mt-0">
          <FastingGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}
