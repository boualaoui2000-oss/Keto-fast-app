import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, ShoppingBag, Share2, Printer, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  category: string;
  checked: boolean;
}

const INITIAL_ITEMS: ShoppingItem[] = [
  { id: '1', name: 'Œufs', amount: '12 pièces', category: 'Frais', checked: false },
  { id: '2', name: 'Avocats', amount: '4 pièces', category: 'Fruits & Légumes', checked: true },
  { id: '3', name: 'Beurre clarifié (Ghee)', amount: '250g', category: 'Épicerie', checked: false },
  { id: '4', name: 'Blanc de poulet', amount: '600g', category: 'Boucherie', checked: false },
  { id: '5', name: 'Épinards frais', amount: '500g', category: 'Fruits & Légumes', checked: false },
  { id: '6', name: 'Huile d\'olive extra vierge', amount: '1L', category: 'Épicerie', checked: false },
  { id: '7', name: 'Fromage Halloumi', amount: '250g', category: 'Frais', checked: false },
];

export default function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(INITIAL_ITEMS);
  const [newItemName, setNewItemName] = useState('');

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addItem = () => {
    if (!newItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newItemName,
      amount: '1',
      category: 'Divers',
      checked: false
    };
    setItems([...items, newItem]);
    setNewItemName('');
    toast.success("Article ajouté");
  };

  const clearChecked = () => {
    setItems(items.filter(item => !item.checked));
    toast.info("Articles cochés supprimés");
  };

  const categories = Array.from(new Set(items.map(item => item.category)));
  const checkedCount = items.filter(i => i.checked).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Ma Liste de Courses
          </h3>
          <p className="text-xs text-muted-foreground">{checkedCount} / {items.length} articles récupérés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Input 
          placeholder="Ajouter un article..." 
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <Button onClick={addItem}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">{category}</h4>
            <div className="space-y-1">
              {items.filter(item => item.category === category).map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    item.checked ? 'bg-muted/50 opacity-60' : 'bg-background hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id={item.id} 
                      checked={item.checked} 
                      onCheckedChange={() => toggleItem(item.id)} 
                    />
                    <label 
                      htmlFor={item.id}
                      className={`text-sm font-medium leading-none cursor-pointer ${item.checked ? 'line-through' : ''}`}
                    >
                      {item.name}
                    </label>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">{item.amount}</Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => setItems(items.filter(i => i.id !== item.id))}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {checkedCount > 0 && (
        <Button 
          variant="ghost" 
          className="w-full text-muted-foreground text-xs hover:text-destructive"
          onClick={clearChecked}
        >
          <Trash2 className="h-3 w-3 mr-2" />
          Supprimer les articles cochés
        </Button>
      )}

      <Card className="bg-primary/5 border-dashed border-primary/30">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <CheckCircle2 className="h-5 w-5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground">
            Cette liste est automatiquement mise à jour en fonction de votre plan de repas hebdomadaire.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
