-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_ratedProductId_fkey";

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_ratedProductId_fkey" FOREIGN KEY ("ratedProductId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
