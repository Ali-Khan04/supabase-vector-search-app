//for inserting and searching embeddings
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import OpenAI from "https://deno.land/x/openai@v4/mod.ts";


const openai = new OpenAI({ apiKey: Deno.env.get("OPENAI_API_KEY") });
const supabase = createClient(
  Deno.env.get("PROJECT_URL")
Deno.env.get("SERVICE_ROLE_KEY")

);
//function to handle embedding insertion and searching
serve(async (req) => {
  try {
    const { text, mode } = await req.json();

   
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
//get the embedding vector from response
    const embedding = embeddingResponse.data[0].embedding;

    if (mode === "insert") {
    
      await supabase.from("employees").insert({
        content: text,
        embedding,
      });

      return new Response(JSON.stringify({ status: "inserted" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (mode === "search") {
      const { data } = await supabase.rpc("match_employees", {
        query_embedding: embedding,
        match_count: 5,
      });

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid mode" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
