import { RatingFilterComponent } from './rating-filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('RatingFilterComponent', () => {
  let component: RatingFilterComponent;
  let fixture: ComponentFixture<RatingFilterComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatingFilterComponent],
      imports: [NoopAnimationsModule, MatChipsModule, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render chip for each Star rating value', async () => {
    expect(
      fixture.nativeElement.querySelector('.mat-chip-list .mat-chip')
        .textContent
    ).toContain('0');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-chip-list .mat-chip + .mat-chip'
      ).textContent
    ).toContain('1');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-chip-list .mat-chip + .mat-chip + .mat-chip'
      ).textContent
    ).toContain('2');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-chip-list .mat-chip + .mat-chip + .mat-chip + .mat-chip'
      ).textContent
    ).toContain('3');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-chip-list .mat-chip + .mat-chip + .mat-chip + .mat-chip + .mat-chip'
      ).textContent
    ).toContain('4');
    expect(
      fixture.nativeElement.querySelector(
        '.mat-chip-list .mat-chip + .mat-chip + .mat-chip + .mat-chip + .mat-chip + .mat-chip'
      ).textContent
    ).toContain('5');
  });

  it('should set rating filter and emit event when chip selected', async () => {
    component.filterRatings.subscribe(
      (ratingsFilter: { [p: number]: boolean }) =>
        expect(ratingsFilter[1]).toBe(false)
    );
    component.selectRatingFilter(1);
    fixture.detectChanges();
  });
});
