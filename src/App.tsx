import React, { useState, useEffect } from 'react';
import OnboardingQuiz from './components/onboarding/OnboardingQuiz';
import Dashboard from './components/dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import { UserProfile, FastingSession } from './types';
import { Toaster } from 'sonner';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, onSnapshot, setDoc, getDocFromServer, deleteDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestore-errors';

import NutritionDashboard from './components/nutrition/NutritionDashboard';
import FastingDashboard from './components/fasting/FastingDashboard';
import FitnessProgram from './components/fitness/FitnessProgram';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import UserProfilePage from './components/profile/UserProfilePage';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hydration, setHydration] = useState(0);
  const [fastingSession, setFastingSession] = useState<FastingSession>({
    id: '1',
    userId: '1',
    startTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    targetDuration: 16,
    status: 'active',
    type: '16:8',
  });

  const [consumedMacros, setConsumedMacros] = useState({
    calories: 1250,
    carbs: 12,
    protein: 85,
    fats: 95,
  });

  // Test connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    let lastAccessUpdated = false;

    const unsubscribe = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const profile = snapshot.data() as UserProfile;
        setUserProfile(profile);
        
        // Update last access ONLY ONCE per session to avoid loops
        if (profile.onboardingCompleted && !lastAccessUpdated) {
          lastAccessUpdated = true;
          setDoc(userDocRef, { 
            lastAccessAt: new Date().toISOString(),
            updatedAt: new Date().toISOString() 
          }, { merge: true }).catch(err => {
            console.error("Failed to update last access:", err, {
              uid: user.uid,
              profileKeys: Object.keys(profile)
            });
          });
        }
      } else {
        setUserProfile(null);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleOnboardingComplete = async (profile: Partial<UserProfile>) => {
    if (!user) return;

    const fullProfile = {
      ...profile,
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || 'Ketoer',
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserProfile;
    
    try {
      await setDoc(doc(db, 'users', user.uid), fullProfile);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { 
        ...data, 
        updatedAt: new Date().toISOString() 
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const handleReset = async () => {
    if (!user) return;
    
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      // Subcollections should also be deleted in a real app
      await signOut(auth);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}`);
    }
  };

  const handleAddHydration = (amount: number) => {
    setHydration(prev => prev + amount);
  };

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-4xl mb-6 shadow-xl">
          K
        </div>
        <h1 className="text-3xl font-bold mb-2">KetoFast AI</h1>
        <p className="text-muted-foreground text-center max-w-xs mb-8">
          Votre compagnon intelligent pour le jeûne intermittent et le régime Keto.
        </p>
        <button 
          onClick={handleLogin}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          Se connecter avec Google
        </button>
      </div>
    );
  }

  if (!userProfile || !userProfile.onboardingCompleted) {
    return (
      <>
        <OnboardingQuiz onComplete={handleOnboardingComplete} />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background md:pl-20">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} userProfile={userProfile} />
      
      <main className="pb-20 md:pb-0">
        {activeTab === 'dashboard' && (
          <Dashboard 
            userProfile={userProfile}
            fastingSession={fastingSession}
            consumedMacros={consumedMacros}
            hydration={hydration}
            onAddHydration={handleAddHydration}
            onNavigate={setActiveTab}
          />
        )}
        
        {activeTab === 'nutrition' && (
          <NutritionDashboard userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
        )}

        {activeTab === 'fasting' && (
          <FastingDashboard />
        )}

        {activeTab === 'fitness' && (
          <FitnessProgram />
        )}

        {activeTab === 'analytics' && userProfile && (
          <AnalyticsDashboard userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />
        )}

        {activeTab === 'profile' && (
          <UserProfilePage 
            userProfile={userProfile} 
            onReset={handleReset} 
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>
      
      <Toaster position="top-center" />
    </div>
  );
}

// Helper Button component for the profile tab reset
function Button({ children, variant, className, onClick }: any) {
  const variants: any = {
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
