import supabase from "../../supabase";

export default async function handler(req, res) {
    if (req.query.id) {
        const { data, error } = await supabase
            .from("published")
            .select("*")
            .eq("owner", req.query.id)
            .eq("name", req.query.name)
            .single();

        if (error) {
            res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    }
}
