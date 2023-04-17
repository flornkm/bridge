import supabase from "../../supabase";

export default async function handler(req, res) {
    if (req.query.owner) {
        const { data, error } = await supabase
            .from("published")
            .select("*")
            .eq("owner", req.query.owner)
            .eq("id", req.query.id)
            .single();

        if (error) {
            res.status(500).json({ error: error.message });
        }

        res.status(200).json(data);
    }
}
