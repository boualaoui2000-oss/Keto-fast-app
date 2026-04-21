import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Scale, Ruler, CheckCircle2, XCircle } from 'lucide-react';
import { UserProfile } from '@/types';
import { differenceInDays, parseISO, format, isMonday } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface DataIntegrityRemindersProps {
  userProfile: UserProfile;
  onNavigate: (tab: string) => void;
}

export default function DataIntegrityReminders({ userProfile, onNavigate }: DataIntegrityRemindersProps) {
  const [missingDays, setMissingDays] = useState<number>(0);
  const [needsWeight, setNeedsWeight] = useState(false);
  const [needsMeasurements, setNeedsMeasurements] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (!userProfile) return;

    const today = new Date();
    
    // Check missing days since last meal log
    if (userProfile.lastMealLogAt) {
      const lastMeal = parseISO(userProfile.lastMealLogAt);
      const days = differenceInDays(today, lastMeal);
      if (days > 1) {
        setMissingDays(days);
      }
    } else {
      // First time? check creation date
      const created = parseISO(userProfile.createdAt);
      const days = differenceInDays(today, created);
      if (days > 0) setMissingDays(days);
    }

    // Weight reminder: Recommended once a week, ideally Monday
    if (userProfile.lastWeightAt) {
      const lastWeight = parseISO(userProfile.lastWeightAt);
      const daysSinceWeight = differenceInDays(today, lastWeight);
      if (daysSinceWeight >= 7 || (isMonday(today) && daysSinceWeight >= 3)) {
        setNeedsWeight(true);
      }
    } else {
      setNeedsWeight(true);
    }

    // Measurements: Recommended every 14 days
    if (userProfile.lastMeasurementAt) {
      const lastMeas = parseISO(userProfile.lastMeasurementAt);
      const daysSinceMeas = differenceInDays(today, lastMeas);
      if (daysSinceMeas >= 14) {
        setNeedsMeasurements(true);
      }
    } else {
      setNeedsMeasurements(true);
    }

    // Auto-toast if absence detected
    if (userProfile.lastAccessAt) {
      const lastAccess = parseISO(userProfile.lastAccessAt);
      const daysAbsent = differenceInDays(today, lastAccess);
      if (daysAbsent > 1) {
        toast.message("Bon retour !", {
          description: `Vous nous avez manqué pendant ${daysAbsent} jours. N'oubliez pas de rattraper vos saisies !`,
        });
      }
    }
  }, [userProfile]);

  if (isDismissed) return null;
  if (missingDays <= 0 && !needsWeight && !needsMeasurements) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <Card className="border-red-100 bg-red-50/50 mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" /> Attention : Données manquantes
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-[10px] text-red-600 hover:text-red-700 hover:bg-red-100"
                onClick={() => setIsDismissed(true)}
              >
                Ignorer
              </Button>
            </div>
            <CardDescription className="text-xs text-red-600">
              Pour un suivi optimal, complétez vos informations pour les jours passés.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {missingDays > 0 && (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{missingDays} jours sans repas</p>
                    <p className="text-[10px] text-muted-foreground">Rattrapez vos logs alimentaires</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50" onClick={() => onNavigate('nutrition')}>
                  Remplir
                </Button>
              </div>
            )}

            {needsWeight && (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Scale className="h-4 w-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Pesée recommandée</p>
                    <p className="text-[10px] text-muted-foreground">{isMonday(new Date()) ? "C'est lundi ! Le jour idéal pour se peser." : "Dernière pesée il y a plus de 7 jours."}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs border-orange-200 text-orange-700 hover:bg-orange-50" onClick={() => onNavigate('analytics')}>
                  Peser
                </Button>
              </div>
            )}

            {needsMeasurements && (
              <div className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Ruler className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Mesures des contours</p>
                    <p className="text-[10px] text-muted-foreground">Recommandé tous les 14 jours par nos experts.</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => onNavigate('analytics')}>
                  Mesurer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
