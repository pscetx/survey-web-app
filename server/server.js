import express from "express";
import cors from "cors";
import respondents from "./routes/respondent.js";
import questions from "./routes/question.js";
import answers from "./routes/answer.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/respondent", respondents);
app.use("/question", questions);
app.use("/answer", answers);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
