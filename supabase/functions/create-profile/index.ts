import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - No token provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with user's auth
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    const userEmail = claimsData.claims.email as string;

    // Parse request body for optional profile data
    let profileData: Record<string, any> = {};
    try {
      const body = await req.json();
      profileData = body || {};
    } catch {
      // No body or invalid JSON, use defaults
    }

    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing profile:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to check existing profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If profile exists, return success
    if (existingProfile) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Profile already exists",
          profile_id: existingProfile.id 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create new profile with atomic insert
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const newProfile = {
      user_id: userId,
      email: userEmail,
      first_name: profileData.first_name || userEmail.split("@")[0],
      last_name: profileData.last_name || null,
      birthday: profileData.birthday || null,
      gender: profileData.gender || null,
      location: profileData.location || null,
      looking_for: profileData.looking_for || null,
      bio: profileData.bio || null,
      interests: profileData.interests || null,
      avatar_url: profileData.avatar_url || null,
      is_verified: false,
      is_premium: false,
    };

    const { data: insertedProfile, error: insertError } = await adminClient
      .from("profiles")
      .insert(newProfile)
      .select("id")
      .single();

    if (insertError) {
      // Handle unique constraint violation (profile already created by trigger)
      if (insertError.code === "23505") {
        const { data: existingNow } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", userId)
          .single();
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Profile already exists",
            profile_id: existingNow?.id 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.error("Error creating profile:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create profile", details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Profile created successfully",
        profile_id: insertedProfile.id 
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
