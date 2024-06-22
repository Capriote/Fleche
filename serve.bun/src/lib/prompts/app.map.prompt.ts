import { ChatPromptTemplate } from '@langchain/core/prompts';

export const prompt = ChatPromptTemplate.fromTemplate(
  `You are given a context of a codebase

  {codeContext}

  Create a json based flow tree with flat array structure.
  Each element in the array should have these properties:
    - id: string
    - children: string[] - id of the imported modules in this file
    - description: string - short description of what the file does

  Only response with the json.
  `,
);
