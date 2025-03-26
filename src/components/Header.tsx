
import React from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="w-full fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/a0050df4-cce2-4444-aaf0-612231c5e693.png" 
            alt="TraderPulse Token" 
            className="h-10 w-auto"
          />
          <h1 className="text-white text-xl font-semibold hidden sm:block">TraderPulse Token</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <>
              <div className="hidden md:flex items-center gap-2 bg-tpt-accent px-4 py-2 rounded-full">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium">{user?.totalClaimed || 0} TPT</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent border-white/20 hover:bg-white/10 transition-all"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Disconnect</span>
              </Button>
            </>
          )}
          <a 
            href="https://www.tradepulsetoken.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-white/70 hover:text-white transition-colors"
          >
            Official Website
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
