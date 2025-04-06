import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid respondent ID");
    }

    const collection = await db.collection("answers");
    const query = { respondent_id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) {
      return res.status(404).send("Not found");
    } 
    res.status(200).send(result);
  } catch (err) {
    console.error("Error fetching answer by ID:", err);
    res.status(500).send("Error fetching answer");
  }
});

router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("answers");
    const answers = await collection.find({}).toArray();
    res.status(200).send(answers);
  } catch (err) {
    console.error("Error fetching all answers:", err);
    res.status(500).send("Error fetching all answers");
  }
});

router.post("/", async (req, res) => {
  try {
    console.log("Received Payload:", req.body);
    let newDocument = {
      respondent_id: new ObjectId(req.body.respondent_id),
      questions: req.body.questions,
      is_finished: false,
      is_banned: false,
    };

    if (
      !Array.isArray(newDocument.questions) ||
      newDocument.questions.some(
        (question) => !question._id || question.score === undefined
      )
    ) {
      return res.status(400).send("Invalid options format. Each option must have '_id' and 'score' fields.");
    }

    const collection = await db.collection("answers");
    const result = await collection.insertOne(newDocument);

    const savedDocument = await collection.findOne({ _id: result.insertedId });
    console.log("Saved Document:", savedDocument);

    res.status(201).send({ insertedId: result.insertedId });
  } catch (err) {
    console.error("Error adding answer:", err);
    res.status(500).send("Error adding answer");
  }
});

router.patch("/updateScore", async (req, res) => {
  try {
    const { respondent_id, question_id, new_score } = req.body;

    if (!ObjectId.isValid(respondent_id) || !ObjectId.isValid(question_id)) {
      return res.status(400).send("Invalid ID(s)");
    }

    const collection = await db.collection("answers");
    const { modifiedCount } = await collection.updateOne(
      {
        respondent_id: new ObjectId(respondent_id),
        "questions._id": question_id,
      },
      { $set: { "questions.$.score": new_score } }
    );

    if (modifiedCount === 0) {
      return res.status(404).send("No changes made or question not found.");
    }

    res.status(200).send("Score updated successfully");
  } catch (err) {
    console.error("Error updating answer:", err);
    res.status(500).send("Error updating answer");
  }
});

router.patch("/finished/:id", async (req, res) => {
  try {
    const query = { respondent_id: new ObjectId(req.params.id) };
    const update = {
      $set: { is_finished: true },
    };
    let collection = await db.collection("answers");
    let result = await collection.updateOne(query, update);

    if (result.matchedCount === 0) {
      return res.status(404).send("No answer found with the given ID.");
    }
    res.status(200).send({ message: "Answer updated successfully", updatedDocument });
  } catch (err) {
    console.error("Error updating answer:", err);
    res.status(500).send("Error updating answer");
  }
});

router.patch("/banned/:id", async (req, res) => {
  try {
    const query = { respondent_id: new ObjectId(req.params.id) };
    const collection = await db.collection("answers");

    const existingDocument = await collection.findOne(query);
    if (!existingDocument) {
      return res.status(404).send("No answer found with the given ID.");
    }

    const update = {
      $set: { is_banned: !existingDocument.is_banned },
    };

    const result = await collection.updateOne(query, update);

    if (result.matchedCount === 0) {
      return res.status(404).send("No answer found with the given ID.");
    }

    res.status(200).send({
      message: "Banned state toggled successfully",
      newBannedState: !existingDocument.is_banned,
    });
  } catch (err) {
    console.error("Error updating answer:", err);
    res.status(500).send("Error updating answer");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const query = { respondent_id: new ObjectId(req.params.id) };

    const collection = db.collection("answers");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting answer");
  }
});

router.get("/count/finished", async (req, res) => {
  try {
    const collection = await db.collection("answers");
    const finishedSurveys = await collection.countDocuments({ is_finished: true });
    res.status(200).send({ finishedSurveys });
  } catch (err) {
    console.error("Error counting finished surveys:", err);
    res.status(500).send("Error counting finished surveys");
  }
});

router.get("/count/banned", async (req, res) => {
  try {
    const collection = await db.collection("answers");
    const bannedSurveys = await collection.countDocuments({ is_banned: true });
    res.status(200).send({ bannedSurveys });
  } catch (err) {
    console.error("Error counting banned surveys:", err);
    res.status(500).send("Error counting banned surveys");
  }
});

export default router;
