import { table, getMinifiedItem } from "../../utils/Airtable";

const airtable = async (_req, res) => {

  if (_req.method === "POST") {
    const data = _req.body;

    try {
      const newRecords = await table.create([{
        fields: {
          Name: data.name,
          Email: data.email,
          Terms: data.agreeTerms,
          Showcase: data.agreeShowcase,
          Date: new Date().toISOString()
        }
      }]);
      res.status(200).json(getMinifiedItem(newRecords[0]));
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went wrong! 😕" });
    }
  } else if (_req.method === "GET") {
    // select latest 5 records from table where showcase is true but only return the name and remove second word (last name)
    const records = await table
      .select({
        filterByFormula: "AND(Showcase, NOT({Name} = BLANK()))",
        sort: [{ field: "Date", direction: "desc" }],
        fields: ["Name", "Date"],
        maxRecords: 5
      })
      .firstPage();
    const minifiedRecords = records.map((record) => getMinifiedItem(record));

    res.status(200).json(minifiedRecords);
  } else {
    res.status(405).json({ msg: "Method not allowed" });
  }
};

export default airtable;
