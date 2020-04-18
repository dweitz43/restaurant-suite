import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackService {
  constructor(private snackBar: MatSnackBar) {}

  showSnack(message: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, '', { duration: 3000 });
  }
}
