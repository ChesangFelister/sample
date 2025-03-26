
import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, Task, ClaimStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface AppContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  claimStatus: ClaimStatus;
  login: (nullifierHash?: string) => void;
  logout: () => void;
  claimTokens: () => void;
  completeTask: (taskId: string) => void;
  resetTasks: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Default tasks moved to a separate constant
const DEFAULT_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Visit TraderPulse website",
    description: "Check out the official TraderPulse Token website for updates.",
    completed: false,
    completedAt: null,
    reward: 10,
  },
  {
    id: "task-2",
    title: "Share on Twitter",
    description: "Share TraderPulse Token on your Twitter account.",
    completed: false,
    completedAt: null,
    reward: 20,
  },
  {
    id: "task-3",
    title: "Join Telegram Group",
    description: "Join the TraderPulse Token community on Telegram.",
    completed: false,
    completedAt: null,
    reward: 15,
  },
  {
    id: "task-4",
    title: "Refer a Friend",
    description: "Invite a friend to join TraderPulse Token.",
    completed: false,
    completedAt: null,
    reward: 25,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [claimStatus, setClaimStatus] = useState<ClaimStatus>({
    canClaim: false,
    timeRemaining: null,
    nextClaimTime: null,
  });

  // Initialize and load user data
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if there's already an active session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get the user's verification data
          const { data: verification, error } = await supabase
            .from("user_verifications")
            .select("*")
            .eq("user_id", session.user.id)
            .maybeSingle();
          
          if (error) throw error;
          
          if (verification) {
            // Get the user's completed tasks
            const { data: userTasks, error: tasksError } = await supabase
              .from("user_tasks")
              .select("*, tasks(*)")
              .eq("user_id", session.user.id);
            
            if (tasksError) throw tasksError;
            
            // Get all available tasks
            const { data: allTasks, error: allTasksError } = await supabase
              .from("tasks")
              .select("*");
              
            if (allTasksError) throw allTasksError;
            
            // Map tasks with completion status
            const tasks = allTasks.map(task => {
              const completedTask = userTasks.find(ut => ut.task_id === task.id);
              return {
                id: task.id,
                title: task.title,
                description: task.description,
                reward: task.reward,
                completed: !!completedTask,
                completedAt: completedTask ? completedTask.completed_at : null
              };
            });
            
            // Create user profile with verification data
            const userProfile: UserProfile = {
              id: session.user.id,
              worldcoinVerified: true,
              lastClaim: verification.last_claim,
              totalClaimed: verification.total_claimed || 0,
              tasks
            };
            
            setUser(userProfile);
            updateClaimStatus(verification);
          } else {
            // No verification found
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
        } else if (session) {
          // Re-fetch user data when auth state changes
          await checkSession();
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update claim status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        updateClaimStatus();
      }
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [user]);

  const updateClaimStatus = (verificationData = null) => {
    if (!user && !verificationData) {
      setClaimStatus({
        canClaim: false,
        timeRemaining: null,
        nextClaimTime: null,
      });
      return;
    }
    
    const lastClaim = verificationData ? verificationData.last_claim : user?.lastClaim;
    
    if (!lastClaim) {
      setClaimStatus({
        canClaim: true,
        timeRemaining: null,
        nextClaimTime: null,
      });
      return;
    }
    
    const lastClaimDate = new Date(lastClaim);
    const now = new Date();
    const timeDiff = now.getTime() - lastClaimDate.getTime();
    const hoursLeft = 24 - (timeDiff / (1000 * 60 * 60));
    
    if (hoursLeft <= 0) {
      setClaimStatus({
        canClaim: true,
        timeRemaining: null,
        nextClaimTime: null,
      });
    } else {
      const nextClaimTime = new Date(lastClaimDate.getTime() + 24 * 60 * 60 * 1000);
      setClaimStatus({
        canClaim: false,
        timeRemaining: hoursLeft * 60 * 60 * 1000, // in milliseconds
        nextClaimTime: nextClaimTime.toISOString(),
      });
    }
  };

  const login = async (nullifierHash?: string) => {
    setIsLoading(true);
    try {
      // Check if there's already a session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Sign in anonymously if no session exists
        const { error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
      }
      
      if (nullifierHash) {
        // Get the verification record by nullifier hash
        const { data: verification, error } = await supabase
          .from("user_verifications")
          .select("*")
          .eq("nullifier_hash", nullifierHash)
          .maybeSingle();
          
        if (error) throw error;
        
        if (verification) {
          // Get all tasks
          const { data: allTasks, error: tasksError } = await supabase
            .from("tasks")
            .select("*");
            
          if (tasksError) throw tasksError;
          
          // Get user completed tasks
          const { data: userTasks, error: userTasksError } = await supabase
            .from("user_tasks")
            .select("*, tasks(*)")
            .eq("user_id", verification.user_id);
            
          if (userTasksError) throw userTasksError;
          
          // Map tasks with completion status
          const tasks = allTasks.map(task => {
            const completedTask = userTasks.find(ut => ut.task_id === task.id);
            return {
              id: task.id,
              title: task.title,
              description: task.description,
              reward: task.reward,
              completed: !!completedTask,
              completedAt: completedTask ? completedTask.completed_at : null
            };
          });
          
          // Create user profile
          const userProfile: UserProfile = {
            id: verification.user_id,
            worldcoinVerified: true,
            lastClaim: verification.last_claim,
            totalClaimed: verification.total_claimed || 0,
            tasks
          };
          
          setUser(userProfile);
          updateClaimStatus(verification);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const claimTokens = async () => {
    if (!user || !claimStatus.canClaim) return;
    
    try {
      // Update the user_verifications table
      const now = new Date().toISOString();
      const newTotal = (user.totalClaimed || 0) + 100;
      
      const { error } = await supabase
        .from("user_verifications")
        .update({
          last_claim: now,
          total_claimed: newTotal,
          next_claim_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      // Update local user state
      setUser({
        ...user,
        lastClaim: now,
        totalClaimed: newTotal
      });
      
      // Update claim status
      updateClaimStatus();
    } catch (error) {
      console.error("Error claiming tokens:", error);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;
    
    try {
      // Insert into user_tasks
      const { error } = await supabase
        .from("user_tasks")
        .insert({
          user_id: user.id,
          task_id: taskId,
          completed_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      // Update local state
      const updatedTasks = user.tasks.map(task => {
        if (task.id === taskId && !task.completed) {
          return {
            ...task,
            completed: true,
            completedAt: new Date().toISOString(),
          };
        }
        return task;
      });
      
      setUser({
        ...user,
        tasks: updatedTasks,
      });
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const resetTasks = async () => {
    if (!user) return;
    
    try {
      // Delete all user_tasks for this user
      const { error } = await supabase
        .from("user_tasks")
        .delete()
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      // Update local state - reset all tasks to incomplete
      const resetTasks = user.tasks.map(task => ({
        ...task,
        completed: false,
        completedAt: null
      }));
      
      setUser({
        ...user,
        tasks: resetTasks
      });
    } catch (error) {
      console.error("Error resetting tasks:", error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        claimStatus,
        login,
        logout,
        claimTokens,
        completeTask,
        resetTasks,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
