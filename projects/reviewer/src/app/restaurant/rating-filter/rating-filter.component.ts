import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'reviewer-rating-filter',
  templateUrl: './rating-filter.component.html',
  styleUrls: ['./rating-filter.component.scss'],
})
export class RatingFilterComponent {
  @Output() filterRatings: EventEmitter<{
    [rating: number]: boolean;
  }> = new EventEmitter<{ [p: number]: boolean }>();
  ratingsFilter: { [rating: number]: boolean } = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  };

  /**
   * emit Star rating selection
   */
  selectRatingFilter(rating: number) {
    this.ratingsFilter[rating] = !this.ratingsFilter[rating];
    this.filterRatings.emit(this.ratingsFilter);
  }
}
