import { table, getMinifiedItem } from "../../utils/Airtable";

const airtable =  async (_req, res) => {
    const data = _req.body;

    try {
      const newRecords = await table.create([{ fields: {
        Name: data.name,
        Email: data.email,
        Terms: data.agreeTerms,
        Showcase: data.agreeShowcase
      } }]);
      res.status(200).json(getMinifiedItem(newRecords[0]));
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Something went wrong! 😕" });
    }
};

export default airtable;
