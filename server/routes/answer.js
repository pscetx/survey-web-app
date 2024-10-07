import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all answers
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("answers");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (err) {
    console.error("Error fetching answers:", err);
    res.status(500).send("Error fetching answers");
  }
});

// GET answer by ID
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("answers");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(result);
    }
  } catch (err) {
    console.error("Error fetching answer by ID:", err);
    res.status(500).send("Error fetching answer");
  }
});

// POST new answer
router.post("/", async (req, res) => {
  try {
    console.log("Received Payload:", req.body); // Log the incoming payload

    // Validate incoming data
    let newDocument = {
      respondent_id: req.body.respondent_id,
      questions: req.body.questions,
    };

    if (
      !Array.isArray(newDocument.questions) ||
      newDocument.questions.some(
        (question) => !question._id || question.score === undefined
      )
    ) {
      return res.status(400).send("Invalid options format. Each option must have '_id' and 'score' fields.");
    }

    let collection = await db.collection("answers");
    let result = await collection.insertOne(newDocument);

    // Log the saved document
    const savedDocument = await collection.findOne({ _id: result.insertedId });
    console.log("Saved Document:", savedDocument); // Log the saved document to verify the scores

    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    console.error("Error adding record:", err);
    res.status(500).send("Error adding record");
  }
});

// PATCH update answer by ID
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        respondent_id: req.body.respondent_id,
        questions: req.body.questions,
      },
    };

    if (
      req.body.questions &&
      (!Array.isArray(req.body.questions) ||
        req.body.questions.some(
          (question) => !question._id || question.score === undefined
        ))
    ) {
      return res.status(400).send("Invalid options format. Each option must have '_id' and 'score' fields.");
    }

    let collection = await db.collection("answers");
    let result = await collection.updateOne(query, updates);

    if (result.matchedCount === 0) {
      return res.status(404).send("No question found with the given ID.");
    }

    res.status(200).send("Question updated successfully");
  } catch (err) {
    console.error("Error updating record:", err);
    res.status(500).send("Error updating record");
  }
});

// DELETE answer by ID
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("answers");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).send("No record found to delete.");
    }

    res.status(200).send("Record deleted successfully");
  } catch (err) {
    console.error("Error deleting record:", err);
    res.status(500).send("Error deleting record");
  }
});

export default router;
