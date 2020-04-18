import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Role, User } from '../user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateUserRequest, UserService } from '../user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SnackService } from '../../snack/snack.service';

@Component({
  selector: 'reviewer-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit, OnDestroy {
  user: User;
  deleting: boolean;
  form: FormGroup;
  isAdmin: boolean;
  saving: boolean;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { user: User; remove: boolean; isAdmin: boolean },
    private dialog: MatDialog,
    private userService: UserService,
    private snackService: SnackService
  ) {}

  /**
   * initialize dialog data
   */
  ngOnInit(): void {
    this.user = this.data.user;
    this.deleting = this.data.remove;
    this.isAdmin = this.data.isAdmin;
    if (!this.deleting) {
      // create form if not deleting User dialog
      this.form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        role: new FormControl(Role.REGULAR, Validators.required),
        displayName: new FormControl(''),
      });
      if (this.user) {
        // set form values if User provided
        this.form.controls.email.setValue(this.user.email);
        this.form.controls.password.clearValidators();
        this.form.controls.role.setValue(this.user.role);
        this.form.controls.displayName.setValue(this.user.displayName);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close() {
    this.dialog.closeAll();
  }

  /**
   * save form if creating or updating User
   * confirm removal of User if deleting User
   */
  save(form?: FormGroup) {
    this.saving = true;
    if (form) {
      const { email, password, role, displayName } = form.value;
      if (!this.user) {
        // attempt to create user with {email} {password} {role} {displayName}
        this.userService
          .create({ email, password, role, displayName })
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (success) => {
              // stream refresh event to subscribed components
              this.userService.refresh();
              this.snackService.showSnack('User created');
              this.dialog.closeAll();
            },
            (error) => {
              this.saving = false;
              console.error(error);
              this.snackService.showSnack('Error creating user');
            }
          );
      } else {
        const userRequest: UpdateUserRequest = {
          email,
          displayName,
          role,
          uid: this.user.uid,
        };
        if (password) {
          userRequest.password = password;
        }
        // attempt to update User with {email} {displayName} {role} {password}
        this.userService
          .edit(userRequest)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (success) => {
              // stream refresh event to subscribed components
              this.userService.refresh();
              this.snackService.showSnack('User updated');
              this.dialog.closeAll();
            },
            (error) => {
              this.saving = false;
              console.error(error);
              this.snackService.showSnack('Error updating user');
            }
          );
      }
    } else {
      // attempt to delete user
      this.userService
        .remove(this.user.uid)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (success) => {
            // stream refresh event to subscribed components
            this.userService.refresh();
            this.snackService.showSnack('User deleted');
            this.dialog.closeAll();
          },
          (error) => {
            this.saving = false;
            console.error(error);
            this.snackService.showSnack('Error deleting user');
          }
        );
    }
  }
}
