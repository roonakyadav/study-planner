import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sun,
  Bell,
  Download,
  Upload,
  Trash2,
  Save,
  BarChart3,
  Clock,
  Target
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import {
  getTimerSettings,
  updateTimerSettings,
  getSettings,
  updateSettings,
  getTasks,
  getHabits,
  exportData,
  importData,
  clearAllData
} from '../utils/localStorage';

const Settings = ({ darkMode, setDarkMode }) => {
  const { toast } = useToast();
  const [timerSettings, setTimerSettings] = useState({
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  });
  const [notifications, setNotifications] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeHabits: 0,
    longestStreak: 0
  });

  useEffect(() => {
    // Load settings and stats
    const settings = getSettings();
    const timer = getTimerSettings();
    const tasks = getTasks();
    const habits = getHabits();

    setNotifications(settings.notifications);
    setTimerSettings(timer);
    setStats({
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      activeHabits: habits.length,
      longestStreak: habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0
    });
  }, []);

  const handleExportData = () => {
    try {
      exportData();
      toast({
        title: "Data exported successfully",
        description: "Your data has been downloaded as a JSON file."
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data.",
        variant: "destructive"
      });
    }
  };

  const handleImportData = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await importData(file);
      toast({
        title: "Data imported successfully",
        description: "Your backup has been restored."
      });
      // Refresh page to show updated data
      window.location.reload();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Invalid backup file format.",
        variant: "destructive"
      });
    }

    // Reset file input
    event.target.value = '';
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      clearAllData();
      toast({
        title: "All data cleared",
        description: "Your study planner has been reset."
      });
      // Refresh page to show empty state
      window.location.reload();
    }
  };

  const saveTimerSettings = () => {
    const cleaned = {
      focusTime: Number(timerSettings.focusTime) || 25,
      shortBreak: Number(timerSettings.shortBreak) || 5,
      longBreak: Number(timerSettings.longBreak) || 15,
      sessionsUntilLongBreak: Number(timerSettings.sessionsUntilLongBreak) || 4
    };
    updateTimerSettings(cleaned);
    setTimerSettings(cleaned); // normalize back into state
    toast({
      title: "Settings saved",
      description: "Timer settings have been updated."
    });
  };


  const handleNotificationsChange = (enabled) => {
    setNotifications(enabled);
    updateSettings({ notifications: enabled });
    toast({
      title: "Settings updated",
      description: `Notifications ${enabled ? 'enabled' : 'disabled'}.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your study planner experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            Appearance
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Dark Mode</Label>
                <p className="text-sm text-gray-400">Toggle between light and dark theme</p>
              </div>
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Enable Notifications</Label>
                <p className="text-sm text-gray-400">Get alerts for timer completion and reminders</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsChange}
              />
            </div>
          </div>
        </Card>

        {/* Pomodoro Timer Settings */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Pomodoro Timer
          </h3>
          <div className="space-y-4">
            <div>
              <Label className="text-white">Focus Session (minutes)</Label>
              <Input
                type="number"
                min={1}
                value={timerSettings.focusTime}
                onChange={(e) => {
                  const v = e.target.value;
                  setTimerSettings(s => ({ ...s, focusTime: v === '' ? '' : Number(v) }));
                }}
                className="mt-1 bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Short Break (minutes)</Label>
              <Input
                type="number"
                min={1}
                value={timerSettings.shortBreak}
                onChange={(e) => {
                  const v = e.target.value;
                  setTimerSettings(s => ({ ...s, shortBreak: v === '' ? '' : Number(v) }));
                }}
                className="mt-1 bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Long Break (minutes)</Label>
              <Input
                type="number"
                min={1}
                value={timerSettings.longBreak}
                onChange={(e) => {
                  const v = e.target.value;
                  setTimerSettings(s => ({ ...s, longBreak: v === '' ? '' : Number(v) }));
                }}
                className="mt-1 bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white">Sessions Until Long Break</Label>
              <Input
                type="number"
                min={1}
                value={timerSettings.sessionsUntilLongBreak}
                onChange={(e) => {
                  const v = e.target.value;
                  setTimerSettings(s => ({ ...s, sessionsUntilLongBreak: v === '' ? '' : Number(v) }));
                }}
                className="mt-1 bg-black/20 border-white/10 text-white"
              />
            </div>
            <Button
              onClick={saveTimerSettings}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Timer Settings
            </Button>
          </div>
        </Card>


        {/* Data Management */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Data Management
          </h3>
          <div className="space-y-4">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file-settings"
              />
              <Label htmlFor="import-file-settings">
                <Button
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </span>
                </Button>
              </Label>
            </div>

            <Button
              onClick={handleClearAllData}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistics Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-white mb-1">{stats.totalTasks}</div>
              <div className="text-sm text-gray-400">Total Tasks</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">{stats.completedTasks}</div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-purple-400 mb-1">{stats.activeHabits}</div>
              <div className="text-sm text-gray-400">Active Habits</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-orange-400 mb-1">{stats.longestStreak}</div>
              <div className="text-sm text-gray-400">Longest Streak</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;