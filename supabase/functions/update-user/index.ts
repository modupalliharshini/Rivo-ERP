import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { data: callerProfile } = await supabaseClient
      .from("profiles")
      .select("role, institution_id")
      .eq("id", user.id)
      .single();

    if (!callerProfile || (callerProfile.role !== "super_admin" && callerProfile.role !== "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    const reqData = await req.json();
    const { 
      targetUserId, firstName, lastName, role, password, institutionId,
      grade, section, phone, specialization, designation, experience,
      sickLeaveBalance, casualLeaveBalance, earnedLeaveBalance
    } = reqData;

    if (!targetUserId) {
      throw new Error("targetUserId is required");
    }

    // Fetch target user profile
    const { data: targetProfile } = await supabaseClient
      .from("profiles")
      .select("role, institution_id")
      .eq("id", targetUserId)
      .single();

    if (!targetProfile) {
      throw new Error("Target user not found");
    }

    // Protection: Cannot edit Super Admin
    if (targetProfile.role === "super_admin") {
      throw new Error("Cannot edit a Super Admin account");
    }

    // Protection: Admins can only edit users in their institution
    if (callerProfile.role === "admin") {
      if (targetProfile.institution_id !== callerProfile.institution_id) {
        throw new Error("Forbidden: You can only edit users within your own institution");
      }
      // Admins cannot change someone's institution or make someone a Super Admin
      if (institutionId && institutionId !== callerProfile.institution_id) {
        throw new Error("Forbidden: Admins cannot move users to other institutions");
      }
      if (role === 'super_admin') {
        throw new Error("Forbidden: Admins cannot create Super Admins");
      }
    }

    // Update profile table
    const profileUpdates: Record<string, any> = {};
    if (firstName) profileUpdates.first_name = firstName;
    if (lastName !== undefined) profileUpdates.last_name = lastName;
    if (role) profileUpdates.role = role;
    if (institutionId !== undefined) profileUpdates.institution_id = institutionId || null;
    
    // extra fields
    if (grade !== undefined) profileUpdates.grade = grade || null;
    if (section !== undefined) profileUpdates.section = section || null;
    if (phone !== undefined) profileUpdates.phone = phone || null;
    if (specialization !== undefined) profileUpdates.specialization = specialization || null;
    if (designation !== undefined) profileUpdates.designation = designation || null;
    if (experience !== undefined) profileUpdates.experience = experience || null;
    if (sickLeaveBalance !== undefined) profileUpdates.sick_leave_balance = sickLeaveBalance;
    if (casualLeaveBalance !== undefined) profileUpdates.casual_leave_balance = casualLeaveBalance;
    if (earnedLeaveBalance !== undefined) profileUpdates.earned_leave_balance = earnedLeaveBalance;

    if (Object.keys(profileUpdates).length > 0) {
      const { error: profileError } = await supabaseClient
        .from("profiles")
        .update(profileUpdates)
        .eq("id", targetUserId);

      if (profileError) throw profileError;
    }

    // Optionally update password
    if (password && password.length >= 6) {
      const { error: pwError } = await supabaseClient.auth.admin.updateUserById(
        targetUserId,
        { password }
      );
      if (pwError) throw pwError;
    }

    return new Response(JSON.stringify({ success: true }), {
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
