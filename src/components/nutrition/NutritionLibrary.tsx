import React, { useState } from 'react';
import RecipeCard, { Recipe } from './RecipeCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, UtensilsCrossed, X, Clock, Flame, ChevronRight, LayoutGrid, List, Utensils } from 'lucide-react';
import { RECIPES } from '@/data/recipes';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NutritionLibrary() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showImages, setShowImages] = useState(true);

  const filteredRecipes = RECIPES.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                         r.ingredients?.some(i => i.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'all' || r.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesTag = !activeTag || r.tags?.includes(activeTag as any);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'petit-déjeuner', label: 'Petit-déj' },
    { id: 'déjeuner', label: 'Déjeuner' },
    { id: 'dîner', label: 'Dîner' },
    { id: 'collation', label: 'Collation' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      <header>
        <h1 className="text-2xl font-bold">Bibliothèque Nutrition</h1>
        <p className="text-sm text-muted-foreground">Découvrez des recettes keto savoureuses et adaptées à vos macros.</p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher une recette..." 
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-lg border">
          <Label htmlFor="show-images" className="text-xs font-medium flex items-center gap-2 cursor-pointer">
            {showImages ? <LayoutGrid className="h-3 w-3" /> : <List className="h-3 w-3" />}
            {showImages ? "Images" : "Liste"}
          </Label>
          <Switch 
            id="show-images" 
            checked={showImages} 
            onCheckedChange={setShowImages} 
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { id: 'rapide', label: 'Rapide <15min', icon: Clock },
          { id: 'batch', label: 'Batch Cooking', icon: UtensilsCrossed },
          { id: 'veggie', label: 'Végétarien', icon: Utensils },
          { id: 'budget', label: 'Petit Budget', icon: Flame },
        ].map((tag) => (
          <Button
            key={tag.id}
            variant={activeTag === tag.id ? 'default' : 'outline'}
            size="sm"
            className="shrink-0 rounded-full h-8 text-xs"
            onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
          >
            <tag.icon className="h-3 w-3 mr-1" />
            {tag.label}
          </Button>
        ))}
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} className="text-xs py-1.5">
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-6">
          <div className={showImages 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "flex flex-col gap-2"
          }>
            {filteredRecipes.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                compact={!showImages}
                onClick={(r) => setSelectedRecipe(r)}
              />
            ))}
          </div>
          {filteredRecipes.length === 0 && (
            <div className="text-center py-20 bg-muted/20 rounded-xl border-2 border-dashed">
              <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Aucune recette trouvée</h3>
              <p className="text-sm text-muted-foreground mt-1">Essayez de modifier vos filtres ou votre recherche pour "{search}"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedRecipe} onOpenChange={(open) => !open && setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
          {selectedRecipe && (
            <>
              <div className="relative h-64 shrink-0">
                <img 
                  src={selectedRecipe.image} 
                  alt={selectedRecipe.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <Badge className="mb-2 bg-primary hover:bg-primary">{selectedRecipe.category}</Badge>
                  <h2 className="text-2xl font-bold">{selectedRecipe.title}</h2>
                </div>
              </div>

              <ScrollArea className="flex-1 p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-primary" />
                    <div className="text-xs font-bold">{selectedRecipe.time}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Temps</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <Flame className="h-4 w-4 mx-auto mb-1 text-orange-500" />
                    <div className="text-xs font-bold">{selectedRecipe.calories}</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Kcal</div>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <UtensilsCrossed className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                    <div className="text-xs font-bold">{selectedRecipe.carbs}g</div>
                    <div className="text-[10px] text-muted-foreground uppercase">Glucides</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded-md border border-red-100">
                    <span className="text-xs font-medium text-red-700">Protéines</span>
                    <span className="text-sm font-bold text-red-700">{selectedRecipe.protein}g</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-md border border-yellow-100">
                    <span className="text-xs font-medium text-yellow-700">Lipides</span>
                    <span className="text-sm font-bold text-yellow-700">{selectedRecipe.fats}g</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <section>
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      Ingrédients
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedRecipe.ingredients?.map((ing, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <Separator />

                  {selectedRecipe.tags?.includes('batch') && (
                    <section className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                      <h3 className="font-bold mb-2 flex items-center gap-2 text-primary">
                        <UtensilsCrossed className="h-4 w-4" />
                        Mode Batch Cooking
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Cette recette est idéale pour une préparation en avance. Doublez les quantités pour gagner du temps !
                      </p>
                      <div className="bg-background/50 p-3 rounded-lg border border-primary/10">
                        <h4 className="text-xs font-bold uppercase mb-1">Guide de conservation</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Réfrigérateur : 3-4 jours dans un récipient hermétique</li>
                          <li>• Congélateur : Jusqu'à 3 mois</li>
                          <li>• Astuce : Réchauffer à feu doux pour préserver les textures</li>
                        </ul>
                      </div>
                    </section>
                  )}

                  <section>
                    <h3 className="font-bold mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-6 bg-primary rounded-full" />
                      Instructions
                    </h3>
                    <div className="space-y-4">
                      {selectedRecipe.instructions?.map((step, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </ScrollArea>

              <div className="p-4 border-t bg-muted/30">
                <Button className="w-full" onClick={() => setSelectedRecipe(null)}>
                  Fermer
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
