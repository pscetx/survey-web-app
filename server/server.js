import express from "express";
import cors from "cors";
import respondents from "./routes/respondent.js";
import categories from "./routes/category.js";
import questions from "./routes/question.js";
import options from "./routes/option.js";
import answers from "./routes/answer.js";
import results from "./routes/result.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/respondent", respondents);
app.use("/category", categories);
app.use("/question", questions);
app.use("/option", options);
app.use("/answer", answers);
app.use("/result", results);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
