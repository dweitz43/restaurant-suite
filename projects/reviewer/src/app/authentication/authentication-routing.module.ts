import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: AuthenticationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
