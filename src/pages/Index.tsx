import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import WorldcoinButton from "@/components/WorldcoinButton";

const Index = () => {
  const { isAuthenticated, isLoading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Background />
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pt-20 pb-10">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="mb-10 mt-10">
            <div className="relative inline-block">
              <img 
                src="https://assets.onecompiler.app/42p32vw56/43b38xwbq/1000035087.png" 
                alt="TraderPulse Token" 
                className="tpt-logo w-32 h-32 md:w-40 md:h-40 mx-auto mb-6"
              />
              <div className="absolute -inset-4 rounded-full border-2 border-white/20 animate-pulse-ring opacity-80"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-slide-in">
              TraderPulse Token
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto animate-slide-in" style={{ animationDelay: "100ms" }}>
              Claim 100 TPT tokens daily and complete tasks to earn more
            </p>
            
            <div className="animate-slide-in" style={{ animationDelay: "200ms" }}>
              <WorldcoinButton />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-slide-in" style={{ animationDelay: "300ms" }}>
            <div className="glass-panel p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Daily Claims</h3>
              <p className="text-white/70 text-sm">Claim 100 TPT tokens every 24 hours with your Worldcoin ID.</p>
            </div>
            
            <div className="glass-panel p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Complete Tasks</h3>
              <p className="text-white/70 text-sm">Earn additional TPT by completing simple daily tasks.</p>
            </div>
            
            <div className="glass-panel p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified with World ID</h3>
              <p className="text-white/70 text-sm">Secure and private verification with Worldcoin technology.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;