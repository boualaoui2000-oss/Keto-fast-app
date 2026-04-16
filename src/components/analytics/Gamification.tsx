import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Zap, Flame, Star, Award, Timer, Utensils } from 'lucide-react';
import { UserProfile } from '@/types';
import { Progress } from '@/components/ui/progress';

const BADGES = [
  { id: '1', title: '7 jours keto', description: 'Maintenir la cétose pendant une semaine entière.', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100', unlocked: true },
  { id: '2', title: 'Premier jeûne 18h', description: 'Réussir un jeûne de 18 heures.', icon: Timer, color: 'text-blue-500', bg: 'bg-blue-100', unlocked: true },
  { id: '3', title: 'Chef Keto', description: 'Enregistrer 20 recettes différentes.', icon: Utensils, color: 'text-green-500', bg: 'bg-green-100', unlocked: false },
  { id: '4', title: 'Guerrier HIIT', description: 'Compléter 10 séances de HIIT.', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100', unlocked: true },
  { id: '5', title: 'Poids Cible', description: 'Atteindre son premier palier de poids.', icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-100', unlocked: false },
  { id: '6', title: 'Hydratation Parfaite', description: 'Boire 2.5L d\'eau par jour pendant 5 jours.', icon: Star, color: 'text-cyan-500', bg: 'bg-cyan-100', unlocked: false },
];

export default function Gamification({ userProfile }: { userProfile: UserProfile }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary fill-primary" /> Streaks Actuels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2 mx-auto border-2 border-orange-200">
                  <Flame className="h-8 w-8 text-orange-500" />
                </div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Jours Keto</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-2 mx-auto border-2 border-blue-200">
                  <Timer className="h-8 w-8 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">5</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Jeûnes de suite</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Niveau 4</span>
                <span className="text-muted-foreground">1,250 / 2,000 XP</span>
              </div>
              <Progress value={62.5} className="h-2" />
              <p className="text-[10px] text-center text-muted-foreground italic">Plus que 750 XP pour le niveau 5 !</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Défis en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">30 jours sans sucre</span>
                <Badge variant="secondary">Jour 18/30</Badge>
              </div>
              <Progress value={60} className="h-1.5" />
            </div>
            <div className="p-3 border rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold">Marche matinale (5km)</span>
                <Badge variant="secondary">3/5 cette semaine</Badge>
              </div>
              <Progress value={60} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" /> Badges & Récompenses
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {BADGES.map((badge) => (
            <Card key={badge.id} className={`relative overflow-hidden transition-all hover:scale-105 ${!badge.unlocked ? 'opacity-40 grayscale' : 'shadow-md border-primary/20'}`}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`w-12 h-12 rounded-full ${badge.bg} flex items-center justify-center mb-1`}>
                  <badge.icon className={`h-6 w-6 ${badge.color}`} />
                </div>
                <h4 className="text-[10px] font-bold leading-tight">{badge.title}</h4>
                {!badge.unlocked && (
                  <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-muted p-1 rounded-full">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
