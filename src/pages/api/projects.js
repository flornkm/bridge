import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
    const id = req.query.user_id;

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner", id);

    if (error) {
        res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);

}
