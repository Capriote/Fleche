import path from 'path';
import fs from 'fs/promises';
import { describe, it } from 'bun:test';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { Logger } from '@app/lib/logger';
import { groqModel } from '@app/lib/llm';

import { prompt } from '../app.map.prompt';

describe('Lib::Prompts::App map prompts', () => {
  async function composeCodeContext(
    basePath: string,
    children: string[],
    context: string[] = [],
  ) {
    for await (const child of children) {
      const stat = await fs.stat(path.resolve(basePath, child));
      if (stat.isDirectory()) {
        const c1 = await fs.readdir(path.resolve(basePath, child));
        await composeCodeContext(path.resolve(basePath, child), c1, context);
      } else if (stat.isFile()) {
        const content = await fs.readFile(
          path.resolve(basePath, child),
          'utf-8',
        );
        context.push(
          `
          \`\`\`${basePath}/${child}
          ${content}
          \`\`\`
        `,
        );
      }
    }

    return context;
  }

  it('tests Groq model', async () => {
    const target = path.resolve('templates/express');
    const files = await fs.readdir(target);
    const codeContext = await composeCodeContext(target, files);
    const codeContextStr = codeContext.join('\n');
    const parser = new StringOutputParser();
    const result = await prompt.pipe(groqModel).pipe(parser).invoke({
      codeContext: codeContextStr,
    });

    Logger.debug(result);
  });
});
