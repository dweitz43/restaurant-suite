import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantComponent } from './restaurant.component';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RestaurantDialogComponent } from './dialog/restaurant-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ReviewModule } from '../review/review.module';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RestaurantInfoDialogComponent } from './info-dialog/restaurant-info-dialog.component';
import { RestaurantInfoDialogListItemComponent } from './info-dialog/list-item/list-item.component';
import { RatingFilterComponent } from './rating-filter/rating-filter.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    RestaurantRoutingModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    ReviewModule,
    MatBadgeModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  declarations: [
    RestaurantComponent,
    RestaurantDialogComponent,
    RestaurantInfoDialogComponent,
    RestaurantInfoDialogListItemComponent,
    RatingFilterComponent,
  ],
  exports: [RestaurantComponent],
})
export class RestaurantModule {}
