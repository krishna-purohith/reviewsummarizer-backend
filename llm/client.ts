import OpenAI from 'openai';

const openAIClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   temperature?: number;
   maxTokens?: number;
};

export const llmClient = {
   async *callLLM({
      model = 'gpt-40-mini',
      prompt,
      temperature = 0.2,
      maxTokens = 300,
   }: GenerateTextOptions): AsyncGenerator<string> {
      const stream = await openAIClient.chat.completions.create({
         model,
         stream: true,
         messages: [
            {
               role: 'system',
               content:
                  'Summarize all the below reviews of the product into a short paragraph highlighting key themes, both positive and negative.',
            },
            { role: 'user', content: prompt },
         ],
         temperature,
         max_completion_tokens: maxTokens,
      });
      for await (const chunk of stream) {
         const content = chunk.choices?.[0]?.delta?.content;
         if (content) {
            yield content;
         }
      }
   },
};
