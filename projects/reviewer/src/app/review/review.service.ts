import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Review } from './review.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

export class CreateReviewRequest {
  reviewUserId: string;
  rid: string;
  rating: number;
  date: number;
  comment?: string;
}

export class UpdateReviewRequest {
  reviewUserId?: string;
  rating?: number;
  date?: number;
  comment?: string;
  reply?: string;
  ownerId?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  refreshRestaurantReviews$: Observable<string>;
  private refreshSource: Subject<string> = new Subject<string>();
  private baseUrl = `${environment.base}/reviews`;
  private cache: { [key: string]: Review[] } = {};

  constructor(private httpClient: HttpClient) {
    this.refreshRestaurantReviews$ = this.refreshSource.asObservable();
  }

  /**
   * GET api request to list Reviews for given Restaurant id
   */
  getRestaurantReviews(id: string): Observable<Review[]> {
    return this.cache[id]
      ? of(this.cache[id])
      : this.httpClient
          .get<{ reviews: Review[] }>(`${this.baseUrl}`, {
            params: { restaurant: id },
          })
          .pipe(
            map((result) => {
              this.cache[id] = result.reviews;
              return this.cache[id];
            })
          );
  }

  /**
   * POST api request to create new Review
   */
  create(review: CreateReviewRequest) {
    return this.httpClient.post(this.baseUrl, review);
  }

  /**
   * PATCH api request to edit Review
   */
  edit(review: UpdateReviewRequest, id: string) {
    return this.httpClient.patch(`${this.baseUrl}/${id}`, review);
  }

  /**
   * DELETE api request to remove Review
   */
  remove(review: Review) {
    return this.httpClient.delete(`${this.baseUrl}/${review.id}`);
  }

  /**
   * clear individual Review cache if {id}
   * clear enter Review cache if no {id}
   * stream refresh event to subscribed components
   */
  refreshRestaurantReviews(id?: string) {
    if (id) {
      delete this.cache[id];
    } else {
      this.cache = {};
    }
    this.refreshSource.next(id);
  }
}
