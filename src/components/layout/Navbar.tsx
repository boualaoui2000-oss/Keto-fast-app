import React from 'react';
import { Home, Utensils, Timer, Dumbbell, User, TrendingUp } from 'lucide-react';
import { UserProfile } from '@/types';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userProfile: UserProfile;
}

export default function Navbar({ activeTab, onTabChange, userProfile }: NavbarProps) {
  const allTabs = [
    { id: 'dashboard', icon: Home, label: 'Accueil' },
    { id: 'nutrition', icon: Utensils, label: 'Nutrition', program: ['keto', 'both'] },
    { id: 'fasting', icon: Timer, label: 'Jeûne', program: ['fasting', 'both'] },
    { id: 'fitness', icon: Dumbbell, label: 'Sport' },
    { id: 'analytics', icon: TrendingUp, label: 'Suivi' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  const tabs = allTabs.filter(tab => 
    !tab.program || tab.program.includes(userProfile.programType)
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around items-center py-2 px-1 z-50 md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-screen md:border-r md:border-t-0">
      <div className="hidden md:flex mb-8 mt-4">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold">
          K
        </div>
      </div>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className={`h-6 w-6 ${isActive ? 'fill-primary/10' : ''}`} />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
