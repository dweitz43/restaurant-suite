import { AuthenticationComponent } from './authentication.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileFormModule } from '../profile-form/profile-form.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatTabGroupHarness,
  MatTabHarness,
} from '@angular/material/tabs/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Role } from '../user/user.model';
import { routes } from '../app-routing.module';
import { Router } from '@angular/router';
import { AuthStub } from '../mock/auth-stub';
import { UserServiceStub } from '../mock/user.service.stub';
import { UserService } from '../user/user.service';

describe('AuthenticationComponent', () => {
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
  const authStub = new AuthStub();
  const userServiceStub = new UserServiceStub();
  let component: AuthenticationComponent;
  let fixture: ComponentFixture<AuthenticationComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthenticationComponent],
      imports: [
        MatCardModule,
        MatTabsModule,
        ProfileFormModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
        RouterTestingModule.withRoutes(routes),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AngularFireAuth, useValue: authStub },
        { provide: UserService, useValue: userServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render card with Account Circle icon and title User Authentication', async () => {
    fixture = TestBed.createComponent(AuthenticationComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(
      compiled.querySelector('section .mat-card .mat-card-header .mat-icon')
        .textContent
    ).toContain('account_circle');
    expect(
      compiled.querySelector(
        'section .mat-card .mat-card-header .mat-card-title'
      ).textContent
    ).toContain('User Authentication');
  });

  it('should render tabs for Log In / Create Account forms', async () => {
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const tabs = await tabGroup.getTabs();
    expect(tabs.length).toBe(2);
    expect(await tabs[0].getLabel()).toBe('LOG IN');
    expect(await tabs[1].getLabel()).toBe('CREATE ACCOUNT');
  });

  it('should initially render Log In form', async () => {
    const compiled = fixture.nativeElement;
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const selectedTab = await tabGroup.getSelectedTab();
    expect(await selectedTab.getLabel()).toBe('LOG IN');
    expect(await selectedTab.getTextContent()).toBe('Email AddressPassword');
    expect(
      compiled.querySelector(
        `section .mat-card .mat-card-content .mat-tab-group .mat-tab-body-wrapper .mat-tab-body
         .mat-tab-body-content reviewer-profile-form form .role-control`
      )
    ).toBeNull();
  });

  it('should render Create Account form on click of Create Account tab', async () => {
    const compiled = fixture.nativeElement;
    const tabGroup = await loader.getHarness(MatTabGroupHarness);
    const createAccountTab = await loader.getHarness(
      MatTabHarness.with({ label: 'CREATE ACCOUNT' })
    );
    await createAccountTab.select();
    const selectedTab = await tabGroup.getSelectedTab();
    expect(await selectedTab.getLabel()).toEqual('CREATE ACCOUNT');
    expect(await selectedTab.getTextContent()).toContain('Role');
    expect(
      compiled.querySelector(
        `section .mat-card .mat-card-content .mat-tab-group .mat-tab-body-wrapper .mat-tab-body
        .mat-tab-body-content reviewer-profile-form form .role-control`
      )
    ).toBeTruthy();
  });

  it('should disable Submit button for empty form', async () => {
    const submitButton = await loader.getHarness(MatButtonHarness);
    expect(await submitButton.getText()).toBe('SUBMIT');
    expect(await submitButton.isDisabled()).toBe(true);
  });

  it('should log in on Submit button click', async () => {
    const spy = routerSpy.navigate as jasmine.Spy;
    await component.authenticate(
      new FormGroup({
        email: new FormControl('test@email.com', [Validators.required]),
        password: new FormControl('password', [Validators.required]),
      })
    );
    const navArgs = spy.calls.first().args[0];
    expect(navArgs[0]).toBe('/restaurants');
  });

  it('should create account on Submit button click', async () => {
    const spy = routerSpy.navigate as jasmine.Spy;
    await component.authenticate(
      new FormGroup({
        email: new FormControl('test@email.com', [Validators.required]),
        password: new FormControl('password', [Validators.required]),
        role: new FormControl(Role.REGULAR, [Validators.required]),
      })
    );
    const navArgs = spy.calls.first().args[0];
    expect(navArgs[0]).toBe('/restaurants');
  });
});
