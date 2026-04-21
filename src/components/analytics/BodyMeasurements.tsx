import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Ruler, Plus, History, ChevronRight } from 'lucide-react';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

const MOCK_MEASUREMENTS = [
  { date: '01/04', waist: 92, hips: 105, chest: 102 },
  { date: '08/04', waist: 90.5, hips: 104, chest: 101.5 },
  { date: '15/04', waist: 89, hips: 103.5, chest: 101 },
];

export default function BodyMeasurements({ userProfile, onUpdateProfile }: { userProfile: UserProfile, onUpdateProfile: (data: Partial<UserProfile>) => void }) {
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [chest, setChest] = useState('');
  const [data, setData] = useState(MOCK_MEASUREMENTS);

  const handleAdd = () => {
    if (!waist || !hips) return;
    const newEntry = {
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      waist: parseFloat(waist),
      hips: parseFloat(hips),
      chest: chest ? parseFloat(chest) : data[data.length - 1].chest
    };
    setData([...data, newEntry]);
    setWaist('');
    setHips('');
    setChest('');
    onUpdateProfile({
      lastMeasurementAt: new Date().toISOString()
    });
    toast.success("Mesures enregistrées !");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Nouvelles mesures
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="waist">Tour de taille (cm)</Label>
              <Input id="waist" type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="Ex: 85" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hips">Tour de hanches (cm)</Label>
              <Input id="hips" type="number" value={hips} onChange={(e) => setHips(e.target.value)} placeholder="Ex: 102" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chest">Tour de poitrine (cm)</Label>
              <Input id="chest" type="number" value={chest} onChange={(e) => setChest(e.target.value)} placeholder="Ex: 100" />
            </div>
            <Button className="w-full" onClick={handleAdd}>Enregistrer</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Historique des mesures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="waist" name="Taille" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="hips" name="Hanches" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="chest" name="Poitrine" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Dernières variations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Tour de taille', current: 89, change: -3, unit: 'cm' },
              { label: 'Tour de hanches', current: 103.5, change: -1.5, unit: 'cm' },
              { label: 'Tour de poitrine', current: 101, change: -1, unit: 'cm' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-md border">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.current} {item.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">{item.change} {item.unit}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">depuis le début</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
