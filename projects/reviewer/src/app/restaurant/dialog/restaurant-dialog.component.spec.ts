import { RestaurantServiceStub } from '../../mock/restaurant.service.stub';
import { RestaurantDialogComponent } from './restaurant-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RestaurantService } from '../restaurant.service';
import {
  MOCK_CREATE_RESTAURANT_DIALOG_DATA,
  MOCK_RESTAURANT_DIALOG_DATA,
} from '../../mock/dialog-data';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

describe('RestaurantDialogComponent', () => {
  const restaurantServiceStub = new RestaurantServiceStub();
  let component: RestaurantDialogComponent;
  let fixture: ComponentFixture<RestaurantDialogComponent>;
  let loader: HarnessLoader;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantDialogComponent],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        { provide: RestaurantService, useValue: restaurantServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: MOCK_RESTAURANT_DIALOG_DATA },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dialog = TestBed.inject(MatDialog);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render dialog title based upon variables initialized from dialog data', async () => {
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Edit Restaurant');
    component.deleting = true;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Delete Restaurant');
  });

  it('should render footer buttons', async () => {
    let buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
    expect(await buttons[0].getText()).toBe('CANCEL');
    expect(await buttons[1].getText()).toBe('SAVE');
    component.deleting = true;
    buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(await buttons[0].getText()).toBe('NO');
    expect(await buttons[1].getText()).toBe('YES');
  });

  it('should render form in dialog content if not deleting', async () => {
    const formField = await loader.getHarness(MatFormFieldHarness);
    expect(await formField.getLabel()).toBe('Name');
  });

  it('should render confirmation text in dialog content if deleting', async () => {
    component.deleting = true;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-content p').textContent
    ).toBe('Are you sure you want to delete restaurant?');
  });

  it('should remove Restaurant if delete dialog on Save button click', async () => {
    component.deleting = true;
    restaurantServiceStub.refresh$.subscribe(() => expect().nothing());
    fixture.detectChanges();
    component.save();
    fixture.detectChanges();
    expect(dialog.openDialogs.length).toBe(0);
  });

  it('should edit Restaurant on Save button click', async () => {
    restaurantServiceStub.refresh$.subscribe(() => expect().nothing());
    component.form.controls.name.setValue('name');
    fixture.detectChanges();
    component.save();
    fixture.detectChanges();
    expect(dialog.openDialogs.length).toBe(0);
  });
});

describe('RestaurantDialogComponent:Create', () => {
  const restaurantServiceStub = new RestaurantServiceStub();
  let component: RestaurantDialogComponent;
  let fixture: ComponentFixture<RestaurantDialogComponent>;
  let loader: HarnessLoader;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantDialogComponent],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        { provide: RestaurantService, useValue: restaurantServiceStub },
        {
          provide: MAT_DIALOG_DATA,
          useValue: MOCK_CREATE_RESTAURANT_DIALOG_DATA,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dialog = TestBed.inject(MatDialog);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render dialog title based upon variables initialized from dialog data', async () => {
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Create Restaurant');
  });

  it('should create Restaurant on Save button click', async () => {
    restaurantServiceStub.refresh$.subscribe(() => expect().nothing());
    component.form.controls.name.setValue('name');
    fixture.detectChanges();
    component.save();
    fixture.detectChanges();
    expect(dialog.openDialogs.length).toBe(0);
  });
});
