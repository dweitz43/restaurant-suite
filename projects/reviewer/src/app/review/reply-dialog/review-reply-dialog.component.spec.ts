import { ReviewServiceStub } from '../../mock/review.service.stub';
import { ReviewReplyDialogComponent } from './review-reply-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { RatingComponent } from '../rating/rating.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReviewService } from '../review.service';
import { MOCK_REVIEW_DIALOG_DATA } from '../../mock/dialog-data';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatListHarness } from '@angular/material/list/testing';

describe('ReviewReplyDialogComponent', () => {
  const reviewServiceStub = new ReviewServiceStub();
  let component: ReviewReplyDialogComponent;
  let fixture: ComponentFixture<ReviewReplyDialogComponent>;
  let loader: HarnessLoader;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewReplyDialogComponent, RatingComponent],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: ReviewService, useValue: reviewServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: MOCK_REVIEW_DIALOG_DATA },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewReplyDialogComponent);
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
    ).toBe('Reply to Reviews on restaurant');
  });

  it('should render list of Reviews awaiting Reply in dialog content', async () => {
    const list = await loader.getHarness(MatListHarness);
    const listItems = await list.getItems();
    expect(listItems.length).toBe(2);
    const firstReviewLines = await listItems[0].getLinesText();
    const secondReviewLines = await listItems[1].getLinesText();
    expect(firstReviewLines[0]).toContain('Date of Visit: April 12, 2020');
    expect(firstReviewLines[1]).toBe('Visitor comment: comment');
    expect(secondReviewLines[0]).toContain('Date of Visit: April 12, 2020');
    expect(secondReviewLines[1]).toBe('Visitor comment: another comment');
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formFields.length).toBe(2);
    expect(await formFields[0].getLabel()).toBe('Reply Here');
    const suffix = await formFields[0].getHarnessLoaderForSuffix();
    expect(await suffix?.text()).toBe('send');
  });

  it('should render footer button', async () => {
    expect(
      await loader.getHarness(MatButtonHarness.with({ text: 'CLOSE' }))
    ).toBeTruthy();
  });

  it('should update Review with Reply on Send icon button click', async () => {
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    component.send('reply', component.restaurant.reviewsAwaitingReply[0]);
    fixture.detectChanges();
    expect(dialog.openDialogs.length).toBe(0);
  });
});
