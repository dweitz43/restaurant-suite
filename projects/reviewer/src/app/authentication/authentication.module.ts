import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationComponent } from './authentication.component';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileFormModule } from '../profile-form/profile-form.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthenticationRoutingModule } from './authentication-routing.module';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    ProfileFormModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    AuthenticationRoutingModule,
  ],
  declarations: [AuthenticationComponent],
  exports: [AuthenticationComponent],
})
export class AuthenticationModule {}
