import express from "express";

// This will help us connect to the database
import db from "../db/connection.js";

// This help convert the id from string to ObjectId for the _id.
import { ObjectId } from "mongodb";

// router is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const router = express.Router();

// This section will help you get a list of all the records.
router.get("/", async (req, res) => {
  let collection = await db.collection("respondents");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/email/:email", async (req, res) => {
  let collection = await db.collection("respondents");
  let query = { respondent_email: req.params.email };
  let results = await collection.find(query).toArray();

  if (results.length === 0) {
    res.status(404).send("No records found for this email");
  } else {
    res.status(200).json(results);
  }
});

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("respondents");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  try {
    let newDocument = {
      respondent_email: req.body.respondent_email,
      respondent_name: req.body.respondent_name,
      respondent_role: req.body.respondent_role,
      org_name: req.body.org_name,
      field: req.body.field,
      staff_size: req.body.staff_size,
      date: req.body.date,
    };
    let collection = await db.collection("respondents");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding respondent");
  }
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        respondent_email: req.body.respondent_email,
        respondent_name: req.body.respondent_name,
        respondent_role: req.body.respondent_role,
        org_name: req.body.org_name,
        field: req.body.field,
        staff_size: req.body.staff_size,
        date: req.body.date,
      },
    };

    let collection = await db.collection("respondents");
    let result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating respondent");
  }
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("respondents");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting respondent");
  }
});

export default router;
