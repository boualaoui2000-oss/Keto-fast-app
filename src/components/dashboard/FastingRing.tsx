import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface FastingRingProps {
  startTime: Date;
  targetHours: number;
  isFasting: boolean;
}

export default function FastingRing({ startTime, targetHours, isFasting }: FastingRingProps) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const elapsedMs = now.getTime() - startTime.getTime();
      const targetMs = targetHours * 60 * 60 * 1000;
      
      const p = Math.min((elapsedMs / targetMs) * 100, 100);
      setProgress(p);

      const remainingMs = Math.max(targetMs - elapsedMs, 0);
      const rHours = Math.floor(remainingMs / (1000 * 60 * 60));
      const rMins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const rSecs = Math.floor((remainingMs % (1000 * 60)) / 1000);
      setTimeLeft(`${rHours}h ${rMins}m ${rSecs}s`);

      const eHours = Math.floor(elapsedMs / (1000 * 60 * 60));
      const eMins = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
      setElapsedTime(`${eHours}h ${eMins}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, targetHours]);

  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={isFasting ? "#f97316" : "#22c55e"}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {isFasting ? "Jeûne en cours" : "Fenêtre repas"}
        </span>
        <span className="text-2xl font-bold font-mono">{timeLeft}</span>
        <span className="text-xs text-muted-foreground mt-1">
          Écoulé: {elapsedTime}
        </span>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm font-medium">Objectif: {targetHours}h</div>
        <div className="text-xs text-muted-foreground">Progression: {Math.round(progress)}%</div>
      </div>
    </div>
  );
}
