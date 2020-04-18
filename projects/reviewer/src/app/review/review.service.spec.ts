import { ReviewService } from './review.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { REVIEWS } from '../mock/review';
import { Review } from './review.model';

describe('ReviewService', () => {
  let reviewService: ReviewService;
  let httpClientMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    reviewService = TestBed.inject(ReviewService);
    httpClientMock = TestBed.inject(HttpTestingController);
  });

  it('should get list of reviews by restaurant id and use caching to avoid unnecessary requests', async () => {
    reviewService.getRestaurantReviews('id').subscribe((reviews) => {
      expect(reviews.length).toBe(5);
      expect(reviews[0].id).toBe('id');
      expect(reviews[0].uid).toBe('uid');
      expect(reviews[0].rid).toBe('rid');
      expect(reviews[0].comment).toBe('comment');
      expect(reviews[0].rating).toBe(2);
      reviewService
        .getRestaurantReviews('id')
        .subscribe((cached) => expect(cached).toEqual(reviews));
    });
    const req = httpClientMock.expectOne(
      `${environment.base}/reviews?restaurant=id`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ reviews: REVIEWS });
  });

  it('should create a new review', async () => {
    reviewService
      .create({
        reviewUserId: 'uid',
        rid: 'rid',
        rating: 2,
        date: 1,
        comment: 'comment',
      })
      .subscribe((success: { id: string }) => {
        expect(success).toBeTruthy();
        expect(success.id).toBe('id');
      });
    const req = httpClientMock.expectOne(`${environment.base}/reviews`);
    expect(req.request.method).toBe('POST');
    req.flush({ id: 'id' });
  });

  it('should edit a review', async () => {
    reviewService
      .edit({ reply: 'reply' }, 'id')
      .subscribe((updated: Review) => {
        expect(updated.rating).toBe(2);
        expect(updated.uid).toBe('uid');
        expect(updated.rid).toBe('rid');
        expect(updated.comment).toBe('comment');
        expect(updated.reply).toBe('reply');
      });
    const req = httpClientMock.expectOne(`${environment.base}/reviews/id`);
    expect(req.request.method).toBe('PATCH');
    req.flush({
      rating: 2,
      uid: 'uid',
      rid: 'rid',
      comment: 'comment',
      reply: 'reply',
    });
  });

  it('should delete a review', async () => {
    reviewService
      .remove(REVIEWS[0])
      .subscribe((success) => expect(success).toBeTruthy());
    const req = httpClientMock.expectOne(`${environment.base}/reviews/id`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
