import { UserServiceStub } from '../mock/user.service.stub';
import { AuthStub } from '../mock/auth-stub';
import { RestaurantServiceStub } from '../mock/restaurant.service.stub';
import { RestaurantComponent } from './restaurant.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReviewServiceStub } from '../mock/review.service.stub';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { RatingFilterComponent } from './rating-filter/rating-filter.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReviewModule } from '../review/review.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../user/user.service';
import { RestaurantService } from './restaurant.service';
import { ReviewService } from '../review/review.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListHarness } from '@angular/material/list/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonHarness } from '@angular/material/button/testing';
import { RestaurantDialogComponent } from './dialog/restaurant-dialog.component';
import { NavService } from '../nav/nav.service';
import { ReviewDialogComponent } from '../review/dialog/review-dialog.component';
import { ReviewReplyDialogComponent } from '../review/reply-dialog/review-reply-dialog.component';
import { RestaurantInfoDialogComponent } from './info-dialog/restaurant-info-dialog.component';
import { STUB_RESTAURANTS } from '../mock/restaurant';
import { REVIEWS } from '../mock/review';

describe('RestaurantComponent', () => {
  const userServiceStub = new UserServiceStub();
  const authStub = new AuthStub();
  const restaurantServiceStub = new RestaurantServiceStub();
  const reviewServiceStub = new ReviewServiceStub();
  let component: RestaurantComponent;
  let fixture: ComponentFixture<RestaurantComponent>;
  let loader: HarnessLoader;
  let dialog: MatDialog;
  let navService: NavService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RestaurantComponent,
        RatingFilterComponent,
        RestaurantDialogComponent,
        ReviewDialogComponent,
        ReviewReplyDialogComponent,
        RestaurantInfoDialogComponent,
      ],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        ReviewModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatChipsModule,
        MatBadgeModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: AngularFireAuth, useValue: authStub },
        { provide: RestaurantService, useValue: restaurantServiceStub },
        { provide: ReviewService, useValue: reviewServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dialog = TestBed.inject(MatDialog);
    navService = TestBed.inject(NavService);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render semi-transparent list when not loaded', async () => {
    component.loaded = false;
    const list = await loader.getHarness(MatListHarness);
    const element = await list.host();
    expect(await element.getCssValue('opacity')).toBe('0.5');
  });

  it('should render opaque list when loaded', async () => {
    const list = await loader.getHarness(MatListHarness);
    const element = await list.host();
    expect(await element.getCssValue('opacity')).toBe('1');
  });

  it('should render list subheader', async () => {
    expect(
      fixture.nativeElement.querySelector('.mat-list .mat-subheader')
        .textContent
    ).toContain('Restaurants');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-list .mat-subheader reviewer-rating-filter'
      )
    ).toBeTruthy();
  });

  it('should render 3 restaurant list items', async () => {
    const list = await loader.getHarness(MatListHarness);
    const items = await list.getItems();
    expect(items.length).toBe(3);
    const firstItem = items[0];
    expect(await firstItem.hasIcon()).toBe(true);
    const lines = await firstItem.getLinesText();
    expect(lines.length).toBe(2);
    expect(lines[0]).toBe('restaurant');
  });

  it('should render restaurant list item buttons', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(15);
    expect(await buttons[0].getText()).toBe('INFO');
    expect(await buttons[1].getText()).toBe('REVIEW');
    expect(await buttons[2].getText()).toContain('REPLY TO REVIEWS');
    expect(await buttons[3].getText()).toBe('EDIT');
    expect(await buttons[4].getText()).toBe('DELETE');
  });

  it('should open Create Restaurant dialog on toolbar button click', async () => {
    dialog.afterOpened.subscribe((opened) => {
      expect(opened.componentInstance).toBeInstanceOf(
        RestaurantDialogComponent
      );
      expect(opened._containerInstance._config.width).toBe('326px');
    });
    navService.clickToolbarButton();
  });

  it('should open Create Restaurant dialog on mobile toolbar button click', async () => {
    component.isHandset = true;
    dialog.afterOpened.subscribe((opened) => {
      expect(opened.componentInstance).toBeInstanceOf(
        RestaurantDialogComponent
      );
      expect(opened._containerInstance._config.width).toBe('100vw');
    });
    navService.clickToolbarButton();
  });

  it('should open Restaurant Review dialog', async () => {
    dialog.afterOpened.subscribe((opened) =>
      expect(opened.componentInstance).toBeInstanceOf(ReviewDialogComponent)
    );
    component.openDialog(STUB_RESTAURANTS[0], false, true);
  });

  it('should open Restaurant Review Reply dialog', async () => {
    dialog.afterOpened.subscribe((opened) =>
      expect(opened.componentInstance).toBeInstanceOf(
        ReviewReplyDialogComponent
      )
    );
    component.openDialog(STUB_RESTAURANTS[0], false, false, true);
  });

  it('should open Restaurant Info dialog', async () => {
    dialog.afterOpened.subscribe((opened) =>
      expect(opened.componentInstance).toBeInstanceOf(
        RestaurantInfoDialogComponent
      )
    );
    component.openDialog(STUB_RESTAURANTS[0], false, false, false, true);
  });

  it('should filter restaurants based on selected Star rating chips', async () => {
    await fixture.whenRenderingDone();
    component.setRatingsFilter({
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    });
    fixture.detectChanges();
    component.filterRestaurants();
    fixture.detectChanges();
    expect(component.filteredRestaurants.length).toBe(0);
  });

  it('should load restaurants', async () => {
    expect(component.restaurants.length).toBe(3);
    expect(component.loaded).toBe(true);
  });

  it('should load restaurant reviews', async () => {
    expect(component.restaurants[0].reviews).toEqual(REVIEWS);
  });
});
