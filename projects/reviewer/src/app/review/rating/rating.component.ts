import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ReviewService } from '../review.service';
import { Review } from '../review.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Role } from '../../user/user.model';
import { SnackService } from '../../snack/snack.service';

@Component({
  selector: 'reviewer-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnDestroy {
  @Input() rating: number;
  @Input() color: ThemePalette;
  @Input() editable: boolean;
  @Input() review: Review;
  @Input() restaurantId: string;
  @Input() role: Role;
  @Output() starClick: EventEmitter<number> = new EventEmitter<number>();
  adminRole = Role.ADMIN;
  editingRating: number;
  savingRating: boolean;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private reviewService: ReviewService,
    private snackService: SnackService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * emit Star rating selection value
   */
  selectRating(value: number) {
    if (this.editingRating >= 0) {
      this.rating = value;
      if (this.review) {
        this.review.rating = this.rating;
      }
    }
    this.starClick.emit(value);
  }

  /**
   * Admin users can edit Review ratings
   */
  editSaveRating() {
    if (this.editingRating >= 0) {
      this.savingRating = true;
      this.reviewService
        .edit(this.review, this.review.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (success) => {
            this.editingRating = -1;
            this.savingRating = false;
            // stream refresh events to subscribed components to update specific Restaurant Review api data
            this.reviewService.refreshRestaurantReviews(this.restaurantId);
            this.snackService.showSnack('Review rating updated');
          },
          (error) => {
            this.review.rating = this.editingRating;
            this.editingRating = -1;
            this.savingRating = false;
            console.error(error);
            this.snackService.showSnack('Error updating review rating');
          }
        );
    } else {
      this.editingRating = this.review.rating || 0;
    }
  }

  /**
   * Admin users can delete Review ratings
   */
  removeRating() {
    const deleted = this.review.rating;
    this.review.rating = 0;
    this.reviewService
      .edit(this.review, this.review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (success) => {
          // stream refresh events to subscribed components to update specific Restaurant Review api data
          this.reviewService.refreshRestaurantReviews(this.restaurantId);
          this.snackService.showSnack('Review rating removed');
        },
        (error) => {
          this.review.rating = deleted;
          this.snackService.showSnack('Error removing review rating');
        }
      );
  }
}
