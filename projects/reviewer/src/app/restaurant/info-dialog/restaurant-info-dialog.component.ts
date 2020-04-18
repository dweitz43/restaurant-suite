import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '../../user/user.model';
import { Restaurant } from '../restaurant.model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Review } from '../../review/review.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'reviewer-restaurant-info-dialog',
  templateUrl: './restaurant-info-dialog.component.html',
  styleUrls: ['./restaurant-info-dialog.component.scss'],
})
export class RestaurantInfoDialogComponent implements OnInit, OnDestroy {
  user: User;
  restaurant: Restaurant;
  highestRated: Review;
  lowestRated: Review;
  recentReviews: Review[] = [];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { user: User; restaurant: Restaurant },
    private dialog: MatDialog
  ) {}

  /**
   * initialize dialog data and sort Reviews
   */
  ngOnInit(): void {
    this.user = this.data.user;
    this.restaurant = this.data.restaurant;
    this.sortReviews();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close() {
    this.dialog.closeAll();
  }

  /**
   * sort Reviews by most recent date of visit
   * extract highest rated and lowest rated review from list
   */
  private sortReviews() {
    this.recentReviews = this.restaurant.reviews;
    if (this.recentReviews.length === 1) {
      this.highestRated = this.recentReviews[0];
      this.lowestRated = this.recentReviews[0];
    } else {
      this.recentReviews.sort((reviewA, reviewB) => {
        if (!this.highestRated || reviewA.rating > this.highestRated.rating) {
          this.highestRated = reviewA;
        }
        if (!this.highestRated || reviewB.rating > this.highestRated.rating) {
          this.highestRated = reviewB;
        }
        if (!this.lowestRated || reviewA.rating < this.lowestRated.rating) {
          this.lowestRated = reviewA;
        }
        if (!this.lowestRated || reviewB.rating < this.lowestRated.rating) {
          this.lowestRated = reviewB;
        }
        return reviewB.date - reviewA.date;
      });
    }
  }
}
