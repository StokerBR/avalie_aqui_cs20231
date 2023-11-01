-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "reviewerId" INTEGER NOT NULL,
    "ratedProductId" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comments" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_ratedProductId_fkey" FOREIGN KEY ("ratedProductId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
