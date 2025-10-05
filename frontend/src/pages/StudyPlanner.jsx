import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Calendar } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { getTasks, deleteTask, updateTask } from '../utils/localStorage';
import AddTaskModal from '../components/AddTaskModal';

const StudyPlanner = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(getTasks());
  };

  const handleTaskAdded = (newTask) => {
    loadTasks();
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        deleteTask(taskId);
        loadTasks();
        toast({
          title: "Success",
          description: "Task deleted successfully!"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggleStatus = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus;
    if (task.status === 'pending') {
      newStatus = 'in-progress';
    } else if (task.status === 'in-progress') {
      newStatus = 'completed';
    } else {
      newStatus = 'pending';
    }

    try {
      updateTask(taskId, { status: newStatus });
      loadTasks();
      toast({
        title: "Success",
        description: `Task marked as ${newStatus.replace('-', ' ')}!`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'pending': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Study Planner</h1>
          <p className="text-gray-400">Organize and track your study tasks</p>
        </div>
        <AddTaskModal onTaskAdded={handleTaskAdded} />
      </div>

      {/* Filters */}
      <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-6">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-white/10 text-white placeholder-gray-400"
            />
          </div>
          
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </Card>

      {/* Tasks List */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="bg-black/20 backdrop-blur-xl border-white/10 p-6 hover:bg-black/30 transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{task.title}</h3>
                {task.description && (
                  <p className="text-gray-400 mb-3">{task.description}</p>
                )}
                
                <div className="flex gap-2 items-center mb-3">
                  <Badge 
                    className={`border cursor-pointer ${getPriorityColor(task.priority)}`}
                    onClick={() => handleToggleStatus(task.id)}
                  >
                    {task.priority}
                  </Badge>
                  <Badge 
                    className={`border cursor-pointer ${getStatusColor(task.status)}`}
                    onClick={() => handleToggleStatus(task.id)}
                  >
                    {task.status.replace('-', ' ')}
                  </Badge>
                  {task.category && (
                    <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                      {task.category}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Due: {new Date(task.deadline).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                  onClick={() => handleToggleStatus(task.id)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <Card className="bg-black/20 backdrop-blur-xl border-white/10 p-12 text-center">
          <div className="text-gray-400">
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="mb-4">
              {tasks.length === 0 
                ? "Create your first task to get started with organizing your studies."
                : "Try adjusting your search or filters to find what you're looking for."
              }
            </p>
            <AddTaskModal onTaskAdded={handleTaskAdded} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudyPlanner;