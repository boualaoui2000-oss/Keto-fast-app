import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Utensils, 
  Droplets, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ChevronRight,
  Coffee,
  Apple
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PROTOCOLS = [
  {
    id: '16:8',
    name: '16:8 Intermittent',
    description: 'Idéal pour commencer, très facile à intégrer au quotidien.',
    fastingHours: 16,
    eatingHours: 8,
    difficulty: 'Débutant',
    timeline: [
      { time: '0h - 8h', label: 'Sommeil / Jeûne', type: 'fast' },
      { time: '8h - 12h', label: 'Jeûne (Hydratation)', type: 'fast' },
      { time: '12h - 20h', label: 'Fenêtre Repas', type: 'eat' },
      { time: '20h - 0h', label: 'Jeûne', type: 'fast' },
    ],
    meals: [
      {
        time: '12:00',
        title: 'Déjeuner (1er repas)',
        icon: Apple,
        items: [
          'Oeufs brouillés au beurre (3 oeufs)',
          'Avocat ½ + filet d\'huile d\'olive',
          'Saumon fumé ou fromage (70g)',
          'Épinards sautés à l\'ail'
        ],
        macros: 'Lipides 65% | Prot 25% | Glucides <4g | ~550 kcal'
      },
      {
        time: '16:00',
        title: 'Collation (optionnel)',
        icon: Coffee,
        items: [
          'Noix de macadamia ou amandes (30g)',
          'Fromage à pâte dure (30g)',
          'Carré de chocolat noir 85% (2 carreaux)',
          'Café crème coco (sans sucre)'
        ],
        macros: 'Lipides 75% | Prot 15% | Glucides <3g | ~250 kcal'
      },
      {
        time: '19:30',
        title: 'Dîner (Dernier repas)',
        icon: Utensils,
        items: [
          'Poulet rôti cuisse + peau (200g)',
          'Légumes rôtis courgette + brocoli',
          'Sauce crème ou beurre maître d\'hôtel',
          'Salade verte + vinaigrette huile/vinaigre'
        ],
        macros: 'Lipides 60% | Prot 35% | Glucides <6g | ~650 kcal'
      }
    ]
  },
  {
    id: '18:6',
    name: '18:6 Avancé',
    description: 'Convient à ceux qui sont à l\'aise depuis quelques semaines.',
    fastingHours: 18,
    eatingHours: 6,
    difficulty: 'Intermédiaire',
    timeline: [
      { time: '0h - 9h', label: 'Sommeil / Jeûne', type: 'fast' },
      { time: '9h - 13h', label: 'Jeûne Profond', type: 'fast' },
      { time: '13h - 19h', label: 'Fenêtre Repas', type: 'eat' },
      { time: '19h - 0h', label: 'Jeûne', type: 'fast' },
    ],
    meals: [
      {
        time: '13:00',
        title: 'Déjeuner copieux',
        icon: Apple,
        items: [
          'Bowl keto : thon + oeuf dur + avocat',
          'Fromage feta + olives noires (50g)',
          'Salade de roquette + noix + huile d\'olive',
          'Bouillon de poulet maison (200ml)'
        ],
        macros: 'Lipides 65% | Prot 28% | Glucides <5g | ~580 kcal'
      },
      {
        time: '16:00',
        title: 'Collation dense',
        icon: Coffee,
        items: [
          'Concombre + cream cheese (2 cs)',
          'Jambon cru ou bresaola (3 tranches)',
          'Thé vert matcha (sans sucre)'
        ],
        macros: 'Lipides 60% | Prot 32% | Glucides <3g | ~200 kcal'
      },
      {
        time: '18:30',
        title: 'Dîner de clôture',
        icon: Utensils,
        items: [
          'Saumon à la poêle + beurre citron (180g)',
          'Purée de chou-fleur au ghee',
          'Haricots verts al dente + amandes effilées',
          'Carré de chocolat noir 90%'
        ],
        macros: 'Lipides 63% | Prot 32% | Glucides <5g | ~620 kcal'
      }
    ]
  },
  {
    id: '20:4',
    name: '20:4 Warrior Diet',
    description: 'Réservé aux pratiquants avancés avec un mode de vie adapté.',
    fastingHours: 20,
    eatingHours: 4,
    difficulty: 'Avancé',
    timeline: [
      { time: '0h - 15h', label: 'Jeûne / Travail', type: 'fast' },
      { time: '15h - 19h', label: 'Fenêtre Repas', type: 'eat' },
      { time: '19h - 0h', label: 'Jeûne / Sommeil', type: 'fast' },
    ],
    meals: [
      {
        time: '15:00',
        title: 'Repas principal',
        icon: Apple,
        items: [
          'Steak de boeuf (220g) + beurre maître d\'hôtel',
          'Oeufs au plat (2) en accompagnement',
          'Asperges rôties à l\'huile d\'olive',
          'Avocat entier + jus de citron'
        ],
        macros: 'Lipides 60% | Prot 38% | Glucides <5g | ~750 kcal'
      },
      {
        time: '17:30',
        title: 'Collation dense',
        icon: Coffee,
        items: [
          'Yogourt grec entier nature (150g)',
          'Noix mélangées (40g) + graines de chia',
          'Framboises fraîches (60g)'
        ],
        macros: 'Lipides 65% | Prot 20% | Glucides 6g | ~350 kcal'
      },
      {
        time: '18:30',
        title: 'Clôture (optionnel)',
        icon: Utensils,
        items: [
          'Bouillon d\'os maison (300ml)',
          'Tranches de bacon croustillant (3)',
          'Chips de parmesan maison (20g)'
        ],
        macros: 'Lipides 72% | Prot 26% | Glucides <1g | ~280 kcal'
      }
    ]
  },
  {
    id: '5:2',
    name: '5:2 Flexible',
    description: 'Option souple pour les contraintes sociales (repas de famille, sorties).',
    fastingHours: 24,
    eatingHours: 0,
    difficulty: 'Modéré',
    isWeekly: true,
    calendar: [
      { day: 'Lun', type: 'normal' },
      { day: 'Mar', type: 'fast', kcal: '500' },
      { day: 'Mer', type: 'normal' },
      { day: 'Jeu', type: 'normal' },
      { day: 'Ven', type: 'fast', kcal: '500' },
      { day: 'Sam', type: 'normal' },
      { day: 'Dim', type: 'normal' },
    ],
    meals: [
      {
        time: 'Jour Normal',
        title: 'Exemple Lundi',
        icon: Apple,
        items: [
          'Petit-déj: Oeufs au bacon + avocat',
          'Déjeuner: Wrap laitue poulet + guacamole',
          'Dîner: Sauté de boeuf + légumes wok'
        ],
        macros: '~1600 kcal | Glucides <20g'
      },
      {
        time: 'Jour Restreint',
        title: 'Exemple Mardi (500 kcal)',
        icon: AlertCircle,
        items: [
          'Matin: Café noir ou thé vert',
          'Midi: Bouillon de légumes clair',
          'Soir: Soupe courgette + 2 oeufs durs + thon'
        ],
        macros: '~480 kcal | Prot 45% | Glucides <8g'
      }
    ]
  }
];

