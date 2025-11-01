//to fill in db with embeddings vectors for existing rows
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import OpenAI from "https://esm.sh/openai@4.56.0";


const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});

const supabase = createClient(
  Deno.env.get("PROJECT_URL")!,
  Deno.env.get("SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    console.log("🚀 Starting batch embedding generation...");

     // get rows missing with embeddings
    const { data: rows, error } = await supabase
      .from("employees")
      .select("*")
      .is("embedding", null)
      .limit(30);

    if (error) throw error;
    if (!rows || rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "No rows with missing embeddings found." }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(`📦 Found ${rows.length} rows to process.`);

    //create embeddings for each row
    for (const row of rows) {
      try {
        const bonusText = row.bonus
          ? ` They receive a yearly bonus of ${row.bonus}.`
          : "";
        const summary = `${row.full_name} is a ${row.job_title} in the ${row.department} department at the ${row.business_unit} unit located in ${row.city}, ${row.country}.${bonusText}`;

        const embeddingResponse = await openai.embeddings.create({
          model: "text-embedding-3-small",
          input: summary,
        });

        const [{ embedding }] = embeddingResponse.data;

        const { error: updateError } = await supabase
          .from("employees")
          .update({ embedding })
          .eq("id", row.id);

        if (updateError) {
          console.error("Update error for ID:", row.id, updateError);
        } else {
          console.log("Updated embedding for:", row.full_name);
        }
      } catch (rowErr) {
        console.error("Error processing row:", row.id, rowErr);
      }
    }

    console.log("Batch embedding generation completed successfully.");

    return new Response(
      JSON.stringify({ status: "Batch embedding generation complete." }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
