import supabase from "../../supabase";

export default async function handler(req, res) {
    if (req.query.name) {
        const { data, error } = await supabase
            .from("published")
            .select("*")
            .ilike("name", `%${req.query.name}%`)
            // .eq("name", req.query.name.toLowerCase())
            .eq("id", req.query.id)
            .single();

        if (error) {
            res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    }
}
