import { ReviewServiceStub } from '../../mock/review.service.stub';
import { RatingComponent } from './rating.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReviewService } from '../review.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Role } from '../../user/user.model';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('RatingComponent', () => {
  const reviewServiceStub = new ReviewServiceStub();
  let component: RatingComponent;
  let fixture: ComponentFixture<RatingComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingComponent],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
      ],
      providers: [{ provide: ReviewService, useValue: reviewServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render 5 star icons', async () => {
    expect(
      fixture.nativeElement.querySelector('.stars mat-icon').textContent
    ).toBe('star');
    expect(
      fixture.nativeElement.querySelector('.stars mat-icon + mat-icon')
        .textContent
    ).toBe('star');
    expect(
      fixture.nativeElement.querySelector(
        '.stars mat-icon + mat-icon + mat-icon'
      ).textContent
    ).toBe('star');
    expect(
      fixture.nativeElement.querySelector(
        '.stars mat-icon + mat-icon + mat-icon + mat-icon'
      ).textContent
    ).toBe('star');
    expect(
      fixture.nativeElement.querySelector(
        '.stars mat-icon + mat-icon + mat-icon + mat-icon + mat-icon'
      ).textContent
    ).toBe('star');
  });

  it('should render icon buttons if User is admin and rating is editable', async () => {
    component.role = Role.ADMIN;
    component.editable = true;
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
    expect(await buttons[0].getText()).toBe('edit');
    expect(await buttons[1].getText()).toBe('clear');
  });

  it('should set rating and emit star click event on rating selection', async () => {
    component.editingRating = 0;
    component.review = {
      id: 'id5',
      uid: 'uid2',
      rid: 'rid',
      rating: 0,
      date: 0,
      comment: 'another comment',
      reply: 'reply',
    };
    component.starClick.subscribe((rating: number) => expect(rating).toBe(5));
    fixture.detectChanges();
    component.selectRating(5);
  });

  it('should save edited rating', async () => {
    component.editingRating = 0;
    component.review = {
      id: 'id5',
      uid: 'uid2',
      rid: 'rid',
      rating: 0,
      date: 0,
      comment: 'another comment',
      reply: 'reply',
    };
    component.restaurantId = 'rid';
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    fixture.detectChanges();
    component.editSaveRating();
  });

  it('should set editing rating value to current Review rating', async () => {
    component.review = {
      id: 'id5',
      uid: 'uid2',
      rid: 'rid',
      rating: 2,
      date: 0,
      comment: 'another comment',
      reply: 'reply',
    };
    fixture.detectChanges();
    component.editSaveRating();
    fixture.detectChanges();
    expect(component.editingRating).toBe(2);
  });

  it('should remove rating from Review', async () => {
    component.review = {
      id: 'id5',
      uid: 'uid2',
      rid: 'rid',
      rating: 2,
      date: 0,
      comment: 'another comment',
      reply: 'reply',
    };
    component.restaurantId = 'rid';
    reviewServiceStub.refreshRestaurantReviews$.subscribe((id) =>
      expect(id).toBe('rid')
    );
    fixture.detectChanges();
    component.removeRating();
    fixture.detectChanges();
  });
});
