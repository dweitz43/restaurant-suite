import { UserListItemComponent } from './user-list-item.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatListItemHarness } from '@angular/material/list/testing';
import { Role } from '../user.model';
import { MatButtonHarness } from '@angular/material/button/testing';

class UserListItemHarness extends MatListItemHarness {
  static hostSelector = 'mat-list-item';
}

describe('UserListItem', () => {
  let component: UserListItemComponent;
  let fixture: ComponentFixture<UserListItemComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserListItemComponent],
      imports: [
        NoopAnimationsModule,
        MatListModule,
        MatChipsModule,
        MatButtonModule,
        MatIconModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    component.user = {
      uid: 'uid',
      email: 'test@email.com',
      displayName: 'test user',
      role: Role.REGULAR,
    };
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it('should render partially transparent list item if not loaded', async () => {
    const listItem = await loader.getHarness(UserListItemHarness);
    const element = await listItem.host();
    expect(await element.getCssValue('opacity')).toBe('0.5');
  });

  it('should render opaque list item if loaded', async () => {
    component.loaded = true;
    const listItem = await loader.getHarness(UserListItemHarness);
    const element = await listItem.host();
    expect(await element.getCssValue('opacity')).toBe('1');
  });

  it('should render Chip containing User Role info', async () => {
    component.loaded = true;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector(
        'mat-list-item .mat-list-item-content mat-chip-list .mat-chip-list-wrapper mat-chip'
      ).textContent
    ).toBe('REGULAR');
  });

  it('should render lines of text containing User info', async () => {
    component.loaded = true;
    const listItem = await loader.getHarness(UserListItemHarness);
    const lines = await listItem.getLinesText();
    expect(lines.length).toBe(2);
    expect(lines[0]).toBe('test user');
    expect(lines[1]).toBe('test@email.com');
  });

  it('should render raised Edit button for Regular/Owner User in desktop', async () => {
    component.loaded = true;
    let button = await loader.getHarness(MatButtonHarness);
    let element = await button.host();
    expect(await element.hasClass('mat-raised-button')).toBe(true);
    expect(await button.getText()).toBe('EDIT');
    component.user.role = Role.OWNER;
    button = await loader.getHarness(MatButtonHarness);
    element = await button.host();
    expect(await element.hasClass('mat-raised-button')).toBe(true);
    expect(await button.getText()).toBe('EDIT');
  });

  it('should render raised Edit and Delete buttons for Admin User in desktop', async () => {
    component.user.role = Role.ADMIN;
    component.isAdmin = true;
    component.loaded = true;
    const edit = await loader.getHarness(
      MatButtonHarness.with({ text: 'EDIT' })
    );
    const remove = await loader.getHarness(
      MatButtonHarness.with({ text: 'DELETE' })
    );
    const editElement = await edit.host();
    const removeElement = await remove.host();
    expect(await editElement.hasClass('mat-raised-button')).toBe(true);
    expect(await editElement.hasClass('mat-accent')).toBe(true);
    expect(await removeElement.hasClass('mat-raised-button')).toBe(true);
    expect(await removeElement.hasClass('mat-warn')).toBe(true);
  });

  it('should render fab icon Edit button for Regular/Owner User in mobile', async () => {
    component.loaded = true;
    component.isHandset = true;
    let button = await loader.getHarness(MatButtonHarness);
    let element = await button.host();
    expect(await element.hasClass('mat-mini-fab')).toBe(true);
    expect(await button.getText()).toBe('edit');
    component.user.role = Role.OWNER;
    button = await loader.getHarness(MatButtonHarness);
    element = await button.host();
    expect(await element.hasClass('mat-mini-fab')).toBe(true);
    expect(await button.getText()).toBe('edit');
  });

  it('should render fab icon Edit and Delete buttons for Admin User in mobile', async () => {
    component.user.role = Role.ADMIN;
    component.isAdmin = true;
    component.isHandset = true;
    component.loaded = true;
    const edit = await loader.getHarness(
      MatButtonHarness.with({ text: 'edit' })
    );
    const remove = await loader.getHarness(
      MatButtonHarness.with({ text: 'clear' })
    );
    const editElement = await edit.host();
    const removeElement = await remove.host();
    expect(await editElement.hasClass('mat-mini-fab')).toBe(true);
    expect(await editElement.hasClass('mat-accent')).toBe(true);
    expect(await removeElement.hasClass('mat-mini-fab')).toBe(true);
    expect(await removeElement.hasClass('mat-warn')).toBe(true);
  });

  it('should emit button click event with removal flag', async () => {
    component.user.role = Role.ADMIN;
    component.isAdmin = true;
    component.loaded = true;
    component.buttonClick.subscribe((r: boolean) => expect(r).toBe(true));
    const remove = await loader.getHarness(
      MatButtonHarness.with({ text: 'DELETE' })
    );
    await remove.click();
  });

  it('should emit button click event without removal flag for editing User', async () => {
    component.loaded = true;
    component.buttonClick.subscribe((r: boolean) => expect(r).toBe(false));
    const edit = await loader.getHarness(
      MatButtonHarness.with({ text: 'EDIT' })
    );
    await edit.click();
  });
});
