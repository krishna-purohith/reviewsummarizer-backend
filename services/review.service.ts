import { llmClient } from '../llm/client';
import template from '../llm/prompts/summarize-reviews.txt';
import { reviewRepository } from '../repositories/review.repository';

export const reviewService = {
   async *summarizeReviewsStream(productId: number): AsyncGenerator<string> {
      const reviews = await reviewRepository.getReviews(productId, 10);

      const combinedReviews = reviews.map((r) => r.content).join('\n\n');

      const prompt = template.replace('{{reviews}}', combinedReviews);

      yield* llmClient.callLLM({
         model: 'gpt-4o-mini',
         prompt,
         temperature: 0.2,
         maxTokens: 300,
      });
   },
};
