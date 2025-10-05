import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { getTasks } from '../utils/localStorage';
import AddTaskModal from '../components/AddTaskModal';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(getTasks());
  };

  const handleTaskAdded = () => {
    loadTasks();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getTasksForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.deadline === dateString);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-20 bg-white/5 rounded-lg"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const dayTasks = getTasksForDate(date);

      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-20 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 ${
            isSelected 
              ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-400' 
              : 'bg-white/5'
          } ${isToday ? 'ring-2 ring-blue-400' : ''}`}
        >
          <div className={`text-sm font-medium mb-1 ${
            isToday ? 'text-blue-400' : 'text-white'
          }`}>
            {day}
          </div>
          {dayTasks.length > 0 && (
            <div className="space-y-1">
              {dayTasks.slice(0, 2).map((task) => (
                <div
                  key={task.id}
                  className={`text-xs px-1 py-0.5 rounded truncate ${
                    task.priority === 'high' ? 'bg-red-500/30 text-red-300' :
                    task.priority === 'medium' ? 'bg-yellow-500/30 text-yellow-300' :
                    'bg-green-500/30 text-green-300'
                  }`}
                >
                  {task.title}
                </div>
              ))}
              {dayTasks.length > 2 && (
                <div className="text-xs text-gray-400">+{dayTasks.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateTasks = getTasksForDate(selectedDate);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
          <p className="text-gray-400">View your tasks and deadlines</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={goToToday}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Today
          </Button>
          <AddTaskModal onTaskAdded={handleTaskAdded} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigateMonth(-1)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => navigateMonth(1)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {daysOfWeek.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendarDays()}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Tasks</span>
                <span className="text-white font-medium">{totalTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completed</span>
                <span className="text-green-400 font-medium">{completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">In Progress</span>
                <span className="text-blue-400 font-medium">{inProgressTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">High Priority</span>
                <span className="text-red-400 font-medium">{highPriorityTasks}</span>
              </div>
            </div>
          </Card>

          {/* Selected Date Tasks */}
          <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">
                  {selectedDate.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
              </div>
              {selectedDateTasks.length > 0 && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            {selectedDateTasks.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-3">No tasks scheduled for this date</p>
                <AddTaskModal onTaskAdded={handleTaskAdded} />
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-white/5 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{task.title}</h4>
                      <Badge className={`text-xs ${
                        task.priority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-green-500/20 text-green-300 border-green-500/30'
                      }`}>
                        {task.priority}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-gray-400 text-xs mb-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs">
                      {task.category && (
                        <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                          {task.category}
                        </Badge>
                      )}
                      <Badge className={`${
                        task.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        task.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        'bg-orange-500/20 text-orange-300 border-orange-500/30'
                      }`}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;