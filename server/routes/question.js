import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
  let collection = await db.collection("questions");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

router.get("/:id", async (req, res) => {
  let collection = await db.collection("questions");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

router.post("/", async (req, res) => {
  try {
    let newDocument = {
      category: req.body.category,
      question_text: req.body.question_text,
      options: req.body.options,
    };
    if (!Array.isArray(newDocument.options) || newDocument.options.some(option => !option.text || option.score === undefined)) {
      return res.status(400).send("Invalid options format. Each option must have 'text' and 'score' fields.");
    }
    let collection = await db.collection("questions");
    let result = await collection.insertOne(newDocument);
    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        category: req.body.category,
        question_text: req.body.question_text,
        options: req.body.options,
      },
    };
    if (req.body.options && (!Array.isArray(req.body.options) || req.body.options.some(option => !option.text || option.score === undefined))) {
      return res.status(400).send("Invalid options format. Each option must have 'text' and 'score' fields.");
    }
    let collection = await db.collection("questions");
    let result = await collection.updateOne(query, updates);
    if (result.matchedCount === 0) {
      return res.status(404).send("No question found with the given ID.");
    }
    res.status(200).send("Question updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("questions");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
