import { RouterModule, Routes } from '@angular/router';
import { RestaurantComponent } from './restaurant.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: '', component: RestaurantComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantRoutingModule {}
