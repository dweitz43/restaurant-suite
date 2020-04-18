import { RestaurantService } from './restaurant.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Restaurant } from './restaurant.model';
import { Role } from '../user/user.model';
import { RESTAURANTS } from '../mock/restaurant';
import { REVIEWS } from '../mock/review';

describe('RestaurantService', () => {
  let restaurantService: RestaurantService;
  let httpClientMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    restaurantService = TestBed.inject(RestaurantService);
    httpClientMock = TestBed.inject(HttpTestingController);
  });

  it('should get list of restaurants and use caching to avoid unnecessary requests', async () => {
    restaurantService.restaurants$.subscribe((restaurants) => {
      expect(restaurants.length).toBe(1);
      expect(restaurants[0].name).toBe('restaurant');
      expect(restaurants[0].id).toBe('id');
      expect(restaurants[0].ownerId).toBe('ownerId');
      restaurantService.restaurants$.subscribe((cached) =>
        expect(cached).toEqual(restaurants)
      );
    });
    const req = httpClientMock.expectOne(`${environment.base}/restaurants`);
    expect(req.request.method).toBe('GET');
    req.flush({
      restaurants: [{ name: 'restaurant', id: 'id', ownerId: 'ownerId' }],
    });
  });

  it('should get restaurant by id and use caching to avoid unnecessary requests', async () => {
    restaurantService.getRestaurant('id').subscribe((restaurant) => {
      expect(restaurant.name).toBe('restaurant');
      expect(restaurant.id).toBe('id');
      expect(restaurant.ownerId).toBe('ownerId');
      restaurantService
        .getRestaurant('id')
        .subscribe((cached) => expect(cached).toEqual(restaurant));
    });
    const req = httpClientMock.expectOne(`${environment.base}/restaurants/id`);
    expect(req.request.method).toBe('GET');
    req.flush({
      restaurant: { name: 'restaurant', id: 'id', ownerId: 'ownerId' },
    });
  });

  it('should create a new restaurant', async () => {
    restaurantService
      .create({ name: 'restaurant', ownerId: 'ownerId' })
      .subscribe((success: { id: string }) => {
        expect(success).toBeTruthy();
        expect(success.id).toBe('id');
      });
    const req = httpClientMock.expectOne(`${environment.base}/restaurants`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'id' });
  });

  it('should edit a restaurant', async () => {
    restaurantService
      .edit({ name: 'restaurant', ownerId: 'ownerId' }, 'id')
      .subscribe((updated: Restaurant) => {
        expect(updated).toBeTruthy();
        expect(updated.name).toBe('restaurant');
        expect(updated.ownerId).toBe('ownerId');
        expect(updated.id).toBe('id');
      });
    const req = httpClientMock.expectOne(`${environment.base}/restaurants/id`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ name: 'restaurant', ownerId: 'ownerId', id: 'id' });
  });

  it('should delete a restaurant', async () => {
    restaurantService
      .remove({
        name: 'restaurant',
        id: 'id',
        ownerId: 'ownerId',
        averageRating: 0,
        reviews: [],
        reviewsAwaitingReply: [],
      })
      .subscribe((success) => expect(success).toBeTruthy());
    const req = httpClientMock.expectOne(`${environment.base}/restaurants/id`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should filter out list of reviews that have already been replied to', async () => {
    const filtered = restaurantService.filterReviewsAwaitingReply([
      {
        id: 'id',
        uid: 'uid',
        rid: 'rid',
        rating: 0,
        date: 0,
        comment: 'comment',
      },
      {
        id: 'id2',
        uid: 'uid2',
        rid: 'rid2',
        rating: 2,
        date: 0,
        comment: 'another comment',
        reply: 'reply',
      },
    ]);
    expect(filtered.length).toBe(1);
  });

  it('should calculate average rating from list of reviews', async () => {
    const averageRating = restaurantService.calculateAverageRating(REVIEWS);
    expect(averageRating).toBe(3);
  });

  it('should sort restaurants by number of reviews awaiting reply then average rating for owner role', async () => {
    const sorted = restaurantService.sort(RESTAURANTS, Role.OWNER);
    expect(sorted[0].reviewsAwaitingReply.length).toBe(2);
    expect(sorted[1].averageRating).toBe(3);
    expect(sorted[2].reviewsAwaitingReply.length).toBe(1);
  });

  it('should sort restaurants by average rating then number of reviews awaiting reply for admin role', async () => {
    const sorted = restaurantService.sort(RESTAURANTS, Role.ADMIN);
    expect(sorted[0].averageRating).toBe(3);
    expect(sorted[1].averageRating).toBe(2);
    expect(sorted[2].reviewsAwaitingReply.length).toBe(2);
  });

  it('should sort restaurants by average rating for regular role', async () => {
    const sorted = restaurantService.sort(RESTAURANTS, Role.REGULAR);
    expect(sorted[0].averageRating).toBe(3);
    expect(sorted[1].averageRating).toBe(2);
    expect(sorted[2].averageRating).toBe(1);
  });
});
