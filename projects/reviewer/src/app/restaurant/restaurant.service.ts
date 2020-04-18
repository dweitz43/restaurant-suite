import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Restaurant } from './restaurant.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Review } from '../review/review.model';
import { Role } from '../user/user.model';

export class RestaurantRequest {
  name: string;
  ownerId: string;
}

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  refresh$: Observable<void>;
  private refreshSource: Subject<void> = new Subject<void>();
  private baseUrl = `${environment.base}/restaurants`;
  private cache: { [key: string]: Restaurant | Restaurant[] } = {};

  constructor(private httpClient: HttpClient) {
    this.refresh$ = this.refreshSource.asObservable();
  }

  /**
   * GET api request to list all restaurants
   */
  get restaurants$(): Observable<Restaurant[]> {
    return this.cache.restaurants
      ? of(this.cache.restaurants as Restaurant[])
      : this.httpClient.get<{ restaurants: Restaurant[] }>(this.baseUrl).pipe(
          map((result) => {
            this.cache.restaurants = result.restaurants;
            return this.cache.restaurants as Restaurant[];
          })
        );
  }

  /**
   * GET api request to list individual restaurant data
   */
  getRestaurant(id: string): Observable<Restaurant> {
    return this.cache[id]
      ? of(this.cache[id] as Restaurant)
      : this.httpClient
          .get<{ restaurant: Restaurant }>(`${this.baseUrl}/${id}`)
          .pipe(
            map((result) => {
              this.cache[id] = result.restaurant;
              return this.cache[id] as Restaurant;
            })
          );
  }

  /**
   * POST api request to create restaurant
   */
  create(restaurant: RestaurantRequest) {
    return this.httpClient.post(this.baseUrl, restaurant);
  }

  /**
   * PATCH api request to edit restaurant
   */
  edit(restaurant: RestaurantRequest, id: string) {
    return this.httpClient.patch(`${this.baseUrl}/${id}`, restaurant);
  }

  /**
   * DELETE api request to remove restaurant
   */
  remove(restaurant: Restaurant) {
    return this.httpClient.delete(`${this.baseUrl}/${restaurant.id}`);
  }

  /**
   * clear frontend restaurant cache
   */
  refresh() {
    this.cache = {};
    this.refreshSource.next();
  }

  /**
   * Return given list of Reviews filtered to only include Reviews that are awaiting reply
   */
  filterReviewsAwaitingReply(reviews: Review[]): Review[] {
    return reviews.filter((review) => !review.reply);
  }

  /**
   * Calculate average Star rating from given list of Reviews
   */
  calculateAverageRating(reviews: Review[]): number {
    let totalStars = 0;
    reviews.forEach((review) => (totalStars += review.rating));
    return reviews.length ? Math.round(totalStars / reviews.length) : 0;
  }

  /**
   * Sort given list of Restaurants based on user Role
   * - admin: sort Restaurants by average rating then by number of reviews awaiting reply
   * - owner: sort Restaurants by number of reviews awaiting reply then by average rating
   * - regular: sort Restaurants by average rating
   */
  sort(restaurants: Restaurant[], role: Role): Restaurant[] {
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
  }
}
