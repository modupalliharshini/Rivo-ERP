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
      .select("role")
      .eq("id", user.id)
      .single();

    if (!callerProfile || (callerProfile.role !== "super_admin" && callerProfile.role !== "admin")) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    const { targetUserId } = await req.json();

    // Fetch target user profile
    const { data: targetProfile } = await supabaseClient
      .from("profiles")
      .select("role, institution_id")
      .eq("id", targetUserId)
      .single();

    if (!targetProfile) {
      throw new Error("User not found");
    }

    // Protection: Super Admin cannot be deleted
    if (targetProfile.role === "super_admin") {
      throw new Error("Cannot delete a Super Admin account");
    }

    // Protection: Admins can only delete users in their institution
    if (callerProfile.role === "admin") {
      const { data: callerFullProfile } = await supabaseClient.from("profiles").select("institution_id").eq("id", user.id).single();
      if (targetProfile.institution_id !== callerFullProfile?.institution_id) {
        throw new Error("Forbidden: You can only delete users within your own institution");
      }
    }

    // Delete user from Auth (this cascade deletes from public.profiles if foreign key is set correctly)
    const { error: deleteError } = await supabaseClient.auth.admin.deleteUser(targetUserId);
    if (deleteError) throw deleteError;

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
