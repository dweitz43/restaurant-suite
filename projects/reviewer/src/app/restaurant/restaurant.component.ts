import { Component, OnDestroy, OnInit } from '@angular/core';
import { Role, User } from '../user/user.model';
import { Restaurant } from './restaurant.model';
import { merge, of, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { filter, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { RestaurantService } from './restaurant.service';
import { NavService } from '../nav/nav.service';
import { RestaurantDialogComponent } from './dialog/restaurant-dialog.component';
import { ReviewService } from '../review/review.service';
import { ReviewDialogComponent } from '../review/dialog/review-dialog.component';
import { ReviewReplyDialogComponent } from '../review/reply-dialog/review-reply-dialog.component';
import { RestaurantInfoDialogComponent } from './info-dialog/restaurant-info-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'reviewer-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss'],
})
export class RestaurantComponent implements OnInit, OnDestroy {
  user: User;
  restaurants: Restaurant[] = [];
  loaded: boolean;
  reviewsLoaded: { [id: string]: boolean } = {};
  adminRole = Role.ADMIN;
  ownerRole = Role.OWNER;
  filteredRestaurants: Restaurant[] = [];
  isHandset: boolean;
  private ratingsFilter: { [rating: number]: boolean } = {
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  };
  private destroy$: Subject<void> = new Subject<void>();
  private reviewDataRefreshers: { [id: string]: Subject<void> } = {};

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private dialog: MatDialog,
    private restaurantService: RestaurantService,
    private navService: NavService,
    private reviewService: ReviewService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.XSmall, Breakpoints.Small])
      .pipe(
        map((result) => result.matches),
        shareReplay(),
        takeUntil(this.destroy$)
      )
      .subscribe((matches) => (this.isHandset = matches));
    this.getRestaurantData();

    // streamed when restaurant data updated
    this.restaurantService.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getRestaurantData());

    // streamed when reviews data updated
    this.reviewService.refreshRestaurantReviews$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        if (id) {
          // get new review data for {id} restaurant
          this.reviewDataRefreshers[id].next();
          const restaurant = this.restaurants.find((r) => r.id === id);
          if (restaurant) {
            this.getReviewData(restaurant);
          }
        } else {
          // get new review data for all restaurants
          for (const reviewId in this.reviewDataRefreshers) {
            if (reviewId) {
              this.reviewDataRefreshers[reviewId].next();
              this.restaurants.forEach((restaurant) =>
                this.getReviewData(restaurant)
              );
            }
          }
        }
      });

    // open Create Restaurant dialog on toolbar button click
    this.navService.toolbarButtonClick$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text) => {
        if (text === 'CREATE RESTAURANT') {
          this.openDialog();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDialog(
    restaurant?: Restaurant,
    remove?: boolean,
    review?: boolean,
    reply?: boolean,
    info?: boolean
  ) {
    if (review) {
      // open dialog to review restaurant
      this.dialog.open(ReviewDialogComponent, {
        data: { user: this.user, restaurant },
        width: this.isHandset ? '100vw' : '50vw',
      });
    } else if (reply) {
      // open dialog to reply to restaurant reviews
      this.dialog.open(ReviewReplyDialogComponent, {
        id: 'reply',
        data: { user: this.user, restaurant },
        width: this.isHandset ? '100vw' : '50vw',
      });
    } else if (info) {
      // open dialog to view restaurant info
      this.dialog.open(RestaurantInfoDialogComponent, {
        id: 'info',
        data: { user: this.user, restaurant },
        width: this.isHandset ? '100vw' : '50vw',
      });
    } else {
      // open dialog to edit/delete restaurant
      this.dialog.open(RestaurantDialogComponent, {
        data: { user: this.user, restaurant, remove },
        width: this.isHandset ? '100vw' : '326px',
      });
    }
  }

  /**
   * filter displayed restaurants based on selected Star chips
   */
  filterRestaurants() {
    this.filteredRestaurants = this.restaurants.filter(
      (restaurant) =>
        (!restaurant.averageRating && restaurant.averageRating !== 0) ||
        this.ratingsFilter[restaurant.averageRating]
    );
  }

  /**
   * set selected Star chip values and then filter list of displayed restaurants
   */
  setRatingsFilter(ratingsFilter: { [rating: number]: boolean }) {
    this.ratingsFilter = ratingsFilter;
    this.filterRestaurants();
  }

  /**
   * Get restaurant data from api
   */
  private getRestaurantData() {
    this.loaded = false;
    this.auth.user
      .pipe(
        filter((user) => !!user),
        switchMap((user) => {
          return user ? this.userService.getUser(user?.uid) : of(null);
        }),
        switchMap((user) => {
          if (user) {
            this.user = user;
            if ([Role.ADMIN, Role.OWNER].includes(this.user.role)) {
              // admin and owner are allowed to view Create Restaurant button
              this.navService.toolbarButton = 'CREATE RESTAURANT';
            } else {
              this.navService.toolbarButton = '';
            }
          }
          return this.restaurantService.restaurants$;
        }),
        takeUntil(
          merge(
            this.destroy$,
            this.userService.refresh$,
            this.restaurantService.refresh$
          )
        )
      )
      .subscribe((restaurants) => {
        if (restaurants && restaurants.length) {
          restaurants.forEach((restaurant) => this.getReviewData(restaurant));
        }
        this.restaurants = restaurants;
        this.filterRestaurants();
        this.loaded = true;
      });
  }

  /**
   * get review data for {restaurant}
   */
  private getReviewData(restaurant: Restaurant) {
    this.reviewsLoaded[restaurant.id] = false;
    this.reviewDataRefreshers[restaurant.id] = new Subject<void>();
    this.reviewService
      .getRestaurantReviews(restaurant.id)
      .pipe(
        takeUntil(
          merge(this.destroy$, this.reviewDataRefreshers[restaurant.id])
        )
      )
      .subscribe((reviews) => {
        restaurant.reviewsAwaitingReply = [];
        restaurant.reviews = reviews;
        restaurant.reviewsAwaitingReply = this.restaurantService.filterReviewsAwaitingReply(
          reviews
        );
        restaurant.averageRating = this.restaurantService.calculateAverageRating(
          reviews
        );
        this.restaurants = this.restaurantService.sort(
          this.restaurants,
          this.user.role
        );
        this.filterRestaurants();
        this.reviewsLoaded[restaurant.id] = true;
        const dialog =
          this.dialog.getDialogById('info') ||
          this.dialog.getDialogById('reply');
        if (
          dialog &&
          dialog.componentInstance.restaurant.id === restaurant.id
        ) {
          // ensure data in dialog is updated correctly when relevant dialog is open during review data refresh
          if (dialog.id === 'info' && restaurant.reviews.length) {
            dialog.componentInstance.restaurant = restaurant;
            dialog.componentInstance.sortReviews();
          } else if (
            dialog.id === 'reply' &&
            restaurant.reviewsAwaitingReply.length
          ) {
            dialog.componentInstance.restaurant = restaurant;
          } else {
            dialog.close();
          }
        }
      });
  }
}
