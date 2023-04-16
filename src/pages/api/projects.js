import supabase from "../../supabase";

export default async function handler(req, res) {

  if (req.method === "GET") {

    const id = req.query.user_id;

    if (req.query.project_id) {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner", id)
        .eq("id", req.query.project_id)
        .single();

      if (error) {
        res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    } else {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner", id);

      if (error) {
        res.status(500).json({ error: error.message });
      }

      res.status(200).json(data);
    }
  } else if (req.method === "POST") {
    let project = req.body;
    project.name = project.name.toLowerCase();

    // Create a new project and also publish it
    const { data, error } = await supabase
      .from("projects")
      .insert([project])
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("owner", project.owner)
        .order("id", { ascending: false })
        .limit(1)
        .single();

      // ave it into a variable and then if no error, publish it
      const newProject = data;

      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        const { data, error } = await supabase
          .from("published")
          .insert([newProject])
          .single();

        if (error) {
          res.status(500).json({ error: error.message });
        } else {
          console.log(data);
          res.status(200).json(data);
        }
      }
    }
  } else if (req.method === "DELETE") {
    const { data, error } = await supabase
      .from("published")
      .delete()
      .eq("id", req.query.project_id);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      const { data, error } = await supabase
        .from("projects")
        .delete()
        .eq("id", req.query.project_id);

      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json(data);
      }
    }
  }
}
