import { ReviewDialogComponent } from './review-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RatingComponent } from '../rating/rating.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MOCK_REVIEW_DIALOG_DATA } from '../../mock/dialog-data';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { ReviewServiceStub } from '../../mock/review.service.stub';
import { ReviewService } from '../review.service';

describe('ReviewDialogComponent', () => {
  const reviewServiceStub = new ReviewServiceStub();
  let component: ReviewDialogComponent;
  let fixture: ComponentFixture<ReviewDialogComponent>;
  let loader: HarnessLoader;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewDialogComponent, RatingComponent],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: MOCK_REVIEW_DIALOG_DATA },
        { provide: ReviewService, useValue: reviewServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dialog = TestBed.inject(MatDialog);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Review restaurant');
  });

  it('should render rating control and comment form field in dialog content', async () => {
    expect(
      fixture.nativeElement.querySelector(
        '.mat-dialog-content form .rating-control label'
      ).textContent
    ).toBe('Rating');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-dialog-content form .rating-control reviewer-rating'
      )
    ).toBeTruthy();
    const formField = await loader.getHarness(MatFormFieldHarness);
    expect(await formField.getLabel()).toBe('Comment');
  });

  it('should render footer buttons', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
    expect(await buttons[0].getText()).toBe('CANCEL');
    expect(await buttons[1].getText()).toBe('SUBMIT');
    expect(await buttons[1].isDisabled()).toBe(false);
  });

  it('should create Review when Submit button clicked', async () => {
    component.form.controls.rating.setValue(5);
    component.form.controls.comment.setValue('comment');
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    component.submit();
    fixture.detectChanges();
    expect(dialog.openDialogs.length).toBe(0);
  });
});
