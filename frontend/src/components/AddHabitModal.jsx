import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { addHabit } from '../utils/localStorage';

const AddHabitModal = ({ onHabitAdded }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Habit name is required",
        variant: "destructive"
      });
      return;
    }

    try {
      const newHabit = addHabit({ name: name.trim() });
      toast({
        title: "Success",
        description: "Habit added successfully!"
      });
      
      setName('');
      setOpen(false);
      if (onHabitAdded) onHabitAdded(newHabit);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add habit",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Add New Habit
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">Habit Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Read for 30 minutes, Exercise, Meditate"
              className="bg-black/20 border-white/10 text-white placeholder-gray-400 mt-1"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Choose something you can do daily to build a consistent habit.
            </p>
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
              Add Habit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitModal;