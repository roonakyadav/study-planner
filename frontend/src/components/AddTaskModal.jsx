import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { addTask } from '../utils/localStorage';

const AddTaskModal = ({ onTaskAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: '',
    status: 'pending'
  });

  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }

    if (!formData.dueDate) {
      toast({
        title: "Error",
        description: "Deadline is required",
        variant: "destructive"
      });
      return;
    }


    try {
      // convert dueDate to ISO string
      const newTask = addTask({
        ...formData,
        deadline: new Date(formData.dueDate).toISOString()  // normalize deadline
      });

      toast({
        title: "Success",
        description: "Task added successfully!"
      });


      setFormData({
        title: '',
        description: '',
        dueDate: '',    // stays as input state only
        priority: 'medium',
        category: '',
        status: 'pending'
      });



      setOpen(false);
      if (onTaskAdded) onTaskAdded(newTask);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive"
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          <Plus className="w-4 h-4 mr-2 text-white" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add New Task
          </DialogTitle>
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4">
            <X className="w-4 h-4 text-white" />
          </button>

        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="bg-black/20 border-white/10 text-white placeholder-gray-400 mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className="bg-black/20 border-white/10 text-white placeholder-gray-400 mt-1 min-h-[80px]"
            />
          </div>
          <div>
            <Label htmlFor="dueDate" className="text-white">Deadline *</Label>
            <div className="relative">
              <Input
                id="dueDate"
                name="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={handleChange}
                className="bg-black/20 border-white/10 text-white mt-1 pr-10
                            [&::-webkit-calendar-picker-indicator]:absolute 
                            [&::-webkit-calendar-picker-indicator]:right-3
                            [&::-webkit-calendar-picker-indicator]:cursor-pointer
                            [&::-webkit-calendar-picker-indicator]:invert
                            [&::-webkit-calendar-picker-indicator]:opacity-100"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="priority" className="text-white">Priority</Label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <Label htmlFor="category" className="text-white">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Programming, Study, Work"
              className="bg-black/20 border-white/10 text-white placeholder-gray-400 mt-1"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-white">Status</Label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 bg-black/20 border border-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;