import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import express from "express";
import cors from "cors";
import { FaissStore } from "@langchain/community/vectorstores/faiss";

const model = new AzureChatOpenAI({ temperature: 1 });
const app = express();

const embeddings = new AzureOpenAIEmbeddings({
  temperature: 0,
  azureOpenAIApiEmbeddingsDeploymentName:
    process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME,
});

const vectorStore = await FaissStore.load(
  "../reader/vectordatabase",
  embeddings
);
const relevantDocs = await vectorStore.similaritySearch(
  "Find a tip about efficient reading",
  3
);
const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

const system = [
  "system",
  `You are a librarian. A reader is about to give you a description of a book they would like to read. 
    Tell them the title of 5 books that might match their description. Please also mention the authors, a small description of the book of ~300 words and goodreads page of per book. Please format the books as HTML so use <\br> instead of new lines.
    The reader might ask you some follow up questions on any of the books to make sure it really matches what they want to read.`,
];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const result = await tellJoke("Tell me a Javascript joke!");
  res.json({ message: result });
});

app.post("/", async (req, res) => {
  let prompt = req.body.prompt;
  let question = `${prompt}. After giving telling the reader the 5 books, please also give a tip for effective reading, using the following context: ${context}. The tip needs to have the following format: <b> TIP: [put the tip here] </b>`;
  const answer = await model.stream([system, question]);

  res.setHeader("Content-Type", "application/json");
  for await (const chunk of answer) {
    console.log(chunk);
    res.write(chunk.content);
  }

  res.end();
});

async function tellJoke(prompt) {
  const joke = await model.invoke(prompt);
  return joke.content;
}

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
