import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const reqData = await req.json();
    const { 
      email, password, role, firstName, lastName, institutionId,
      grade, section, phone, specialization, designation, experience,
      sickLeaveBalance, casualLeaveBalance, earnedLeaveBalance
    } = reqData;

    // Optional: Bootstrapping check - if no profiles exist, allow creating the first super_admin
    const { count: profileCount } = await supabaseClient
      .from("profiles")
      .select("*", { count: "exact", head: true });

    let isBootstrapping = false;
    if (profileCount === 0 && role === "super_admin") {
      isBootstrapping = true;
    }

    if (!isBootstrapping) {
      // Normal flow: verify caller is super_admin or admin
      const authHeader = req.headers.get("Authorization")!;
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);
      
      if (authError || !user) {
        throw new Error("Unauthorized");
      }

      const { data: callerProfile } = await supabaseClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!callerProfile || (callerProfile.role !== "super_admin" && callerProfile.role !== "admin")) {
        throw new Response("Forbidden: You do not have permission to create users", { status: 403 });
      }
      
      // Admins cannot create super_admins
      if (callerProfile.role === "admin" && role === "super_admin") {
        throw new Response("Forbidden: Admins cannot create Super Admins", { status: 403 });
      }
    }

    // Create the user
    const { data: authData, error: createError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      throw createError;
    }

    // Create the profile
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .insert({
        id: authData.user.id,
        email: email,
        role: role,
        first_name: firstName,
        last_name: lastName,
        institution_id: institutionId || null,
        grade: grade || null,
        section: section || null,
        phone: phone || null,
        specialization: specialization || null,
        designation: designation || null,
        experience: experience || null,
        sick_leave_balance: sickLeaveBalance || 12,
        casual_leave_balance: casualLeaveBalance || 8,
        earned_leave_balance: earnedLeaveBalance || 5
      });

    if (profileError) {
      // Rollback user creation
      await supabaseClient.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return new Response(JSON.stringify({ user: authData.user }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
