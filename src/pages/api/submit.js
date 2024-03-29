import supabase from "../../supabase";

export default async function handler(req, res) {
  let submission = {
    ...req.body.submitData,
    time: new Date().toISOString(), // add actual time to the submission
    status: "pending",
  };

  // convert the submission into a normal object and remove the ' ' from the keys
  submission = Object.fromEntries(
    Object.entries(submission).map(([key, value]) => [key.replace(/'/g, ""), value])
  );

  console.log(submission);

  const keys = Object.keys(submission).sort((a, b) => {
    if (a === "time") {
      return -1;
    } else if (b === "time") {
      return 1;
    } else if (a === "status") {
      return 1;
    } else if (b === "status") {
      return -1;
    } else {
      return 0;
    }
  });
  const submissionArray = keys.map((key, index) => {
    return {
      id: index + 1,
      [key]: submission[key],
    };
  });
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
  const newSubmissions = [
    [...submissionArray],
    ...submissions.filter((sub) => Array.isArray(sub)),
  ];

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
