import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Review } from '../../../review/review.model';
import { Role } from '../../../user/user.model';
import { ReviewService } from '../../../review/review.service';
import { Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SnackService } from '../../../snack/snack.service';

@Component({
  selector: 'reviewer-restaurant-info-dialog-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class RestaurantInfoDialogListItemComponent
  implements OnInit, OnDestroy {
  @Input() review: Review;
  @Input() userRole: Role;
  @Input() restaurantId: string;
  @Input() icon = 'comment';
  adminRole = Role.ADMIN;
  editingComment: string | null;
  editingReply: string | null;
  savingComment: boolean;
  savingReply: boolean;
  deleting: boolean;
  isHandset: boolean;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private reviewService: ReviewService,
    private snackService: SnackService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
        map((result) => result.matches),
        shareReplay(),
        takeUntil(this.destroy$)
      )
      .subscribe((matches) => (this.isHandset = matches));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Admin users can remove comments from Reviews
   */
  removeComment() {
    const deleted = this.review.comment;
    this.review.comment = '';
    this.reviewService
      .edit(this.review, this.review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (success) => {
          // stream refresh event to other components to update specific Restaurant Review api data
          this.reviewService.refreshRestaurantReviews(this.restaurantId);
          this.snackService.showSnack('Review comment removed');
        },
        (error) => {
          this.review.comment = deleted;
          console.error(error);
          this.snackService.showSnack('Error removing review comment');
        }
      );
  }

  /**
   * Admin users can remove replies from Reviews
   */
  removeReply() {
    const deleted = this.review.reply;
    this.review.reply = '';
    this.reviewService
      .edit(this.review, this.review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (success) => {
          // stream refresh event to other components to update specific Restaurant Review api data
          this.reviewService.refreshRestaurantReviews(this.restaurantId);
          this.snackService.showSnack('Review reply removed');
        },
        (error) => {
          this.review.reply = deleted;
          console.error(error);
          this.snackService.showSnack('Error removing review reply');
        }
      );
  }

  /**
   * Admin users can edit comments on Reviews
   */
  editSaveComment() {
    if (this.editingComment || this.editingComment === '') {
      this.savingComment = true;
      this.reviewService
        .edit(this.review, this.review.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (success) => {
            this.editingComment = null;
            this.savingComment = false;
            // stream refresh event to other components to update specific Restaurant Review api data
            this.reviewService.refreshRestaurantReviews(this.restaurantId);
            this.snackService.showSnack('Review comment updated');
          },
          (error) => {
            this.review.comment = this.editingComment as string;
            this.editingComment = null;
            this.savingComment = false;
            console.error(error);
            this.snackService.showSnack('Error updating review comment');
          }
        );
    } else {
      this.editingComment = this.review.comment || '';
    }
  }

  /**
   * Admin and Owner users can add replies to Reviews
   * Admin users can edit replies on Reviews
   */
  editSaveReply() {
    if (this.editingReply || this.editingReply === '') {
      this.savingReply = true;
      this.reviewService
        .edit(this.review, this.review.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (success) => {
            this.editingReply = null;
            this.savingReply = false;
            // stream refresh event to other components to update specific Restaurant Review api data
            this.reviewService.refreshRestaurantReviews(this.restaurantId);
            this.snackService.showSnack('Review reply updated');
          },
          (error) => {
            this.review.reply = this.editingReply as string;
            this.editingReply = null;
            this.savingReply = false;
            console.error(error);
            this.snackService.showSnack('Error updating review reply');
          }
        );
    } else {
      this.editingReply = this.review.reply || '';
    }
  }

  /**
   * Admin users can delete Reviews
   */
  deleteReview() {
    this.deleting = true;
    this.reviewService
      .remove(this.review)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (success) => {
          // stream refresh event to other components to update specific Restaurant Review api data
          this.reviewService.refreshRestaurantReviews(this.restaurantId);
          this.snackService.showSnack('Review deleted');
        },
        (error) => {
          this.deleting = false;
          console.error(error);
          this.snackService.showSnack('Error deleting review');
        }
      );
  }
}
