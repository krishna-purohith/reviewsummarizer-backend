import { PrismaClient, type Product, type Review } from '../generated/prisma';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      return prisma.review.findMany({
         where: { productId },
         take: limit,
         orderBy: { createdAt: 'desc' },
      });
   },

   async storeSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate();
      const data = {
         content: summary,
         ExpiresAt: expiresAt,
         generatedAt: now,
         productId,
      };

      await prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },

   async getSummary(productId: number): Promise<string | null> {
      const summary = await prisma.summary.findFirst({
         where: {
            AND: [{ productId }, { ExpiresAt: { gt: new Date() } }],
         },
      });
      return summary ? summary.content : null;
   },

   async getProducts(): Promise<Product[]> {
      return prisma.product.findMany();
   },
};
