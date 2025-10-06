// localStorage utility functions for Study Planner

// Default data structure
const defaultData = {
  tasks: [
    {
      id: '1',
      title: 'Complete React Assignment',
      description: 'Build a todo app with React hooks',
      dueDate: new Date('2025-01-27T10:00:00').toISOString(),
      priority: 'high',
      category: 'Programming',
      status: 'in-progress',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Study JavaScript Closures',
      description: 'Review closures and lexical scoping',
      dueDate: new Date('2025-01-28T10:00:00').toISOString(),
      priority: 'medium',
      category: 'Programming',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Read Chapter 5 - Data Structures',
      description: 'Complete algorithms textbook chapter',
      dueDate: new Date('2025-01-26T10:00:00').toISOString(),
      priority: 'high',
      category: 'Computer Science',
      status: 'completed',
      createdAt: new Date().toISOString()
    }
  ],
  habits: [
    {
      id: '1',
      name: 'Read Programming Books',
      streak: 15,
      completedToday: true,
      totalCompletions: 45,
      lastCompleted: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Code Review Practice',
      streak: 8,
      completedToday: false,
      totalCompletions: 32,
      lastCompleted: '2025-01-25',
      createdAt: new Date().toISOString()
    }
  ],
  timerSettings: {
    focusTime: 25,
    shortBreak: 5,
    longBreak: 15,
    sessionsUntilLongBreak: 4
  },
  timerStats: {
    sessionsToday: 0,
    focusTimeToday: 0,
    totalSessions: 0,
    totalFocusTime: 0
  },
  settings: {
    darkMode: true,
    notifications: true
  }
};

// Initialize data if not exists
export const initializeData = () => {
  if (!localStorage.getItem('studyPlannerData')) {
    localStorage.setItem('studyPlannerData', JSON.stringify(defaultData));
  }
};

// Get all data
export const getData = () => {
  initializeData();
  return JSON.parse(localStorage.getItem('studyPlannerData'));
};

// Save all data
export const saveData = (data) => {
  localStorage.setItem('studyPlannerData', JSON.stringify(data));
};

// Tasks functions
export const getTasks = () => {
  const data = getData();
  return data.tasks || [];
};

export const addTask = (task) => {
  const data = getData();
  const newTask = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    // ensure dueDate is saved as a valid ISO timestamp or null
    dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null
  };
  data.tasks.push(newTask);
  saveData(data);
  return newTask;
};

export const updateTask = (taskId, updates) => {
  const data = getData();
  const taskIndex = data.tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    // if updates include dueDate, convert to ISO so storage is consistent
    const safeUpdates = { ...updates };
    if (safeUpdates.dueDate) {
      safeUpdates.dueDate = new Date(safeUpdates.dueDate).toISOString();
    }
    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...safeUpdates };
    saveData(data);
    return data.tasks[taskIndex];
  }
  return null;
};

export const deleteTask = (taskId) => {
  const data = getData();
  data.tasks = data.tasks.filter(task => task.id !== taskId);
  saveData(data);
};

// Habits functions
export const getHabits = () => {
  const data = getData();
  return data.habits || [];
};

export const addHabit = (habit) => {
  const data = getData();
  const newHabit = {
    ...habit,
    id: Date.now().toString(),
    streak: 0,
    completedToday: false,
    totalCompletions: 0,
    lastCompleted: null,
    createdAt: new Date().toISOString()
  };
  data.habits.push(newHabit);
  saveData(data);
  return newHabit;
};

export const toggleHabit = (habitId) => {
  const data = getData();
  const habitIndex = data.habits.findIndex(habit => habit.id === habitId);
  if (habitIndex !== -1) {
    const habit = data.habits[habitIndex];
    const today = new Date().toISOString().split('T')[0];
    
    if (habit.completedToday) {
      // Uncomplete habit
      habit.completedToday = false;
      habit.totalCompletions = Math.max(0, habit.totalCompletions - 1);
      if (habit.streak > 0) habit.streak--;
    } else {
      // Complete habit
      habit.completedToday = true;
      habit.totalCompletions++;
      habit.lastCompleted = today;
      
      // Calculate streak
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (habit.lastCompleted === yesterdayStr || habit.streak === 0) {
        habit.streak++;
      } else {
        habit.streak = 1;
      }
    }
    
    saveData(data);
    return habit;
  }
  return null;
};

export const deleteHabit = (habitId) => {
  const data = getData();
  data.habits = data.habits.filter(habit => habit.id !== habitId);
  saveData(data);
};

// Timer functions
export const getTimerSettings = () => {
  const data = getData();
  return data.timerSettings || defaultData.timerSettings;
};

export const updateTimerSettings = (settings) => {
  const data = getData();
  data.timerSettings = { ...data.timerSettings, ...settings };
  saveData(data);
};

export const getTimerStats = () => {
  const data = getData();
  return data.timerStats || defaultData.timerStats;
};

export const updateTimerStats = (stats) => {
  const data = getData();
  data.timerStats = { ...data.timerStats, ...stats };
  saveData(data);
};

// Settings functions
export const getSettings = () => {
  const data = getData();
  return data.settings || defaultData.settings;
};

export const updateSettings = (settings) => {
  const data = getData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
};

// Export/Import functions
export const exportData = () => {
  const data = getData();
  const exportData = {
    ...data,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `study-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        // Validate data structure
        if (importedData.tasks && importedData.habits) {
          saveData(importedData);
          resolve(true);
        } else {
          reject(new Error('Invalid data format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};

export const clearAllData = () => {
  localStorage.removeItem('studyPlannerData');
  initializeData();
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
