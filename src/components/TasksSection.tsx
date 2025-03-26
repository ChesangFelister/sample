
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, RefreshCcw, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const TasksSection: React.FC = () => {
  const { user, completeTask, resetTasks } = useApp();
  const { toast } = useToast();

  const handleCompleteTask = (taskId: string, reward: number) => {
    completeTask(taskId);
    
    toast({
      title: "Task Completed!",
      description: `You earned ${reward} TPT tokens.`,
      variant: "default",
    });
  };

  const handleResetTasks = () => {
    resetTasks();
    
    toast({
      title: "Tasks Reset",
      description: "All tasks have been reset.",
      variant: "default",
    });
  };

  const completedTasksCount = user?.tasks.filter(task => task.completed).length || 0;
  const totalTasks = user?.tasks.length || 0;

  return (
    <div className="glass-panel p-6 w-full max-w-md mx-auto animate-slide-in delay-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Daily Tasks</h2>
          <p className="text-white/70 text-sm">Complete tasks to earn more TPT</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{completedTasksCount}/{totalTasks}</div>
          <p className="text-white/70 text-sm">Completed</p>
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        {user?.tasks.map(task => (
          <div 
            key={task.id} 
            className={`p-4 rounded-lg border transition-all ${
              task.completed 
                ? 'bg-tpt-accent/30 border-white/20' 
                : 'bg-tpt-accent/10 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between mb-2">
              <h3 className="font-semibold">{task.title}</h3>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">+{task.reward} TPT</span>
                {task.completed ? (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 text-green-400">
                    <Check className="h-4 w-4" />
                  </span>
                ) : (
                  <Button
                    size="sm"
                    className="h-6 bg-white text-black hover:bg-white/90 px-2 py-0"
                    onClick={() => handleCompleteTask(task.id, task.reward)}
                  >
                    Do
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-sm text-white/70 mb-2">{task.description}</p>
            
            {task.completed && task.completedAt && (
              <div className="flex items-center text-xs text-white/60">
                <Clock className="h-3 w-3 mr-1" />
                Completed {format(new Date(task.completedAt), "MMM d, h:mm a")}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2 bg-transparent border-white/20 hover:bg-white/10 transition-all"
        onClick={handleResetTasks}
      >
        <RefreshCcw className="h-4 w-4" />
        Reset All Tasks
      </Button>
    </div>
  );
};

export default TasksSection;
