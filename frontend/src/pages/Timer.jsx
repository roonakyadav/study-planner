import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw, Coffee, Zap, Clock } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { getTimerSettings, getTimerStats, updateTimerStats } from '../utils/localStorage';

const Timer = () => {
  const [timerState, setTimerState] = useState('focus'); // 'focus', 'shortBreak', 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  });
  const [stats, setStats] = useState({
    sessionsToday: 0,
    focusTimeToday: 0,
    totalSessions: 0,
    totalFocusTime: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    const timerSettings = getTimerSettings();
    const timerStats = getTimerStats();
    
    setSettings(timerSettings);
    setStats(timerStats);
    setTimeLeft(timerSettings.focusTime * 60);
  }, []);

  useEffect(() => {
    let interval = null;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            handleTimerComplete();
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!isRunning) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (timerState === 'focus') {
      // Update stats for completed focus session
      const newStats = {
        ...stats,
        sessionsToday: stats.sessionsToday + 1,
        focusTimeToday: stats.focusTimeToday + settings.focusTime,
        totalSessions: stats.totalSessions + 1,
        totalFocusTime: stats.totalFocusTime + settings.focusTime
      };
      setStats(newStats);
      updateTimerStats(newStats);
      
      // Show completion notification
      toast({
        title: "Focus Session Complete!",
        description: `Great job! You completed a ${settings.focusTime}-minute focus session.`
      });
      
      // Determine next break type
      const nextSessions = newStats.sessionsToday;
      if (nextSessions % settings.sessionsUntilLongBreak === 0) {
        setTimerState('longBreak');
        setTimeLeft(settings.longBreak * 60);
        toast({
          title: "Time for a Long Break!",
          description: `You've earned a ${settings.longBreak}-minute break.`
        });
      } else {
        setTimerState('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
        toast({
          title: "Time for a Short Break!",
          description: `Take a ${settings.shortBreak}-minute break.`
        });
      }
    } else {
      // Break completed, start focus session
      setTimerState('focus');
      setTimeLeft(settings.focusTime * 60);
      toast({
        title: "Break Complete!",
        description: "Ready to focus again? Start your next session."
      });
    }

    // Play notification sound (if supported)
    if ('Notification' in window) {
      new Notification('Pomodoro Timer', {
        body: timerState === 'focus' ? 'Focus session complete!' : 'Break time is over!',
        icon: '/favicon.ico'
      });
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerState('focus');
    setTimeLeft(settings.focusTime * 60);
  };

  const skipSession = () => {
    if (timerState === 'focus') {
      // Skip to break
      if (stats.sessionsToday % settings.sessionsUntilLongBreak === settings.sessionsUntilLongBreak - 1) {
        setTimerState('longBreak');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setTimerState('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      // Skip to focus
      setTimerState('focus');
      setTimeLeft(settings.focusTime * 60);
    }
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerConfig = () => {
    switch (timerState) {
      case 'focus':
        return {
          title: 'Focus Time',
          icon: Zap,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'from-purple-500/20 to-pink-500/20',
          totalTime: settings.focusTime * 60
        };
      case 'shortBreak':
        return {
          title: 'Short Break',
          icon: Coffee,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'from-green-500/20 to-emerald-500/20',
          totalTime: settings.shortBreak * 60
        };
      case 'longBreak':
        return {
          title: 'Long Break',
          icon: Coffee,
          color: 'from-blue-500 to-cyan-500',
          bgColor: 'from-blue-500/20 to-cyan-500/20',
          totalTime: settings.longBreak * 60
        };
      default:
        return {
          title: 'Focus Time',
          icon: Zap,
          color: 'from-purple-500 to-pink-500',
          bgColor: 'from-purple-500/20 to-pink-500/20',
          totalTime: settings.focusTime * 60
        };
    }
  };

  const config = getTimerConfig();
  const progress = ((config.totalTime - timeLeft) / config.totalTime) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Pomodoro Timer</h1>
        <p className="text-gray-400">Focus with the Pomodoro Technique</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timer */}
        <div className="lg:col-span-2">
          <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-8">
            <div className="text-center">
              {/* Timer Status */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className={`p-3 bg-gradient-to-r ${config.color} rounded-lg`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{config.title}</h2>
              </div>

              {/* Timer Display */}
              <div className={`relative inline-block p-8 bg-gradient-to-r ${config.bgColor} rounded-full mb-6`}>
                <div className="text-6xl font-bold text-white">
                  {formatTime(timeLeft)}
                </div>
                <div className="absolute inset-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${progress * 2.83} 283`}
                      className="transition-all duration-300"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <Progress value={progress} className="h-2" />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                {!isRunning ? (
                  <Button
                    onClick={startTimer}
                    className={`bg-gradient-to-r ${config.color} hover:opacity-90 text-white px-8 py-3`}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={pauseTimer}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 px-8 py-3"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button
                  onClick={resetTimer}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>

                <Button
                  onClick={skipSession}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Square className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats & Settings */}
        <div className="space-y-6">
          {/* Session Stats */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Stats
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Completed Sessions</span>
                  <span className="text-white font-medium">{stats.sessionsToday}</span>
                </div>
                <Progress value={(stats.sessionsToday / 8) * 100} className="h-2" />
                <span className="text-xs text-gray-400">Goal: 8 sessions</span>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-400 text-sm">Focus Time</span>
                  <span className="text-white font-medium">{stats.focusTimeToday} min</span>
                </div>
                <Progress value={(stats.focusTimeToday / 200) * 100} className="h-2" />
                <span className="text-xs text-gray-400">Goal: 200 min</span>
              </div>
            </div>
          </Card>

          {/* Quick Settings */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Timer Settings</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Focus Time</span>
                <span className="text-white">{settings.focusTime} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Short Break</span>
                <span className="text-white">{settings.shortBreak} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Long Break</span>
                <span className="text-white">{settings.longBreak} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Long Break After</span>
                <span className="text-white">{settings.sessionsUntilLongBreak} sessions</span>
              </div>
            </div>
          </Card>

          {/* Session Tracker */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Session Tracker</h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: settings.sessionsUntilLongBreak }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium ${
                    i < stats.sessionsToday % settings.sessionsUntilLongBreak
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white'
                      : 'border-gray-600 text-gray-400'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              {stats.sessionsToday % settings.sessionsUntilLongBreak}/{settings.sessionsUntilLongBreak} until long break
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timer;