import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import {
  CreateReviewRequest,
  UpdateReviewRequest,
} from '../review/review.service';
import { Review } from '../review/review.model';
import { REVIEWS } from './review';

@Injectable()
export class ReviewServiceStub {
  refreshRestaurantReviews$: Observable<string>;
  private refreshSource: Subject<string> = new Subject<string>();
  constructor() {
    this.refreshRestaurantReviews$ = this.refreshSource.asObservable();
  }
  create: (review: CreateReviewRequest) => Observable<any> = (r) =>
    of({ id: 'rid' });
  edit: (review: UpdateReviewRequest) => Observable<any> = (r) =>
    of({ id: 'rid' });
  remove: (review: Review) => Observable<any> = (r) => of({});
  getRestaurantReviews: (id: string) => Observable<Review[]> = (i) =>
    of(REVIEWS);
  refreshRestaurantReviews: (id?: string) => void = (i?) =>
    this.refreshSource.next(i);
}
