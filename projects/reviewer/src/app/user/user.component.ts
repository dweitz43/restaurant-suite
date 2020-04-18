import { Component, OnDestroy, OnInit } from '@angular/core';
import { merge, of, Subject } from 'rxjs';
import { UserService } from './user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { filter, map, shareReplay, switchMap, takeUntil } from 'rxjs/operators';
import { Role, User } from './user.model';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './dialog/user-dialog.component';
import { NavService } from '../nav/nav.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'reviewer-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  user: User;
  users: User[];
  userLoaded: boolean;
  usersLoaded: boolean;
  isAdmin: boolean;
  isHandset: boolean;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private userService: UserService,
    private auth: AngularFireAuth,
    private dialog: MatDialog,
    private navService: NavService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Small, Breakpoints.XSmall])
      .pipe(
        map((result) => result.matches),
        shareReplay(),
        takeUntil(this.destroy$)
      )
      .subscribe((matches) => (this.isHandset = matches));

    this.getUserData();

    // update user api data on refresh
    this.userService.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getUserData());

    // open Add User dialog on toolbar button click
    this.navService.toolbarButtonClick$
      .pipe(takeUntil(this.destroy$))
      .subscribe((text) => {
        if (text === 'ADD USER') {
          this.openDialog();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * open dialog to add/edit/delete user
   */
  openDialog(user?: User, remove?: boolean) {
    this.dialog.open(UserDialogComponent, {
      data: { user, remove, isAdmin: this.isAdmin },
      width: this.isHandset ? '100vw' : '326px',
    });
  }

  /**
   * get user data
   */
  private getUserData() {
    this.userLoaded = false;
    this.usersLoaded = false;
    this.auth.user
      .pipe(
        filter((user) => !!user),
        switchMap((user) =>
          user ? this.userService.getUser(user?.uid) : of(null)
        ),
        switchMap((user) => {
          if (user) {
            this.user = user;
            this.isAdmin = this.user.role === Role.ADMIN;
            if (this.isAdmin) {
              // admin users can Add Users to system
              this.navService.toolbarButton = 'ADD USER';
            } else {
              this.navService.toolbarButton = '';
            }
          }
          this.userLoaded = true;
          return this.isAdmin ? this.userService.users$ : of(null);
        }),
        takeUntil(merge(this.destroy$, this.userService.refresh$))
      )
      .subscribe((users) => {
        if (users) {
          this.users = users;
        }
        this.usersLoaded = true;
      });
  }
}
