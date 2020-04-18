import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { NavService } from './nav.service';
import { MatSidenav } from '@angular/material/sidenav';
import { RestaurantService } from '../restaurant/restaurant.service';
import { ReviewService } from '../review/review.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'reviewer-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  title = 'Reviewer';
  isHandset: boolean;
  loggedIn$: Observable<boolean>;
  toolbarButtonText: string;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AngularFireAuth,
    private router: Router,
    private navService: NavService,
    private restaurantService: RestaurantService,
    private reviewService: ReviewService,
    private userService: UserService
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
    this.loggedIn$ = this.auth.authState.pipe(
      takeUntil(this.destroy$),
      map((user) => !!user)
    );
    this.navService.toolbarButtonText$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text) => (this.toolbarButtonText = text));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async signOut(drawer: MatSidenav) {
    await this.auth.signOut();
    await this.router.navigate(['/']);
    this.restaurantService.refresh();
    this.reviewService.refreshRestaurantReviews();
    this.userService.refresh();
    if (this.isHandset) {
      await drawer.toggle();
    }
  }

  clickToolbarButton() {
    this.navService.clickToolbarButton();
  }

  // close sidenav on mobile link click
  linkClick(drawer: MatSidenav) {
    if (this.isHandset) {
      drawer.toggle();
    }
  }
}
