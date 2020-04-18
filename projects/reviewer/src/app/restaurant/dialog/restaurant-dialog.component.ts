import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RestaurantService } from '../restaurant.service';
import { Restaurant } from '../restaurant.model';
import { User } from '../../user/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { SnackService } from '../../snack/snack.service';

@Component({
  selector: 'reviewer-restaurant-dialog',
  templateUrl: './restaurant-dialog.component.html',
  styleUrls: ['./restaurant-dialog.component.scss'],
})
export class RestaurantDialogComponent implements OnInit, OnDestroy {
  deleting: boolean;
  saving: boolean;
  restaurant: Restaurant;
  user: User;
  form: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  });
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { user: User; restaurant: Restaurant; remove: boolean },
    private dialog: MatDialog,
    private restaurantService: RestaurantService,
    private snackService: SnackService
  ) {}

  /**
   * initialize dialog data
   */
  ngOnInit(): void {
    this.user = this.data.user;
    this.restaurant = this.data.restaurant;
    this.deleting = this.data.remove;
    if (this.restaurant) {
      this.form.controls.name.setValue(this.restaurant.name);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close() {
    this.dialog.closeAll();
  }

  save() {
    this.saving = true;
    if (this.deleting) {
      // attempt to remove Restaurant from system
      this.restaurantService
        .remove(this.restaurant)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (success) => {
            // stream refresh to other components to update api data
            this.restaurantService.refresh();
            this.snackService.showSnack('Restaurant deleted');
            this.dialog.closeAll();
          },
          (error) => {
            this.saving = false;
            console.error(error);
            this.snackService.showSnack('Error deleting restaurant');
          }
        );
    } else {
      const { name } = this.form.value;
      if (this.restaurant) {
        // attempt to update Restaurant
        this.restaurantService
          .edit(
            {
              name,
              ownerId: this.restaurant.ownerId,
            },
            this.restaurant.id
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (success) => {
              // stream refresh to other components to update api data
              this.restaurantService.refresh();
              this.snackService.showSnack('Restaurant updated');
              this.dialog.closeAll();
            },
            (error) => {
              this.saving = false;
              console.error(error);
              this.snackService.showSnack('Error updating restaurant');
            }
          );
      } else {
        // attempt to create new Restaurant
        this.restaurantService
          .create({ name, ownerId: this.user.uid })
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (success) => {
              // stream refresh to other components to update api data
              this.restaurantService.refresh();
              this.snackService.showSnack('Restaurant created');
              this.dialog.closeAll();
            },
            (error) => {
              this.saving = false;
              console.error(error);
              this.snackService.showSnack('Error creating restaurant');
            }
          );
      }
    }
  }
}
