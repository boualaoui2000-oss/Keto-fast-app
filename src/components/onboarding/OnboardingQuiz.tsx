import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FASTING_PROTOCOLS, ACTIVITY_LEVELS } from '@/constants';
import { calculateTDEE, calculateKetoMacros } from '@/lib/nutrition-utils';
import { UserProfile } from '@/types';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';

interface OnboardingQuizProps {
  onComplete: (profile: Partial<UserProfile>) => void;
}

export default function OnboardingQuiz({ onComplete }: OnboardingQuizProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    age: 30,
    weight: 70,
    targetWeight: 65,
    height: 170,
    gender: 'male',
    goal: 'lose',
    activityLevel: 'moderate',
    dietPreference: 'omnivore',
    programType: 'both',
    fastingProtocol: '16:8',
    ketoLevel: 'beginner',
    allergies: [],
    healthConditions: [],
  });

  const totalSteps = 6;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleComplete = () => {
    const activity = ACTIVITY_LEVELS.find(a => a.id === formData.activityLevel);
    const tdee = calculateTDEE(
      formData.weight || 70,
      formData.height || 170,
      formData.age || 30,
      formData.gender || 'male',
      activity?.multiplier || 1.2
    );
    const macros = calculateKetoMacros(tdee, formData.goal || 'lose');
    
    onComplete({
      ...formData,
      targetMacros: macros,
      onboardingCompleted: true,
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <Label>Que souhaitez-vous suivre ?</Label>
            <RadioGroup
              value={formData.programType}
              onValueChange={(v: any) => setFormData({ ...formData, programType: v })}
              className="grid grid-cols-1 gap-3"
            >
              <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="fasting" id="prog-fasting" />
                <Label htmlFor="prog-fasting" className="flex-1 cursor-pointer">
                  <span className="block font-bold">Jeûne Intermittent uniquement</span>
                  <span className="text-xs text-muted-foreground">Suivi des fenêtres de jeûne et hydratation.</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="keto" id="prog-keto" />
                <Label htmlFor="prog-keto" className="flex-1 cursor-pointer">
                  <span className="block font-bold">Régime Keto uniquement</span>
                  <span className="text-xs text-muted-foreground">Suivi des macros, calories et recettes cétogènes.</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 border p-4 rounded-xl cursor-pointer hover:bg-accent transition-colors">
                <RadioGroupItem value="both" id="prog-both" />
                <Label htmlFor="prog-both" className="flex-1 cursor-pointer">
                  <span className="block font-bold">Les deux (Synergie complète)</span>
                  <span className="text-xs text-muted-foreground">L'expérience complète pour des résultats optimaux.</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Sexe</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(v: any) => setFormData({ ...formData, gender: v })}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Homme</SelectItem>
                    <SelectItem value="female">Femme</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Poids actuel (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetWeight">Poids cible (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  value={formData.targetWeight}
                  onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Taille (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label>Quel est votre objectif ?</Label>
            <RadioGroup
              value={formData.goal}
              onValueChange={(v: any) => setFormData({ ...formData, goal: v })}
              className="grid grid-cols-1 gap-2"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-accent">
                <RadioGroupItem value="lose" id="lose" />
                <Label htmlFor="lose" className="flex-1 cursor-pointer">Perdre du poids</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-accent">
                <RadioGroupItem value="maintain" id="maintain" />
                <Label htmlFor="maintain" className="flex-1 cursor-pointer">Maintenir mon poids</Label>
              </div>
              <div className="flex items-center space-x-2 border p-3 rounded-lg cursor-pointer hover:bg-accent">
                <RadioGroupItem value="gain" id="gain" />
                <Label htmlFor="gain" className="flex-1 cursor-pointer">Prendre de la masse</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Label>Niveau d'activité physique</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(v: any) => setFormData({ ...formData, activityLevel: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {ACTIVITY_LEVELS.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Label>Préférences alimentaires</Label>
            <Select
              value={formData.dietPreference}
              onValueChange={(v: any) => setFormData({ ...formData, dietPreference: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="omnivore">Omnivore</SelectItem>
                <SelectItem value="vegetarian">Végétarien</SelectItem>
                <SelectItem value="vegan">Végane</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <Label>Protocole de jeûne souhaité</Label>
            <RadioGroup
              value={formData.fastingProtocol}
              onValueChange={(v: any) => setFormData({ ...formData, fastingProtocol: v })}
              className="space-y-2"
            >
              {FASTING_PROTOCOLS.map((p) => (
                <div key={p.id} className="flex flex-col border p-3 rounded-lg cursor-pointer hover:bg-accent">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={p.id} id={p.id} />
                    <Label htmlFor={p.id} className="font-bold cursor-pointer">{p.name}</Label>
                  </div>
                  <p className="text-xs text-muted-foreground ml-6 mt-1">{p.description}</p>
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <Label>Niveau Keto</Label>
            <Select
              value={formData.ketoLevel}
              onValueChange={(v: any) => setFormData({ ...formData, ketoLevel: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Débutant (Transition douce)</SelectItem>
                <SelectItem value="intermediate">Intermédiaire (Rigueur modérée)</SelectItem>
                <SelectItem value="advanced">Avancé (Cétose stricte)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Cela adaptera la rigueur des plans de repas proposés.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-muted-foreground">Étape {step} sur {totalSteps}</span>
            <div className="flex gap-1">
              {[...Array(totalSteps)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 w-6 rounded-full transition-colors ${i + 1 <= step ? 'bg-primary' : 'bg-muted'}`} 
                />
              ))}
            </div>
          </div>
          <CardTitle>
            {step === 1 && "Votre programme"}
            {step === 2 && "Parlons de vous"}
            {step === 3 && "Votre objectif"}
            {step === 4 && "Mode de vie"}
            {step === 5 && "Jeûne intermittent"}
            {step === 6 && "Expérience Keto"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Choisissez l'approche qui vous correspond le mieux."}
            {step === 2 && "Ces informations nous aident à calculer vos besoins caloriques."}
            {step === 3 && "Choisissez ce que vous souhaitez accomplir."}
            {step === 4 && "Dites-nous en plus sur vos habitudes."}
            {step === 5 && "Sélectionnez le rythme qui vous convient."}
            {step === 6 && "Dernière étape avant votre plan personnalisé !"}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[250px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={prevStep} disabled={step === 1}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Retour
          </Button>
          {step < totalSteps ? (
            <Button onClick={nextStep}>
              Suivant <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              Terminer <Check className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
