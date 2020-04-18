import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Restaurant } from '../restaurant/restaurant.model';
import { STUB_RESTAURANTS } from './restaurant';
import { Review } from '../review/review.model';
import { Role } from '../user/user.model';
import { RestaurantRequest } from '../restaurant/restaurant.service';

@Injectable()
export class RestaurantServiceStub {
  refresh$: Observable<void>;
  private refreshSource: Subject<void> = new Subject<void>();
  constructor() {
    this.refresh$ = this.refreshSource.asObservable();
  }
  restaurants$: Observable<Restaurant[]> = of(STUB_RESTAURANTS);
  create: (r: RestaurantRequest) => Observable<any> = (r) => of({ id: 'rid' });
  edit: (r: RestaurantRequest, id: string) => Observable<any> = (r, id) =>
    of({ id: 'rid' });
  remove: (r: Restaurant) => Observable<any> = (r) => of({});
  refresh: () => void = () => this.refreshSource.next();
  filterReviewsAwaitingReply: (r: Review[]) => Review[] = (reviews) => {
    return reviews.filter((review) => !review.reply);
  };
  calculateAverageRating: (r: Review[]) => number = (reviews) => {
    let totalStars = 0;
    reviews.forEach((review) => (totalStars += review.rating));
    return reviews.length ? Math.round(totalStars / reviews.length) : 0;
  };
  sort: (r: Restaurant[], ur: Role) => Restaurant[] = (restaurants, role) => {
    if (role === Role.ADMIN) {
      return restaurants.sort((restA, restB) => {
        const numAwaitingReviewsA = restA.reviewsAwaitingReply?.length || 0;
        const numAwaitingReviewsB = restB.reviewsAwaitingReply?.length || 0;
        if (restA.averageRating > restB.averageRating) {
          return -1;
        }
        if (restA.averageRating < restB.averageRating) {
          return 1;
        }
        if (numAwaitingReviewsA > numAwaitingReviewsB) {
          return -1;
        }
        if (numAwaitingReviewsA < numAwaitingReviewsB) {
          return 1;
        }
        return 0;
      });
    }
    if (role === Role.OWNER) {
      return restaurants.sort((restA, restB) => {
        const numAwaitingReviewsA = restA.reviewsAwaitingReply?.length || 0;
        const numAwaitingReviewsB = restB.reviewsAwaitingReply?.length || 0;
        if (numAwaitingReviewsA > numAwaitingReviewsB) {
          return -1;
        }
        if (numAwaitingReviewsA < numAwaitingReviewsB) {
          return 1;
        }
        if (restA.averageRating > restB.averageRating) {
          return -1;
        }
        if (restA.averageRating < restB.averageRating) {
          return 1;
        }
        return 0;
      });
    }
    return restaurants.sort(
      (restA, restB) => restB.averageRating - restA.averageRating
    );
  };
}
