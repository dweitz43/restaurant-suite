import { ProfileFormComponent } from './profile-form.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HarnessLoader, TestKey } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';
import { Role } from '../user/user.model';
import { MatRadioGroupHarness } from '@angular/material/radio/testing';
import { MatInputHarness } from '@angular/material/input/testing';

describe('ProfileFormComponent', () => {
  let component: ProfileFormComponent;
  let fixture: ComponentFixture<ProfileFormComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        ReactiveFormsModule,
        FormsModule,
        MatIconModule,
      ],
      declarations: [ProfileFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render Email and Password form fields by default', async () => {
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formFields.length).toBe(2);
    expect(await formFields[0].getLabel()).toBe('Email Address');
    expect(await formFields[1].getLabel()).toBe('Password');
  });

  it('should add extra controls from Input binding to form model', async () => {
    component.extraControls = [
      {
        name: 'role',
        control: new FormControl(Role.REGULAR, [Validators.required]),
      },
    ];
    component.ngOnInit();
    expect(component.form.controls.role).toBeTruthy();
  });

  it('should render Role radio group with Admin radio button if User isAdmin', async () => {
    component.isAdmin = true;
    component.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      role: new FormControl(Role.REGULAR, Validators.required),
    });
    const roleGroup = await loader.getHarness(MatRadioGroupHarness);
    const buttons = await roleGroup.getRadioButtons();
    expect(await roleGroup.getCheckedValue()).toBe(Role.REGULAR);
    expect(buttons.length).toBe(3);
    expect(await buttons[2].getValue()).toBe(Role.ADMIN);
  });

  it('should render Role radio group without Admin radio button if showRole and select Owner button', async () => {
    component.showRole = true;
    component.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      role: new FormControl(Role.REGULAR, Validators.required),
    });
    const roleGroup = await loader.getHarness(MatRadioGroupHarness);
    const buttons = await roleGroup.getRadioButtons();
    expect(await roleGroup.getCheckedValue()).toBe(Role.REGULAR);
    expect(buttons.length).toBe(2);
    await roleGroup.checkRadioButton({ label: 'Owner' });
    expect(await roleGroup.getCheckedValue()).toBe(Role.OWNER);
  });

  it('should render Display Name form field', async () => {
    component.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      displayName: new FormControl(''),
    });
    const formFields = await loader.getAllHarnesses(MatFormFieldHarness);
    expect(formFields.length).toBe(3);
    expect(await formFields[2].getLabel()).toBe('Display Name');
  });

  it('should emit event if form valid on keyup function call', async () => {
    component.form = new FormGroup({
      email: new FormControl('test@email.com', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('password', Validators.required),
    });
    component.enterKeyup.subscribe(() => expect().nothing());
    component.keyup();
  });

  it('should call keyup function on input element enter keyup event', async () => {
    component.enterKeyup.subscribe(() => expect().nothing());
    const inputs = await loader.getAllHarnesses(MatInputHarness);
    await inputs[0].setValue('test@email.com');
    await inputs[1].setValue('password');
    const element = await inputs[1].host();
    await element.sendKeys(TestKey.ENTER);
  });

  it('should render error if required form field invalid', async () => {
    const formField = await loader.getHarness(MatFormFieldHarness);
    const control = await formField.getControl();
    await control?.focus();
    await control?.blur();
    expect(await formField.hasErrors()).toBe(true);
    expect(await formField.getTextErrors()).toEqual([
      'Email address is required.',
    ]);
  });
});
