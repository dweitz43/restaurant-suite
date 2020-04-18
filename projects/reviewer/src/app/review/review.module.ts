import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewDialogComponent } from './dialog/review-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReviewReplyDialogComponent } from './reply-dialog/review-reply-dialog.component';
import { MatListModule } from '@angular/material/list';
import { RatingComponent } from './rating/rating.component';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
  ],
  declarations: [
    ReviewDialogComponent,
    ReviewReplyDialogComponent,
    RatingComponent,
  ],
  exports: [ReviewDialogComponent, ReviewReplyDialogComponent, RatingComponent],
})
export class ReviewModule {}
