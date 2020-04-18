import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SnackService } from '../snack/snack.service';
import { Role } from '../user/user.model';

@Component({
  selector: 'reviewer-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit, OnDestroy {
  submitting: boolean;
  roleControl: { name: string; control: FormControl } = {
    name: 'role',
    control: new FormControl(Role.REGULAR, [Validators.required]),
  };
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private auth: AngularFireAuth,
    private userService: UserService,
    private router: Router,
    private snackService: SnackService
  ) {}

  ngOnInit(): void {
    this.auth.authState.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.router.navigate(['/restaurants']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * create account if form has a role control, otherwise log in with existing account
   * navigate to /restaurants upon successful authentication
   */
  async authenticate(form: FormGroup) {
    this.submitting = true;
    try {
      const { email, password, role } = form.value;
      if (role) {
        this.userService
          .create({ email, password, role })
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            async (success) => {
              await this.auth.signInWithEmailAndPassword(email, password);
              await this.router.navigate(['/restaurants']);
            },
            (error) => {
              this.submitting = false;
              console.error(error);
              this.snackService.showSnack(error.error.message);
            }
          );
      } else {
        await this.auth.signInWithEmailAndPassword(email, password);
        await this.router.navigate(['/restaurants']);
      }
    } catch (err) {
      this.submitting = false;
      console.error(err);
      this.snackService.showSnack(err.message);
    }
  }
}
