import { ReviewServiceStub } from '../../../mock/review.service.stub';
import { RestaurantInfoDialogListItemComponent } from './list-item.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { RatingComponent } from '../../../review/rating/rating.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReviewService } from '../../../review/review.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListItemHarness } from '@angular/material/list/testing';
import { Role } from '../../../user/user.model';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

class RestaurantInfoDialogListItemHarness extends MatListItemHarness {
  static hostSelector = 'mat-list-item';
}

describe('RestaurantInfoDialogListItemComponent', () => {
  const reviewServiceStub = new ReviewServiceStub();
  let component: RestaurantInfoDialogListItemComponent;
  let fixture: ComponentFixture<RestaurantInfoDialogListItemComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantInfoDialogListItemComponent, RatingComponent],
      imports: [
        NoopAnimationsModule,
        MatSnackBarModule,
        MatListModule,
        MatIconModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [{ provide: ReviewService, useValue: reviewServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantInfoDialogListItemComponent);
    component = fixture.componentInstance;
    component.review = {
      id: 'hid',
      uid: 'uid',
      rid: 'rid',
      rating: 5,
      date: 1586709664200,
      comment: 'new comment',
      reply: 'reply',
    };
    component.restaurantId = 'rid';
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render comment list icon', async () => {
    const item = await loader.getHarness(RestaurantInfoDialogListItemHarness);
    expect(await item.hasIcon()).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.mat-list-item .mat-list-icon')
        .textContent
    ).toBe('comment');
  });

  it('should not render list icon if mobile', async () => {
    component.isHandset = true;
    const item = await loader.getHarness(RestaurantInfoDialogListItemHarness);
    expect(await item.hasIcon()).toBe(false);
  });

  it('should render Review info in dialog content', async () => {
    component.userRole = Role.REGULAR;
    const item = await loader.getHarness(RestaurantInfoDialogListItemHarness);
    const lines = await item.getLinesText();
    expect(lines.length).toBe(3);
    expect(lines[0]).toContain('Date of Visit:  April 12, 2020');
    expect(lines[1]).toBe('Visitor comment: new comment');
    expect(lines[2]).toBe('Owner reply: reply');
  });

  it('should render form fields and Delete button in dialog content if admin', async () => {
    component.userRole = Role.ADMIN;
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formFields.length).toBe(2);
    expect(await formFields[0].getLabel()).toBe('Visitor comment');
    expect(await formFields[1].getLabel()).toBe('Owner reply');
    expect(
      await loader.getHarness(MatButtonHarness.with({ text: 'DELETE REVIEW' }))
    ).toBeTruthy();
  });

  it('should remove comment from Review', async () => {
    component.userRole = Role.ADMIN;
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    component.removeComment();
    fixture.detectChanges();
  });

  it('should remove reply from Review', async () => {
    component.userRole = Role.ADMIN;
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    component.removeReply();
    fixture.detectChanges();
  });

  it('should toggle comment editing state on Review', async () => {
    component.userRole = Role.ADMIN;
    expect(component.editingComment).toBeFalsy();
    component.editSaveComment();
    fixture.detectChanges();
    expect(component.editingComment).toBe('new comment');
  });

  it('should save edited comment on Review', async () => {
    component.userRole = Role.ADMIN;
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    component.editingComment = 'updated comment';
    fixture.detectChanges();
    component.editSaveComment();
    fixture.detectChanges();
    expect(component.editingComment).toBeFalsy();
  });

  it('should toggle reply editing state on Review', async () => {
    component.userRole = Role.ADMIN;
    expect(component.editingReply).toBeFalsy();
    component.editSaveReply();
    fixture.detectChanges();
    expect(component.editingReply).toBe('reply');
  });

  it('should save edited reply on Review', async () => {
    component.userRole = Role.ADMIN;
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    component.editingReply = 'updated reply';
    fixture.detectChanges();
    component.editSaveReply();
    fixture.detectChanges();
    expect(component.editingReply).toBeFalsy();
  });

  it('should delete Review', async () => {
    component.userRole = Role.ADMIN;
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    component.deleteReview();
    fixture.detectChanges();
  });
});
