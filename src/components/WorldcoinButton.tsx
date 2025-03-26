import React from "react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { IDKitWidget } from "@worldcoin/idkit";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { ISuccessResult } from "@worldcoin/idkit";

// Define a more accurate error state interface based on actual API
interface IErrorState {
  code: string;
  detail?: string;
  error_description?: string;
  errorMessage?: string; // Add this for backward compatibility
}

const WorldcoinButton: React.FC = () => {
  const { login, isLoading } = useApp();
  const { toast } = useToast();

  const handleVerify = async (proof: any) => {
    try {
      // First, make sure the user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session exists, create an anonymous session
        const { error } = await supabase.auth.signInAnonymously();
        if (error) throw error;
      }
      
      // Now verify the proof with our edge function
      const response = await supabase.functions.invoke("verify-worldcoin", {
        body: {
          proof: proof.proof,
          merkle_root: proof.merkle_root,
          nullifier_hash: proof.nullifier_hash,
          signal: proof.nullifier_hash // Using the nullifier hash as the signal
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.error || "Verification failed");
      }

      // After successful verification, login to the app
      login(response.data.nullifier_hash);
      
      // Log this login event
      await logLoginActivity("worldcoin", response.data.nullifier_hash);
      
      toast({
        title: "Verification Successful",
        description: "Your World ID has been verified successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "Could not verify with World ID",
        variant: "destructive",
      });
    }
  };

  // Function to log login activity
  const logLoginActivity = async (provider: string, userId: string) => {
    try {
      const { error } = await supabase
        .from("user_auth_logs")
        .insert({
          user_id: userId,
          auth_provider: provider,
          login_status: "success",
          login_time: new Date().toISOString(),
          user_agent: navigator.userAgent
        });
      
      if (error) {
        console.error("Error logging auth activity:", error);
      }
    } catch (err) {
      console.error("Failed to log auth activity:", err);
    }
  };

  const onVerificationSuccess = (proof: ISuccessResult) => {
    console.log("Verification successful, proof received:", proof);
    handleVerify(proof);
  };

  const onVerificationError = (error: IErrorState) => {
    console.error("Verification error:", error);
    toast({
      title: "Verification Error",
      description: error.detail || error.error_description || "An error occurred during verification",
      variant: "destructive",
    });
  };

  return (
    <div className="text-center">
      <IDKitWidget
        app_id="app_efa0e26d7bd45be73d63896ded679bb1"
        action="verification"
        onSuccess={onVerificationSuccess}
        onError={onVerificationError}
        // The latest version doesn't use credential_types anymore
        verification_level="orb" as any // Type casting to fix type issue
        enableTelemetry={false}
      >
        {({ open }) => (
          <Button
            onClick={open}
            disabled={isLoading}
            className="bg-white text-black hover:bg-white/90 font-semibold text-lg px-8 py-6 h-auto rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-3">
              <img 
                src="https://assets.onecompiler.app/42p32vw56/43b38xwbq/1000035087.png" 
                alt="Worldcoin" 
                className="h-6 w-auto"
              />
              {isLoading ? (
                <span>Connecting...</span>
              ) : (
                <span>Sign in with Worldcoin</span>
              )}
            </div>
          </Button>
        )}
      </IDKitWidget>
      <p className="text-white/60 text-sm mt-4">
        Verify with World ID to start earning TPT
      </p>
    </div>
  );
};

export default WorldcoinButton;