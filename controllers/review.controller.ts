import type { Request, Response } from 'express';
import { productRepository } from '../repositories/product.repository';
import { reviewService } from '../services/review.service';
import { reviewRepository } from '../repositories/review.repository';

export const reviewController = {
   async getStream(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product Id.' });
         return;
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(400).json({ error: 'Enter a valid product Id.' });
         return;
      }

      const productReviews = await reviewRepository.getReviews(productId, 1);

      if (!productReviews.length) {
         res.status(400).json({
            message: "The product doesn't have any reviews yet!!",
         });
         return;
      }

      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.(); // remove it if its not needed here.

      try {
         for await (const chunk of reviewService.summarizeReviewsStream(
            productId
         )) {
            res.write(chunk);
         }
      } catch (error) {
         console.error('Streaming error', error);
         res.write('\n[Error streaming summary]');
      } finally {
         res.end();
      }
   },

   async getProducts(req: Request, res: Response) {
      const products = await reviewRepository.getProducts();
      res.json({ products });
   },
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);

      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid Product ID.' });
         return;
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(400).json({ error: 'Product doesnot exist.' });
         return;
      }

      const reviews = await reviewRepository.getReviews(productId);
      const summary = await reviewRepository.getSummary(productId);

      res.json({ reviews, summary });
   },

   // async summarizeReviews(req: Request, res: Response) {
   //    const productId = Number(req.params.id);

   //    if (isNaN(productId)) {
   //       res.status(400).json({ error: 'Invalid product Id.' });
   //       return;
   //    }

   //    const product = await productRepository.getProduct(productId);
   //    if (!product) {
   //       res.status(400).json({ error: 'Enter a valid product Id.' });
   //       return;
   //    }

   //    const productReviews = await reviewRepository.getReviews(productId, 1);

   //    if (!productReviews.length) {
   //       res.status(400).json({
   //          message: "The product doesn't have any reviews yet!!",
   //       });
   //       return;
   //    }

   //    const summary = await reviewService.summarizeReviews(productId);

   //    res.json({ summary });
   // },
};
