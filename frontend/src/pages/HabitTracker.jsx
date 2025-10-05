import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Calendar, TrendingUp, BarChart3, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { useToast } from '../hooks/use-toast';
import { getHabits, toggleHabit, deleteHabit } from '../utils/localStorage';
import AddHabitModal from '../components/AddHabitModal';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    setHabits(getHabits());
  };

  const handleHabitAdded = (newHabit) => {
    loadHabits();
  };

  const handleToggleHabit = async (habitId) => {
    try {
      const updatedHabit = toggleHabit(habitId);
      if (updatedHabit) {
        loadHabits();
        toast({
          title: "Success",
          description: updatedHabit.completedToday 
            ? `Great job! You completed "${updatedHabit.name}" today!` 
            : `Habit "${updatedHabit.name}" marked as incomplete.`
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive"
      });
    }
  };

  const handleDeleteHabit = async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (window.confirm(`Are you sure you want to delete the habit "${habit.name}"?`)) {
      try {
        deleteHabit(habitId);
        loadHabits();
        toast({
          title: "Success",
          description: "Habit deleted successfully!"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete habit",
          variant: "destructive"
        });
      }
    }
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
  const longestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0;
  const averageStreak = habits.length > 0 ? habits.reduce((sum, h) => sum + h.streak, 0) / habits.length : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Habit Tracker</h1>
          <p className="text-gray-400">Build consistent daily habits</p>
        </div>
        <AddHabitModal onHabitAdded={handleHabitAdded} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Habits</p>
              <p className="text-2xl font-bold text-white">{totalHabits}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Completed Today</p>
              <p className="text-2xl font-bold text-white">{completedToday}/{totalHabits}</p>
              <Progress value={completionRate} className="mt-2 h-2" />
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <CheckCircle className="w-6 h-6 text-white" />
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
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Average Streak</p>
              <p className="text-2xl font-bold text-white">{Math.round(averageStreak)}</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Habits List */}
      <div className="grid gap-4">
        {habits.map((habit) => (
          <Card key={habit.id} className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                    habit.completedToday
                      ? 'bg-gradient-to-r from-green-400 to-emerald-400 border-green-400 scale-110'
                      : 'border-gray-600 hover:border-green-400'
                  }`}
                >
                  {habit.completedToday && <CheckCircle className="w-6 h-6 text-white" />}
                </button>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{habit.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {habit.streak} day streak
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {habit.totalCompletions} total completions
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-white mb-1">{habit.streak}</div>
                  <div className="text-sm text-gray-400">days</div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => handleDeleteHabit(habit.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Progress visualization */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Weekly Progress</span>
                <span className="text-sm text-gray-400">
                  {Math.min(Math.round((habit.streak / 7) * 100), 100)}%
                </span>
              </div>
              <Progress 
                value={Math.min((habit.streak / 7) * 100, 100)} 
                className="h-2"
              />
            </div>
          </Card>
        ))}
      </div>

      {habits.length === 0 && (
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-12 text-center">
          <div className="text-gray-400">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No habits yet</h3>
            <p className="mb-4">Start building positive daily habits to improve your study routine.</p>
            <AddHabitModal onHabitAdded={handleHabitAdded} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default HabitTracker;