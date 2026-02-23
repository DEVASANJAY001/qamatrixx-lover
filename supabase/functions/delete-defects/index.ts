import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DELETE_PASSWORD = "STA@123";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password, target } = await req.json();

    if (!password || typeof password !== "string" || password.length > 50) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (password !== DELETE_PASSWORD) {
      return new Response(JSON.stringify({ error: "Incorrect password" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validTargets = ["DVX", "SCA", "YARD", "ALL", "FINAL"];
    if (!target || !validTargets.includes(target)) {
      return new Response(JSON.stringify({ error: "Invalid target" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: string[] = [];

    if (target === "ALL") {
      const { error: e1 } = await supabase.from("defect_data").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (e1) results.push(`defect_data error: ${e1.message}`);
      else results.push("defect_data: all deleted");

      const { error: e2 } = await supabase.from("final_defect").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (e2) results.push(`final_defect error: ${e2.message}`);
      else results.push("final_defect: all deleted");
    } else if (target === "FINAL") {
      const { error } = await supabase.from("final_defect").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) results.push(`final_defect error: ${error.message}`);
      else results.push("final_defect: all deleted");
    } else {
      // Delete specific source
      const { error: e1 } = await supabase.from("defect_data").delete().eq("source", target);
      if (e1) results.push(`defect_data error: ${e1.message}`);
      else results.push(`defect_data ${target}: deleted`);

      const { error: e2 } = await supabase.from("final_defect").delete().eq("source", target);
      if (e2) results.push(`final_defect error: ${e2.message}`);
      else results.push(`final_defect ${target}: deleted`);
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
