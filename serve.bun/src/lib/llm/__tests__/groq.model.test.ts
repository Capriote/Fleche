import { describe, expect, it } from 'bun:test';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

import { Logger } from '@app/lib/logger';

import { groqModel } from '../groq.llm';

describe('groq model', () => {
  it('should translate Italian', async () => {
    const messages = [
      new SystemMessage('Translate the following from English into Italian'),
      new HumanMessage('hi!'),
    ];

    const parser = new StringOutputParser();
    const result = await groqModel.invoke(messages);
    const content = await parser.invoke(result);

    Logger.info(content);

    expect(content).toBe(
      'Ciao!\n\nThis is a simple and common greeting in Italian, similar to "hi" in English. It can be used in both formal and informal contexts.',
    );
  });
});
