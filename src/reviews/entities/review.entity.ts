import { User } from '@prisma/client';
import { Product } from '../../products/entities/product.entity';

export class Review {
  id: number;
  reviewer: User;
  ratedProduct: Product;
  rating: number;
  comments: string;
  createdAt: Date;
  updatedAt: Date;
}
