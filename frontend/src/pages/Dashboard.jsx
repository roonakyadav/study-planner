import React, { useState, useEffect } from 'react';
import { Search, Download, Upload, CheckCircle, Clock, Target, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { getTasks, getHabits, exportData, importData } from '../utils/localStorage';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTasks(getTasks());
    setHabits(getHabits());
  };

  const handleExport = () => {
    try {
      exportData();
      toast({
        title: "Success",
        description: "Data exported successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await importData(file);
      loadData(); // Reload data after import
      toast({
        title: "Success",
        description: "Data imported successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid backup file format",
        variant: "destructive"
      });
    }

    // Reset file input
    event.target.value = '';
  };

  const todaysTasks = tasks.filter(task => {
    if (!task.dueDate && !task.deadline) return false;
    const rawDate = task.dueDate || task.deadline;
    const due = new Date(rawDate);
    if (isNaN(due)) return false;
    return due.toDateString() === new Date().toDateString();
  });


  const completedTasks = tasks.filter(task => task.status === 'completed');
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;

  const todaysCompletedHabits = habits.filter(habit => habit.completedToday);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your study overview.</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tasks..."
              className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-400"
            />
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file-dashboard"
            />
            <label htmlFor="import-file-dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Today's Tasks</p>
              <p className="text-2xl font-bold text-white">{todaysTasks.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{Math.round(completionRate)}%</p>
              <Progress value={completionRate} className="mt-2 h-2" />
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Longest Streak</p>
              <p className="text-2xl font-bold text-white">{longestStreak}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active Habits</p>
              <p className="text-2xl font-bold text-white">{habits.length}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Today's Tasks */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Tasks</h3>
          <div className="space-y-3">
            {todaysTasks.length === 0 ? (
              <p className="text-gray-400 text-sm">No tasks due today</p>
            ) : (
              todaysTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{task.title}</p>
                    <p className="text-gray-400 text-xs">{task.category}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {tasks
              .filter(task => task.status !== 'completed')
              .sort((a, b) => new Date(a.dueDate || a.deadline) - new Date(b.dueDate || b.deadline))
              .slice(0, 5)
              .map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{task.title}</p>
                    <p className="text-gray-400 text-xs">
                      Due: {(() => {
                        const rawDate = task.dueDate || task.deadline;
                        const d = new Date(rawDate);
                        return isNaN(d) ? "Invalid Date" : d.toLocaleDateString();
                      })()}
                    </p>
                  </div>
                </div>
              ))
            }

          </div>
        </Card>

        {/* Today's Habits */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Today's Habits</h3>
          <div className="space-y-3">
            {habits.length === 0 ? (
              <p className="text-gray-400 text-sm">No habits created yet</p>
            ) : (
              habits.slice(0, 5).map((habit) => (
                <div key={habit.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${habit.completedToday
                    ? 'bg-gradient-to-r from-green-400 to-emerald-400 border-green-400'
                    : 'border-gray-600'
                    }`}>
                    {habit.completedToday && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{habit.name}</p>
                    <p className="text-gray-400 text-xs">
                      {habit.streak} day streak
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;