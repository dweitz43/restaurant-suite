import { UserServiceStub } from '../../mock/user.service.stub';
import { UserDialogComponent } from './user-dialog.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileFormModule } from '../../profile-form/profile-form.module';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../user.service';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  MOCK_EMPTY_USER_DIALOG_DATA,
  MOCK_USER_DIALOG_DATA,
} from '../../mock/dialog-data';
import { Role } from '../user.model';
import { MatButtonHarness } from '@angular/material/button/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

describe('UserDialogComponent', () => {
  const userServiceStub = new UserServiceStub();
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;
  let loader: HarnessLoader;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDialogComponent],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        ProfileFormModule,
        MatButtonModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: MOCK_EMPTY_USER_DIALOG_DATA },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dialog = TestBed.inject(MatDialog);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render correct dialog title depending upon variables intialized from dialog data', async () => {
    component.isAdmin = true;
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Add User');
    component.user = {
      uid: 'uid',
      email: 'test@email.com',
      displayName: 'test user',
      role: Role.REGULAR,
    };
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Edit User');
    component.deleting = true;
    component.isAdmin = true;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Delete User');
  });

  it('should render confirmation text in dialog content if deleting User', async () => {
    component.deleting = true;
    component.isAdmin = true;
    component.user = {
      uid: 'uid',
      email: 'test@email.com',
      displayName: 'test user',
      role: Role.REGULAR,
    };
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-content p').textContent
    ).toBe('Are you sure you want to delete test user?');
  });

  it('should create form if Adding User', async () => {
    component.isAdmin = true;
    expect(component.form.controls.email.value).toBe('');
    expect(component.form.controls.password.value).toBe('');
    expect(component.form.controls.role.value).toBe(Role.REGULAR);
    expect(component.form.controls.displayName.value).toBe('');
  });

  it('should render correct footer buttons when deleting User', async () => {
    component.deleting = true;
    component.user = {
      uid: 'uid',
      email: 'test@email.com',
      displayName: 'test user',
      role: Role.REGULAR,
    };
    component.isAdmin = true;
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
    expect(await buttons[0].getText()).toBe('NO');
    expect(await buttons[1].getText()).toBe('YES');
    const deleteButtonElement = await buttons[1].host();
    expect(await deleteButtonElement.hasClass('mat-warn'));
  });

  it('should render correct footer buttons when adding/editing User', async () => {
    const buttons = await loader.getAllHarnesses(MatButtonHarness);
    expect(buttons.length).toBe(2);
    expect(await buttons[0].getText()).toBe('CANCEL');
    expect(await buttons[1].getText()).toBe('SAVE');
    expect(await buttons[1].isDisabled()).toBe(true);
    const saveButtonElement = await buttons[1].host();
    expect(await saveButtonElement.hasClass('mat-primary'));
  });

  it('should create account when Save button clicked in Add User dialog', async () => {
    component.isAdmin = true;
    const form = new FormGroup({
      email: new FormControl('test@email.com', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('password', Validators.required),
      role: new FormControl(Role.REGULAR, Validators.required),
      displayName: new FormControl('test user'),
    });
    userServiceStub.refresh$.subscribe(() => expect().nothing());
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Add User');
    component.save(form);
    fixture.detectChanges();
    expect(dialog.openDialogs.length).toBe(0);
  });
});

describe('UserDialogComponent:Edit', async () => {
  const userServiceStub = new UserServiceStub();
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;
  let loader: HarnessLoader;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDialogComponent],
      imports: [
        NoopAnimationsModule,
        MatDialogModule,
        MatSnackBarModule,
        ProfileFormModule,
        MatButtonModule,
      ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: MAT_DIALOG_DATA, useValue: MOCK_USER_DIALOG_DATA },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    dialog = TestBed.inject(MatDialog);
  });

  it('should fill form from provided User', async () => {
    expect(component.form.controls.email.value).toBe('test@email.com');
    expect(component.form.controls.password.validator).toBeNull();
    expect(component.form.controls.role.value).toBe(Role.ADMIN);
    expect(component.form.controls.displayName.value).toBe('test user');
  });

  it('should edit User when Save button clicked in Edit User dialog', async () => {
    component.isAdmin = true;
    const form = new FormGroup({
      email: new FormControl('test@email.com', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('password', Validators.required),
      role: new FormControl(Role.ADMIN, Validators.required),
      displayName: new FormControl('test user'),
    });
    userServiceStub.refresh$.subscribe(() => expect().nothing());
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Edit User');
    component.save(form);
    fixture.detectChanges();
    expect(dialog.openDialogs.length).toBe(0);
  });

  it('should remove User when Yes button clicked in Delete User dialog', async () => {
    component.isAdmin = true;
    component.deleting = true;
    fixture.detectChanges();
    userServiceStub.refresh$.subscribe(() => expect().nothing());
    expect(
      fixture.nativeElement.querySelector('.mat-dialog-title').textContent
    ).toBe('Delete User');
    component.save();
    fixture.detectChanges();
    expect(dialog.openDialogs.length).toBe(0);
  });
});
