import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Settings, Bell, Shield, LogOut, Trash2, Scale, Ruler, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function UserProfilePage({ userProfile, onReset, onLogout, onUpdateProfile }: { userProfile: any, onReset: () => void, onLogout: () => void, onUpdateProfile: (data: any) => void }) {
  const [weight, setWeight] = React.useState(userProfile.weight || '');
  const [height, setHeight] = React.useState(userProfile.height || '');
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);

  const handleUpdateMeasurements = async () => {
    setIsUpdating(true);
    try {
      await onUpdateProfile({
        weight: parseFloat(weight.toString()),
        height: parseFloat(height.toString()),
        updatedAt: new Date().toISOString()
      });
      toast.success("Mesures mises à jour avec succès !");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6 pb-24">
      <header className="flex items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-primary">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ketoer" />
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{userProfile.displayName}</h1>
          <p className="text-sm text-muted-foreground">{userProfile.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="capitalize">{userProfile.programType === 'both' ? 'Keto + Jeûne' : userProfile.programType}</Badge>
            <Badge variant="secondary">{userProfile.ketoLevel}</Badge>
            <Badge variant="outline">{userProfile.fastingProtocol}</Badge>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" /> Mesures Physiques
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Poids actuel</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                    className="h-8 w-20" 
                  />
                  <span className="text-sm">kg</span>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Taille</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={height} 
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    className="h-8 w-20" 
                  />
                  <span className="text-sm">cm</span>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={handleUpdateMeasurements}
                disabled={isUpdating}
              >
                {isUpdating ? 'Mise à jour...' : 'Mettre à jour mes mesures'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> Préférences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Notifications</Label>
                <p className="text-[10px] text-muted-foreground">Rappels de jeûne et repas</p>
              </div>
              <Button variant="outline" size="sm">Gérer</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Langue</Label>
                <p className="text-[10px] text-muted-foreground">Français (France)</p>
              </div>
              <Button variant="outline" size="sm">Changer</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <Shield className="h-5 w-5" /> Zone de danger
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            La réinitialisation supprimera toutes vos données locales (profil, historique, logs).
          </p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 text-xs">Exporter mes données (PDF)</Button>
            {!showResetConfirm ? (
              <Button 
                variant="destructive" 
                className="flex-1 text-xs"
                onClick={() => setShowResetConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Réinitialiser
              </Button>
            ) : (
              <div className="flex-1 flex gap-2">
                <Button 
                  variant="destructive" 
                  className="flex-1 text-[10px]"
                  onClick={onReset}
                >
                  Confirmer
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-[10px]"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Annuler
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <footer className="text-center py-8">
        <Button 
          variant="ghost" 
          className="text-muted-foreground text-xs"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" /> Se déconnecter
        </Button>
        <p className="text-[10px] text-muted-foreground mt-4">KetoFast AI v1.0.0 • Fait avec ❤️ pour votre santé</p>
      </footer>
    </div>
  );
}
