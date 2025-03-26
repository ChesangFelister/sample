
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { formatDistanceToNow } from "date-fns";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClaimSection: React.FC = () => {
  const { user, claimStatus, claimTokens } = useApp();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClaim = () => {
    if (!claimStatus.canClaim) return;
    
    setIsAnimating(true);
    claimTokens();
    
    toast({
      title: "Tokens Claimed!",
      description: "You have successfully claimed 100 TPT tokens.",
      variant: "default",
    });
    
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel p-6 w-full max-w-md mx-auto animate-slide-in">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Daily Claim</h2>
        <p className="text-white/70">Claim your 100 TPT tokens every 24 hours</p>
      </div>
      
      <div className="flex flex-col items-center justify-center py-6">
        <div className={`relative mb-6 ${isAnimating ? 'animate-pulse' : ''}`}>
          <div className="w-32 h-32 rounded-full flex items-center justify-center bg-tpt-accent">
            <span className="text-4xl font-bold">100</span>
          </div>
          <div className="absolute -inset-2 rounded-full border-2 border-white/20 animate-pulse-ring"></div>
          <div className="absolute top-1 right-0 text-yellow-400">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        
        {claimStatus.canClaim ? (
          <Button
            onClick={handleClaim}
            className="bg-white text-black hover:bg-white/90 font-semibold text-lg px-8 py-6 h-auto transition-all duration-300"
          >
            Claim Tokens
          </Button>
        ) : (
          <div className="text-center">
            <div className="text-2xl font-mono mb-2">
              {claimStatus.timeRemaining !== null ? formatTimeRemaining(claimStatus.timeRemaining) : "00:00:00"}
            </div>
            <p className="text-white/70 text-sm">
              Next claim available {claimStatus.nextClaimTime ? formatDistanceToNow(new Date(claimStatus.nextClaimTime), { addSuffix: true }) : "soon"}
            </p>
          </div>
        )}
      </div>
      
      <div className="border-t border-white/10 pt-4 mt-4">
        <div className="flex justify-between items-center">
          <span className="text-white/70">Total claimed:</span>
          <span className="font-semibold">{user?.totalClaimed || 0} TPT</span>
        </div>
        {user?.lastClaim && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-white/70">Last claim:</span>
            <span className="text-sm">{formatDistanceToNow(new Date(user.lastClaim), { addSuffix: true })}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimSection;
