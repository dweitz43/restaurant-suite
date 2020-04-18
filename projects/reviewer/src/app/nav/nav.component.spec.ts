import { LayoutModule } from '@angular/cdk/layout';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NavComponent } from './nav.component';
import { ComponentHarness, HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatNavListItemHarness } from '@angular/material/list/testing';
import { MatSidenavHarness } from '@angular/material/sidenav/testing';
import { AuthenticationModule } from '../authentication/authentication.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { RouterLinkDirectiveStub } from '../mock/router-link-directive-stub';
import { routes } from '../app-routing.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { UserModule } from '../user/user.module';
import { MatButtonHarness } from '@angular/material/button/testing';
import { NavService } from './nav.service';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AuthGuardStub } from '../mock/auth-guard-stub';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

class NavHarness extends ComponentHarness {
  static hostSelector = 'reviewer-nav';

  protected getNavLinks = this.locatorForAll(MatNavListItemHarness);

  async navigate(link: number) {
    const links = await this.getNavLinks();
    await links[link - 1].click();
  }
}

describe('NavComponent', () => {
  const authGuardStub: AuthGuardStub = new AuthGuardStub();
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;
  let loader: HarnessLoader;
  let navService: NavService;
  let router: Router;
  let routerLinks: RouterLinkDirectiveStub[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent, RouterLinkDirectiveStub],
      imports: [
        AuthenticationModule,
        RestaurantModule,
        UserModule,
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        AuthenticationModule,
        RouterTestingModule.withRoutes(routes),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        HttpClientTestingModule,
      ],
      providers: [{ provide: AngularFireAuthGuard, useValue: authGuardStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    navService = TestBed.inject(NavService);
    router = TestBed.inject(Router);
    // find DebugElements with an attached RouterLinkStubDirective
    const linkDes = fixture.debugElement.queryAll(
      By.directive(RouterLinkDirectiveStub)
    );
    // get attached link directive instances
    // using each DebugElement's injector
    routerLinks = linkDes.map((de) => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should compile', async () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Reviewer'`, async () => {
    fixture = TestBed.createComponent(NavComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Reviewer');
  });

  it('should render title', async () => {
    fixture = TestBed.createComponent(NavComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(
      compiled.querySelector(
        '.sidenav-container .mat-sidenav-content .mat-toolbar span'
      ).textContent
    ).toContain('Reviewer');
  });

  it('sidenav should be closed when unauthenticated', async () => {
    component.loggedIn$ = of(false);
    const sidenavContainerLoader = await loader.getChildLoader(
      '.sidenav-container'
    );
    const sidenav = await sidenavContainerLoader.getHarness(MatSidenavHarness);
    expect(await sidenav.isOpen()).toBe(false);
  });

  it('sidenav should be open when authenticated in desktop', async () => {
    component.loggedIn$ = of(true);
    component.isHandset = false;
    const sidenavContainerLoader = await loader.getChildLoader(
      '.sidenav-container'
    );
    const sidenav = await sidenavContainerLoader.getHarness(MatSidenavHarness);
    expect(await sidenav.isOpen()).toBe(true);
  });

  it('sidenav should be closed when authenticated in mobile', async () => {
    component.loggedIn$ = of(true);
    component.isHandset = true;
    const sidenavContainerLoader = await loader.getChildLoader(
      '.sidenav-container'
    );
    const sidenav = await sidenavContainerLoader.getHarness(MatSidenavHarness);
    expect(await sidenav.isOpen()).toBe(false);
  });

  it('sidenav mode should be over in mobile', async () => {
    component.loggedIn$ = of(true);
    component.isHandset = true;
    const sidenavContainerLoader = await loader.getChildLoader(
      '.sidenav-container'
    );
    const sidenav = await sidenavContainerLoader.getHarness(MatSidenavHarness);
    expect(await sidenav.getMode()).toBe('over');
  });

  it('sidenav mode should be side in desktop', async () => {
    component.loggedIn$ = of(true);
    component.isHandset = false;
    const sidenavContainerLoader = await loader.getChildLoader(
      '.sidenav-container'
    );
    const sidenav = await sidenavContainerLoader.getHarness(MatSidenavHarness);
    expect(await sidenav.getMode()).toBe('side');
  });

  it('should display and click toolbar button', async () => {
    component.loggedIn$ = of(true);
    navService.toolbarButton = 'CREATE RESTAURANT';
    const toolbarButton = await loader.getHarness(
      MatButtonHarness.with({ text: 'CREATE RESTAURANT' })
    );
    navService.toolbarButtonClick$.subscribe((text) =>
      expect(text).toBe('CREATE RESTAURANT')
    );
    expect(await toolbarButton.getText()).toBe('CREATE RESTAURANT');
    await toolbarButton.click();
  });

  it('should display menu icon button in mobile and open sidenav on click', async () => {
    component.loggedIn$ = of(true);
    component.isHandset = true;
    const menuIconButton = await loader.getHarness(MatButtonHarness);
    const sidenav = await loader.getHarness(MatSidenavHarness);
    expect(await menuIconButton.getText()).toBe('menu');
    expect(await sidenav.isOpen()).toBe(false);
    await menuIconButton.click();
    expect(await sidenav.isOpen()).toBe(true);
  });

  it('should get nav list links', async () => {
    component.loggedIn$ = of(true);
    component.isHandset = false;
    const allLinks = await loader.getAllHarnesses(MatNavListItemHarness);
    const link1 = await loader.getHarness(
      MatNavListItemHarness.with({ text: 'Restaurants' })
    );
    const link2 = await loader.getHarness(
      MatNavListItemHarness.with({ text: 'User Settings' })
    );
    const link3 = await loader.getHarness(
      MatNavListItemHarness.with({ text: 'Log Out' })
    );
    expect(allLinks.length).toBe(3);
    expect(await link1.getText()).toBe('Restaurants');
    expect(await link2.getText()).toBe('User Settings');
    expect(await link3.getText()).toBe('Log Out');
    expect(routerLinks.length).toBe(2);
    expect(routerLinks[0].linkParams).toBe('/restaurants');
    expect(routerLinks[1].linkParams).toBe('/user');
  });

  it('should close sidenav after navigation on mobile', async () => {
    component.loggedIn$ = of(true);
    component.isHandset = true;
    const sidenavContainerLoader = await loader.getChildLoader(
      '.sidenav-container'
    );
    const menuIconButton = await loader.getHarness(MatButtonHarness);
    const sidenav = await sidenavContainerLoader.getHarness(MatSidenavHarness);
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      NavHarness
    );
    await menuIconButton.click();
    expect(await sidenav.isOpen()).toBe(true);
    await harness.navigate(1);
    expect(await sidenav.isOpen()).toBe(false);
  });

  it('should navigate to restaurants', async () => {
    component.loggedIn$ = of(true);
    component.isHandset = false;
    const restaurantsLink = await loader.getHarness(
      MatNavListItemHarness.with({ text: 'Restaurants' })
    );
    const restaurantsRouterLink = routerLinks[0];
    expect(restaurantsRouterLink.navigatedTo).toBeNull();
    await restaurantsLink.click();
    expect(restaurantsRouterLink.navigatedTo).toBe('/restaurants');
  });

  it('should log out', async () => {
    const harness = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      NavHarness
    );
    component.loggedIn$
      .pipe(take(1))
      .subscribe((loggedIn) => expect(loggedIn).toBe(false));
    await harness.navigate(3);
  });
});
