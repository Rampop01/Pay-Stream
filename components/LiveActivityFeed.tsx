'use client';

import { useEffect, useState } from 'react';
import { Activity, Star, Zap } from 'lucide-react';

interface ActivityEvent {
  id: string;
  message: string;
  timestamp: number;
  type: 'unlock' | 'tip' | 'stake';
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/activity');
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error('Failed to fetch activity', err);
      }
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (activities.length === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-900/40 via-purple-900/40 to-blue-900/40 border-b border-white/5 overflow-hidden relative h-10 flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 flex items-center px-4">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          PULSE
        </span>
      </div>
      
      <div className="flex animate-marquee whitespace-nowrap pl-24">
        {activities.map((activity, i) => (
          <div key={activity.id} className="flex items-center gap-2 mx-8 text-sm text-gray-300">
            {activity.type === 'unlock' && <Activity className="w-3.5 h-3.5 text-green-400" />}
            {activity.type === 'tip' && <Zap className="w-3.5 h-3.5 text-yellow-400" />}
            {activity.type === 'stake' && <Star className="w-3.5 h-3.5 text-purple-400" />}
            <span className="font-mono text-xs opacity-60">
              {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span>{activity.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
