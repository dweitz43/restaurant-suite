import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Restaurant } from '../../restaurant/restaurant.model';
import { User } from '../../user/user.model';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ReviewService } from '../review.service';
import { Review } from '../review.model';
import { takeUntil } from 'rxjs/operators';
import { SnackService } from '../../snack/snack.service';

@Component({
  selector: 'reviewer-reply-dialog',
  templateUrl: './review-reply-dialog.component.html',
  styleUrls: ['./review-reply-dialog.component.scss'],
})
export class ReviewReplyDialogComponent implements OnInit, OnDestroy {
  restaurant: Restaurant;
  user: User;
  sending: { [id: string]: boolean } = {};
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { user: User; restaurant: Restaurant },
    private dialog: MatDialog,
    private reviewService: ReviewService,
    private snackService: SnackService
  ) {}

  /**
   * initialize dialog data
   */
  ngOnInit(): void {
    this.user = this.data.user;
    this.restaurant = this.data.restaurant;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close() {
    this.dialog.closeAll();
  }

  /**
   * Admin and Owner users can reply to Reviews
   */
  send(reply: string, review: Review) {
    this.sending[review.id] = true;
    this.reviewService
      .edit({ ownerId: this.restaurant.ownerId, reply }, review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (success) => {
          // stream refresh event to subscribed components to update specific Restaurant Review api data
          this.reviewService.refreshRestaurantReviews(this.restaurant.id);
          this.snackService.showSnack('Reply sent');
        },
        (error) => {
          this.sending[review.id] = false;
          console.error(error);
          this.snackService.showSnack('Error sending reply');
        }
      );
  }
}
