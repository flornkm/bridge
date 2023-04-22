import supabase from "../../supabase";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
    const file = await req.body;

    const name = `${uuidv4()}.pdf`;

    const { data, error } = await supabase.storage
        .from("uploads")
        .upload(name, file);

    if (error) {
        console.log(error);
        if (error.message === "The resource already exists") {
            const name = `${uuidv4()}.${fileType}`;
            const { data, error } = await supabase.storage
                .from("uploads")
                .upload(name, file, {
                    contentType:
                        fileType === "pdf" ? "application/pdf" : "image/jpeg"
                });
            if (error) {
                console.log(error);
                res.status(500).json({ error: error.message });
            } else {
                res.status(200).json({ fileName: name });
            }
        } else {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(200).json({ fileName: name });
    }
}
