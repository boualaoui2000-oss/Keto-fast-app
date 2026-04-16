import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Dumbbell, Zap, Timer as TimerIcon, ChevronRight } from 'lucide-react';

const WORKOUTS = [
  {
    id: '1',
    title: 'HIIT Brûle-Graisse',
    description: 'Séance intense pour maximiser la cétose.',
    duration: '25 min',
    intensity: 'Haute',
    type: 'Cardio',
    image: 'https://picsum.photos/seed/fit1/400/225',
  },
  {
    id: '2',
    title: 'Musculation Full Body',
    description: 'Renforcement musculaire global sans matériel.',
    duration: '40 min',
    intensity: 'Moyenne',
    type: 'Force',
    image: 'https://picsum.photos/seed/fit2/400/225',
  },
  {
    id: '3',
    title: 'Yoga & Mobilité',
    description: 'Récupération active et souplesse.',
    duration: '20 min',
    intensity: 'Basse',
    type: 'Souplesse',
    image: 'https://picsum.photos/seed/fit3/400/225',
  },
];

export default function FitnessProgram() {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold">Programme Sportif</h1>
        <p className="text-sm text-muted-foreground">Des séances adaptées à votre niveau d'énergie Keto.</p>
      </header>

      <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-white/10 skew-x-[-20deg] translate-x-10" />
        <CardHeader>
          <Badge className="w-fit bg-white/20 hover:bg-white/30 border-none text-white">RECOMMANDÉ</Badge>
          <CardTitle className="text-2xl">Cardio à jeun</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Maximisez l'oxydation des graisses en fin de jeûne.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm mb-4">
            <div className="flex items-center gap-1"><TimerIcon className="h-4 w-4" /> 20 min</div>
            <div className="flex items-center gap-1"><Zap className="h-4 w-4" /> Intensité: Basse</div>
          </div>
          <Button variant="secondary" className="w-full md:w-auto">Démarrer la séance</Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Dumbbell className="h-5 w-5" /> Bibliothèque d'exercices
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {WORKOUTS.map((w) => (
            <Card key={w.id} className="flex overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
              <div className="w-32 h-32 md:w-48 md:h-auto relative shrink-0">
                <img 
                  src={w.image} 
                  alt={w.title} 
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-lg scale-0 group-hover:scale-100 transition-transform">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] mb-1">{w.type}</Badge>
                    <span className="text-[10px] font-bold text-orange-600">{w.intensity}</span>
                  </div>
                  <h3 className="font-bold text-sm md:text-base">{w.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{w.description}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <TimerIcon className="h-3 w-3" /> {w.duration}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
