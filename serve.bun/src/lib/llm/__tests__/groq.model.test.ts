import { describe, expect, it } from "bun:test";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { groqModel } from "../groq.llm";

describe("groq model", () => {
  it("should translate Italian", async () => {
    const messages = [
      new SystemMessage("Translate the following from English into Italian"),
      new HumanMessage("hi!"),
    ];

    const result = await groqModel.invoke(messages);
    expect(result.content).toBe(
      'Ciao!\n\nThis is a simple and common greeting in Italian, similar to "hi" in English. It can be used in both formal and informal contexts.'
    );
  });
});
