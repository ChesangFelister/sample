
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Background from "@/components/Background";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <Background />
      
      <div className="glass-panel p-8 max-w-md animate-slide-in">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-white/80 mb-6">Oops! Page not found</p>
        
        <Button 
          onClick={() => navigate("/")}
          className="bg-white text-black hover:bg-white/90 font-semibold"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
