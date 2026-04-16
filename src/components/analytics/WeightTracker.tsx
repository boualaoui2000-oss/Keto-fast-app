import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { Plus, Target, TrendingDown, Scale } from 'lucide-react';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export default function WeightTracker({ userProfile }: { userProfile: UserProfile }) {
  const [weight, setWeight] = useState('');
  
  // Generate initial data based on user's current weight
  const initialWeight = userProfile.weight || 85;
  const targetWeight = userProfile.targetWeight || (userProfile.goal === 'lose' ? initialWeight - 10 : initialWeight + 5);
  
  const [data, setData] = useState(() => {
    const points = [];
    const now = new Date();
    for (let i = 14; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      // Simulate some progress
      const progress = (14 - i) / 14;
      const simulatedWeight = initialWeight - (progress * (initialWeight - (initialWeight - 2))); // Simulate 2kg loss over 2 weeks
      points.push({
        date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        weight: parseFloat(simulatedWeight.toFixed(1)),
        trend: parseFloat(simulatedWeight.toFixed(1))
      });
    }
    return points;
  });
  
  const currentWeight = data[data.length - 1].weight;
  const startWeight = data[0].weight;
  const totalLost = (startWeight - currentWeight).toFixed(1);
  const remaining = Math.abs(currentWeight - targetWeight).toFixed(1);
  const isLosing = userProfile.goal === 'lose';

  const handleAddWeight = () => {
    if (!weight) return;
    const newEntry = {
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      weight: parseFloat(weight),
      trend: (data[data.length - 1].trend * 0.9 + parseFloat(weight) * 0.1)
    };
    setData([...data, newEntry]);
    setWeight('');
    toast.success("Poids enregistré !");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Poids Actuel</p>
              <p className="text-xl font-bold">{currentWeight} kg</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-green-100 p-2 rounded-full">
              <TrendingDown className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Perte Totale</p>
              <p className="text-xl font-bold text-green-600">-{totalLost} kg</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="bg-blue-100 p-2 rounded-full">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">
                {userProfile.goal === 'lose' ? 'Reste à perdre' : userProfile.goal === 'gain' ? 'Reste à gagner' : 'Écart cible'}
              </p>
              <p className="text-xl font-bold text-blue-600">{remaining} kg</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Évolution du poids</CardTitle>
            <CardDescription>Tendance lissée sur les 30 derniers jours</CardDescription>
          </div>
          <div className="flex gap-2">
            <Input 
              type="number" 
              placeholder="kg" 
              className="w-20" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Button size="icon" onClick={handleAddWeight}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#888' }}
                  dy={10}
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#888' }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                  dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="trend" 
                  stroke="#94a3b8" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false}
                />
                <ReferenceLine y={targetWeight} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Objectif', fill: '#ef4444', fontSize: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Projection vers l'objectif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Vitesse actuelle</span>
              <span className="text-sm font-bold text-green-600">-0.8 kg / semaine</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Date estimée de l'objectif</span>
              <span className="text-sm font-bold">15 Juin 2026</span>
            </div>
            <div className="pt-2">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '45%' }} />
              </div>
              <p className="text-[10px] text-right mt-1 text-muted-foreground">45% du chemin parcouru</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Conseil IA</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Votre perte de poids est régulière. La tendance lissée montre que les fluctuations quotidiennes sont normales. Continuez vos jeûnes de 16h, ils semblent porter leurs fruits !
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
