import express from 'express';
import { reviewController } from './controllers/review.controller';

const router = express.Router();

router.get('/api/products/:id/reviews', reviewController.getReviews);

// router.post(
//    '/api/products/:id/reviews/summarize',
//    reviewController.summarizeReviews
// );

router.get('/api/products', reviewController.getProducts);

router.get(
   '/api/products/:id/reviews/summarize-stream',
   reviewController.getStream
);

export default router;
