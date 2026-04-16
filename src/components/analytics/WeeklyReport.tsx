import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, CheckCircle2, Timer, Utensils, Dumbbell, TrendingDown, ArrowRight } from 'lucide-react';
import { UserProfile } from '@/types';
import { toast } from 'sonner';

export default function WeeklyReport({ userProfile }: { userProfile: UserProfile }) {
  const handleExport = () => {
    toast.info("Génération du rapport PDF en cours...");
    setTimeout(() => {
      toast.success("Rapport mensuel exporté avec succès !");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Rapport Hebdomadaire</h3>
          <p className="text-sm text-muted-foreground">Semaine du 5 au 12 Avril 2026</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <FileDown className="h-4 w-4 mr-2" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Résumé des objectifs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReportItem 
              icon={Timer} 
              label="Jeûnes réussis" 
              value="6 / 7" 
              subValue="85% de réussite" 
              color="orange" 
            />
            <ReportItem 
              icon={Utensils} 
              label="Macros atteintes" 
              value="5 / 7" 
              subValue="Précision moyenne 92%" 
              color="blue" 
            />
            <ReportItem 
              icon={Dumbbell} 
              label="Séances sport" 
              value="4 / 4" 
              subValue="Objectif atteint !" 
              color="purple" 
            />
            <ReportItem 
              icon={TrendingDown} 
              label="Variation poids" 
              value="-0.9 kg" 
              subValue="Tendance positive" 
              color="green" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Analyse de la semaine</CardTitle>
            <CardDescription>Insights générés par l'IA pour votre niveau {userProfile.ketoLevel}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg border text-sm leading-relaxed">
              "Excellente semaine ! Votre régularité sur le protocole {userProfile.fastingProtocol} a permis de stabiliser votre glycémie. En tant que pratiquant {userProfile.ketoLevel}, on note une très bonne gestion des macros. Votre force lors des séances HIIT est en augmentation."
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-muted-foreground">Points d'attention</h4>
              <ul className="text-xs space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1" />
                  <span>Hydratation un peu faible le week-end (-500ml/jour)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1" />
                  <span>Sommeil moyen : 6h15 (cible 7h30)</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">Historique des rapports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { date: '29 Mars - 5 Avril', weight: '-0.7 kg', score: 'A' },
              { date: '22 Mars - 29 Mars', weight: '-1.2 kg', score: 'A+' },
              { date: '15 Mars - 22 Mars', weight: '+0.2 kg', score: 'B' },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {report.score}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{report.date}</p>
                    <p className="text-[10px] text-muted-foreground">Variation : {report.weight}</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ReportItem({ icon: Icon, label, value, subValue, color }: any) {
  const colors: any = {
    orange: 'bg-orange-100 text-orange-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
  };
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-bold">{label}</p>
          <p className="text-[10px] text-muted-foreground">{subValue}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}
