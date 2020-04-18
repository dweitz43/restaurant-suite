import { RestaurantInfoDialogComponent } from './restaurant-info-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RestaurantInfoDialogListItemComponent } from './list-item/list-item.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RatingComponent } from '../../review/rating/rating.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MOCK_RESTAURANT_DIALOG_DATA } from '../../mock/dialog-data';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatListHarness } from '@angular/material/list/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('RestaurantInfoDialogComponent', () => {
  let component: RestaurantInfoDialogComponent;
  let fixture: ComponentFixture<RestaurantInfoDialogComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RestaurantInfoDialogComponent,
        RestaurantInfoDialogListItemComponent,
        RatingComponent,
      ],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: MOCK_RESTAURANT_DIALOG_DATA },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render title', async () => {
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toContain('restaurant');
  });

  it('should render Restaurant Reviews section', async () => {
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-content h3').textContent
    ).toBe('Restaurant Reviews');
  });

  it('should render subheaders for each section of ratings', async () => {
    const list = await loader.getHarness(MatListHarness);
    const sections = await list.getItemsGroupedBySubheader();
    expect(sections.length).toBe(3);
    expect(sections[0].heading).toBe('Highest Rated');
    expect(sections[1].heading).toBe('Lowest Rated');
    expect(sections[2].heading).toBe('Recent');
  });

  it('should sort reviews and extract highest and lowest rated reviews', async () => {
    expect(component.highestRated.rating).toBe(5);
    expect(component.lowestRated.rating).toBe(1);
    expect(component.recentReviews[0].date).toBe(1586709664500);
  });

  it('should render footer button', async () => {
    expect(
      loader.getHarness(MatButtonHarness.with({ text: 'CLOSE' }))
    ).toBeTruthy();
  });
});