export default function FastingGuide() {
  const [activeProtocol, setActiveProtocol] = useState(PROTOCOLS[0]);

  return (
    <div className="space-y-8 pb-12">
      <section className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> Synergie Keto & Jeûne
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Le keto et le jeûne se renforcent mutuellement. En cétose, les périodes de jeûne deviennent 
          plus supportables car le corps utilise déjà ses graisses comme carburant principal, 
          évitant ainsi les chutes de glycémie et les fringales.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-background p-3 rounded-xl border shadow-sm">
            <div className="text-primary font-bold text-lg mb-1">70%</div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Bons Lipides</p>
          </div>
          <div className="bg-background p-3 rounded-xl border shadow-sm">
            <div className="text-primary font-bold text-lg mb-1">25%</div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Protéines</p>
          </div>
          <div className="bg-background p-3 rounded-xl border shadow-sm">
            <div className="text-primary font-bold text-lg mb-1">&lt;20g</div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Glucides Nets</p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="font-bold text-lg">Choisissez votre protocole</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROTOCOLS.map((p) => (
            <Button
              key={p.id}
              variant={activeProtocol.id === p.id ? 'default' : 'outline'}
              className="h-auto py-4 flex flex-col gap-1"
              onClick={() => setActiveProtocol(p)}
            >
              <span className="text-lg font-bold">{p.id}</span>
              <span className="text-[10px] opacity-70">{p.difficulty}</span>
            </Button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeProtocol.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{activeProtocol.name}</CardTitle>
                  <CardDescription className="mt-1">{activeProtocol.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                  {activeProtocol.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Timeline Visualization */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Chronologie de la journée
                </h4>
                <div className="relative h-12 bg-muted rounded-full overflow-hidden flex">
                  {activeProtocol.id === '5:2' ? (
                    <div className="flex w-full">
                      {activeProtocol.calendar?.map((day, i) => (
                        <div 
                          key={i} 
                          className={`flex-1 flex flex-col items-center justify-center text-[10px] font-bold border-r last:border-0 ${
                            day.type === 'fast' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <span>{day.day}</span>
                          {day.kcal && <span>{day.kcal}k</span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="h-full bg-primary/20 flex-1 flex items-center justify-center text-[10px] font-bold text-primary">
                        Jeûne ({activeProtocol.fastingHours}h)
                      </div>
                      <div className="h-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground px-4" style={{ flexBasis: `${(activeProtocol.eatingHours / 24) * 100}%` }}>
                        Fenêtre ({activeProtocol.eatingHours}h)
                      </div>
                    </>
                  )}
                </div>
                {!activeProtocol.isWeekly && (
                  <div className="grid grid-cols-4 gap-1">
                    {activeProtocol.timeline?.map((t, i) => (
                      <div key={i} className="text-center">
                        <div className={`h-1 rounded-full mb-1 ${t.type === 'eat' ? 'bg-primary' : 'bg-muted'}`} />
                        <p className="text-[9px] font-bold">{t.time}</p>
                        <p className="text-[8px] text-muted-foreground truncate">{t.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Meal Examples */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-primary" /> Exemples de repas Keto
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeProtocol.meals.map((meal, i) => (
                    <div key={i} className="bg-muted/30 p-4 rounded-xl border border-muted flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-background p-2 rounded-lg border">
                          <meal.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-primary uppercase">{meal.time}</p>
                          <h5 className="text-sm font-bold">{meal.title}</h5>
                        </div>
                      </div>
                      <ul className="space-y-2 flex-1">
                        {meal.items.map((item, j) => (
                          <li key={j} className="text-xs text-muted-foreground flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-3 border-t border-muted-foreground/10">
                        <p className="text-[10px] font-medium text-muted-foreground italic">{meal.macros}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips & Rules */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" /> Aliments autorisés
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {['Viandes & Poissons', 'Oeufs (sans limite)', 'Avocats & Olives', 'Noix & Graines', 'Légumes verts', 'Fromages & Beurre'].map((item, i) => (
                      <li key={i} className="text-xs flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-green-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold flex items-center gap-2 text-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" /> À éviter absolument
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {['Pain & Pâtes', 'Sucre & Miel', 'Riz & Patates', 'Fruits sucrés', 'Légumineuses', 'Alcool sucré'].map((item, i) => (
                      <li key={i} className="text-xs flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-red-500" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="bg-blue-50/50 border-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
              <Droplets className="h-4 w-4" /> Hydratation pendant le jeûne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-800 leading-relaxed">
              Autorisés : Eau, café noir, thé vert ou tisanes (sans lait ni sucre). 
              Le bouillon d'os est toléré en cas de faim intense pour ses électrolytes.
            </p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50/50 border-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-yellow-700">
              <Info className="h-4 w-4" /> Conseil de Pro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-yellow-800 leading-relaxed">
              Commencez toujours par le 16:8. Ne passez au 18:6 ou 20:4 que lorsque vous ne ressentez 
              plus de faim le matin. Écoutez votre corps avant tout.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
