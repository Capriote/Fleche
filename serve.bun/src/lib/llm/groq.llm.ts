import { ChatGroq } from "@langchain/groq";
import { Env } from "../env";

export const groqModel = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0,
  apiKey: Env.getOptional("GROQ_API_KEY"),
});
