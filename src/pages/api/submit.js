import supabase from "../../supabase";

export default async function handler(req, res) {
  const submission = req.body.formData;
  const publishedId = req.body.id;

  // select the current submissions array
  const { data: publishedData, error: publishedError } = await supabase
    .from("published")
    .select("submissions")
    .eq("id", publishedId);

  if (publishedError) {
    console.log(publishedError);
    res.status(500).json({ error: publishedError.message });
    return;
  }

  const submissions = publishedData[0]?.submissions || [];

  // concatenate the new submission with the existing submissions
  const newSubmissions = [...submissions, submission ];

  // update the submissions field with the new concatenated array
  const { error: updateError } = await supabase
    .from("published")
    .update({ submissions: newSubmissions })
    .eq("id", publishedId);

  if (updateError) {
    console.log(updateError);
    res.status(500).json({ error: updateError.message });
  } else {
    res.status(200).json({ message: "Success!" });
  }
}
