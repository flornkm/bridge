import supabase from "../../supabase";

export default async function handler(req, res) {
    const submission = req.body;

    const { data, error } = await supabase
        .from("submissions")
        .insert([
            
}
