
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import ClaimSection from "@/components/ClaimSection";
import TasksSection from "@/components/TasksSection";

const Dashboard = () => {
  const { isAuthenticated, isLoading, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Background />
        <div className="loading-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 pt-24 pb-10">
        <div className="mb-8 text-center animate-slide-in">
          <h1 className="text-3xl font-bold mb-2">Welcome to TraderPulse Token</h1>
          <p className="text-white/70">
            Your Worldcoin verification is active. Start claiming your tokens!
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
          <div className="w-full md:w-1/2">
            <ClaimSection />
          </div>
          
          <div className="w-full md:w-1/2">
            <TasksSection />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
