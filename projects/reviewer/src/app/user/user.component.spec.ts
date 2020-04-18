import { UserServiceStub } from '../mock/user.service.stub';
import { UserComponent } from './user.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../app-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileFormModule } from '../profile-form/profile-form.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from './user.service';
import { AuthStub } from '../mock/auth-stub';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListHarness } from '@angular/material/list/testing';
import { UserDialogComponent } from './dialog/user-dialog.component';
import { NavService } from '../nav/nav.service';
import { UserListItemComponent } from './list-item/user-list-item.component';

describe('UserComponent', () => {
  const userServiceStub = new UserServiceStub();
  const authStub = new AuthStub();
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let loader: HarnessLoader;
  let dialog: MatDialog;
  let navService: NavService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent, UserDialogComponent, UserListItemComponent],
      imports: [
        NoopAnimationsModule,
        RouterTestingModule.withRoutes(routes),
        MatListModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        ProfileFormModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: AngularFireAuth, useValue: authStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dialog = TestBed.inject(MatDialog);
    navService = TestBed.inject(NavService);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render list of users if authenticated', async () => {
    const list = await loader.getHarness(MatListHarness);
    const sections = await list.getItemsGroupedBySubheader();
    expect(sections.length).toBe(2);
    expect(
      fixture.nativeElement.querySelector('.mat-list .mat-subheader')
        .textContent
    ).toContain('My Info');
    expect(
      fixture.nativeElement.querySelector('.mat-list span .mat-subheader')
        .textContent
    ).toContain('All Users');
  });

  it('should open User dialog on toolbar button click', async () => {
    dialog.afterOpened.subscribe((opened) => {
      expect(opened.componentInstance).toBeInstanceOf(UserDialogComponent);
      expect(opened._containerInstance._config.width).toBe('326px');
      expect(opened.componentInstance.data.isAdmin).toBe(true);
    });
    navService.clickToolbarButton();
  });

  it('should open User dialog on mobile toolbar button click', async () => {
    component.isHandset = true;
    dialog.afterOpened.subscribe((opened) => {
      expect(opened.componentInstance).toBeInstanceOf(UserDialogComponent);
      expect(opened._containerInstance._config.width).toBe('100vw');
      expect(opened.componentInstance.data.isAdmin).toBe(true);
    });
    navService.clickToolbarButton();
  });
});
