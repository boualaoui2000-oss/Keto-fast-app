import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, Utensils, ChevronRight } from 'lucide-react';

export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  category: string;
  ingredients?: string[];
  instructions?: string[];
  tags?: ('rapide' | 'batch' | 'veggie' | 'budget')[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: (recipe: Recipe) => void;
  compact?: boolean;
  key?: string | number;
}

export default function RecipeCard({ recipe, onClick, compact }: RecipeCardProps) {
  const [imageError, setImageError] = React.useState(false);

  if (compact) {
    return (
      <Card 
        className="flex items-center p-3 hover:bg-muted/50 transition-colors cursor-pointer group"
        onClick={() => onClick?.(recipe)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] h-4 px-1">{recipe.category}</Badge>
            <h3 className="text-sm font-medium line-clamp-1">{recipe.title}</h3>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {recipe.time}</div>
            <div className="flex items-center gap-1"><Flame className="h-3 w-3" /> {recipe.calories} kcal</div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-blue-600">G: {recipe.carbs}g</span>
              <span className="text-red-600">P: {recipe.protein}g</span>
              <span className="text-yellow-600">L: {recipe.fats}g</span>
            </div>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 group-hover:translate-x-1 transition-transform" />
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick?.(recipe)}
    >
      <div className="aspect-video relative bg-muted">
        {!imageError ? (
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
            <Utensils className="h-8 w-8 opacity-20" />
          </div>
        )}
        <Badge className="absolute top-2 right-2 bg-black/60 hover:bg-black/80">
          {recipe.category}
        </Badge>
      </div>
      <CardHeader className="p-3 pb-0">
        <CardTitle className="text-sm line-clamp-1">{recipe.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {recipe.time}
          </div>
          <div className="flex items-center gap-1">
            <Flame className="h-3 w-3" /> {recipe.calories} kcal
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between border-t mt-2">
        <div className="flex gap-2 text-[10px] font-medium w-full justify-around pt-2">
          <div className="text-blue-600">G: {recipe.carbs}g</div>
          <div className="text-red-600">P: {recipe.protein}g</div>
          <div className="text-yellow-600">L: {recipe.fats}g</div>
        </div>
      </CardFooter>
    </Card>
  );
}
