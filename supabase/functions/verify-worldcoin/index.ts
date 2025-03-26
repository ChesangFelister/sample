import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const WORLDCOIN_APP_ID = "app_efa0e26d7bd45be73d63896ded679bb1";
    const ACTION_ID = "verification";
    
    // Get the proof and signal data from the request
    const { proof, nullifier_hash, merkle_root, signal } = await req.json();
    
    if (!proof || !nullifier_hash || !merkle_root) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required Worldcoin verification data" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    // Verify the proof with Worldcoin's API
    const verifyResponse = await fetch("https://developer.worldcoin.org/api/v1/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        app_id: WORLDCOIN_APP_ID,
        action: ACTION_ID,
        signal: signal || "",
        proof,
        nullifier_hash,
        merkle_root
      }),
    });

    const verifyData = await verifyResponse.json();
    
    if (!verifyResponse.ok || !verifyData.success) {
      console.error("Worldcoin verification failed:", verifyData);
      
      // Log the failed verification attempt
      const authHeader = req.headers.get('Authorization');
      if (authHeader) {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          { global: { headers: { Authorization: authHeader } } }
        );
        
        await supabaseClient
          .from("user_auth_logs")
          .insert({
            user_id: nullifier_hash,
            auth_provider: "worldcoin",
            login_status: "failed",
            login_time: new Date().toISOString(),
          });
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Worldcoin verification failed" 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400 
        }
      );
    }

    console.log("Worldcoin verification successful");
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    // Get the user's ID from the JWT
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "User not authenticated" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // Log this successful verification
    await supabaseClient
      .from("user_auth_logs")
      .insert({
        user_id: nullifier_hash,
        auth_provider: "worldcoin",
        login_status: "success",
        login_time: new Date().toISOString(),
      });

    // Store the verification in the database
    const { data: existingVerification, error: checkError } = await supabaseClient
      .from("user_verifications")
      .select("*")
      .eq("nullifier_hash", nullifier_hash)
      .maybeSingle();

    if (checkError) {
      console.error("Error checking for existing verification:", checkError);
      return new Response(
        JSON.stringify({ success: false, error: "Database error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // If verification already exists, update the user_id
    if (existingVerification) {
      const { error: updateError } = await supabaseClient
        .from("user_verifications")
        .update({ user_id: user.id })
        .eq("id", existingVerification.id);

      if (updateError) {
        console.error("Error updating verification:", updateError);
        return new Response(
          JSON.stringify({ success: false, error: "Database error" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    } else {
      // Create new verification record
      const { error: insertError } = await supabaseClient
        .from("user_verifications")
        .insert({
          nullifier_hash,
          user_id: user.id,
          verification_level: "orb"
        });

      if (insertError) {
        console.error("Error inserting verification:", insertError);
        return new Response(
          JSON.stringify({ success: false, error: "Database error" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Worldcoin verification successful",
        verified: true,
        nullifier_hash
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in verify-worldcoin function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});