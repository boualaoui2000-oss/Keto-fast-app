import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

const MOCK_HISTORY = [
  { id: '1', date: subDays(new Date(), 1), duration: 16.5, target: 16, status: 'completed' },
  { id: '2', date: subDays(new Date(), 2), duration: 18.2, target: 18, status: 'completed' },
  { id: '3', date: subDays(new Date(), 3), duration: 14.5, target: 16, status: 'interrupted' },
  { id: '4', date: subDays(new Date(), 4), duration: 16.1, target: 16, status: 'completed' },
  { id: '5', date: subDays(new Date(), 5), duration: 16.0, target: 16, status: 'completed' },
  { id: '6', date: subDays(new Date(), 6), duration: 17.5, target: 16, status: 'completed' },
  { id: '7', date: subDays(new Date(), 7), duration: 16.2, target: 16, status: 'completed' },
];

export default function FastingHistory() {
  const successRate = Math.round((MOCK_HISTORY.filter(h => h.status === 'completed').length / MOCK_HISTORY.length) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-none">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">{successRate}%</div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Taux de réussite</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-none">
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-orange-600">7</div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Série actuelle (jours)</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" /> 7 derniers jours
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {MOCK_HISTORY.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {item.status === 'completed' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{format(item.date, 'EEEE d MMMM', { locale: fr })}</p>
                    <p className="text-xs text-muted-foreground">Objectif: {item.target}h</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-bold">
                    <Clock className="h-3 w-3" /> {item.duration}h
                  </div>
                  <Badge variant={item.status === 'completed' ? 'secondary' : 'destructive'} className="text-[10px] px-1 py-0 h-4">
                    {item.status === 'completed' ? 'Réussi' : 'Échoué'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none">
        <CardContent className="p-6">
          <h3 className="font-bold mb-2">Phases du Jeûne</h3>
          <div className="space-y-4 mt-4">
            <div className="flex gap-3">
              <div className="w-1 bg-white/30 rounded-full" />
              <div>
                <h4 className="text-xs font-bold uppercase">0-4h : Digestion</h4>
                <p className="text-[11px] opacity-80">Le corps traite le dernier repas.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1 bg-white/30 rounded-full" />
              <div>
                <h4 className="text-xs font-bold uppercase">4-12h : Brûlage de graisses</h4>
                <p className="text-[11px] opacity-80">Le taux de sucre baisse, le corps commence à puiser dans les graisses.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1 bg-white rounded-full" />
              <div>
                <h4 className="text-xs font-bold uppercase">12-18h : Cétose</h4>
                <p className="text-[11px]">Production de corps cétoniques. Énergie mentale accrue.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
