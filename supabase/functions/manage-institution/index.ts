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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify caller is super_admin
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401,
      });
    }

    const { data: callerProfile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();

    if (callerProfile?.role !== "super_admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403,
      });
    }

    const body = await req.json();
    const { action, institutionId, name, location, plan, status, adminId } = body;

    if (action === "create") {
      // Insert new institution
      const { data: institution, error: insertError } = await supabase
        .from("institutions")
        .insert({ name, location, plan, status, admin_id: adminId || null })
        .select()
        .single();

      if (insertError) throw insertError;

      // Link admin to this institution
      if (adminId) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ institution_id: institution.id })
          .eq("id", adminId);
        if (profileError) throw profileError;
      }

      return new Response(JSON.stringify({ institution }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });

    } else if (action === "update") {
      if (!institutionId) throw new Error("institutionId is required for update");

      // Get old admin to unlink if changed
      const { data: oldInstitution } = await supabase
        .from("institutions").select("admin_id").eq("id", institutionId).single();

      // Update institution
      const updates: Record<string, any> = {};
      if (name !== undefined) updates.name = name;
      if (location !== undefined) updates.location = location;
      if (plan !== undefined) updates.plan = plan;
      if (status !== undefined) updates.status = status;
      if (adminId !== undefined) updates.admin_id = adminId || null;

      const { error: updateError } = await supabase
        .from("institutions").update(updates).eq("id", institutionId);
      if (updateError) throw updateError;

      // Unlink old admin if admin changed
      if (oldInstitution?.admin_id && oldInstitution.admin_id !== adminId) {
        await supabase.from("profiles")
          .update({ institution_id: null })
          .eq("id", oldInstitution.admin_id);
      }

      // Link new admin
      if (adminId && adminId !== oldInstitution?.admin_id) {
        await supabase.from("profiles")
          .update({ institution_id: institutionId })
          .eq("id", adminId);
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });

    } else {
      throw new Error("Invalid action. Use 'create' or 'update'.");
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400,
    });
  }
});
