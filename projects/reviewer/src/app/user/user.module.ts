import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserDialogComponent } from './dialog/user-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileFormModule } from '../profile-form/profile-form.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserListItemComponent } from './list-item/user-list-item.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    MatListModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    ProfileFormModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
  ],
  declarations: [UserComponent, UserDialogComponent, UserListItemComponent],
  exports: [UserComponent],
})
export class UserModule {}
