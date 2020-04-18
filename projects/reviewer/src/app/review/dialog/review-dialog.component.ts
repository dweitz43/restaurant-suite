import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Restaurant } from '../../restaurant/restaurant.model';
import { User } from '../../user/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ReviewService } from '../review.service';
import { takeUntil } from 'rxjs/operators';
import { SnackService } from '../../snack/snack.service';

@Component({
  selector: 'reviewer-review',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss'],
})
export class ReviewDialogComponent implements OnInit, OnDestroy {
  restaurant: Restaurant;
  user: User;
  form: FormGroup = new FormGroup({
    rating: new FormControl(0, Validators.required),
    comment: new FormControl(''),
  });
  submitting: boolean;
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
   * Admin and Regular users can create new Reviews with a Star rating value and/or a comment
   */
  submit() {
    this.submitting = true;
    const { rating, comment } = this.form.value;
    const now = new Date();
    this.reviewService
      .create({
        reviewUserId: this.user.uid,
        rid: this.restaurant.id,
        date: now.getTime(),
        rating,
        comment,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (success) => {
          // stream refresh event to other components to update specific Restaurant Review api data
          this.reviewService.refreshRestaurantReviews(this.restaurant.id);
          this.snackService.showSnack('Review created');
          this.dialog.closeAll();
        },
        (error) => {
          this.submitting = false;
          console.error(error);
          this.snackService.showSnack('Error creating review');
        }
      );
  }
}
