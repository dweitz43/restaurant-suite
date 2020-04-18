import { Review } from '../review/review.model';

export class Restaurant {
  id: string;
  ownerId: string;
  name: string;
  reviews: Review[];
  averageRating: number;
  reviewsAwaitingReply: Review[];
}
