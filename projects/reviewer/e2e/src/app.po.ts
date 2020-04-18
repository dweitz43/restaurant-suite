import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(
      by.css(
        'reviewer-root .sidenav-container .mat-sidenav-content .mat-toolbar span'
      )
    ).getText() as Promise<string>;
  }

  hasUserAuthenticationComponent(): Promise<boolean> {
    return element(
      by.css(
        'reviewer-root .sidenav-container .mat-sidenav-content reviewer-authentication'
      )
    ).isPresent() as Promise<boolean>;
  }

  clickCreateAccountTab(): Promise<void> {
    return element(by.css('.mat-tab-label:nth-child(2)')).click() as Promise<
      void
    >;
  }

  hasRoleControl(): Promise<boolean> {
    return element(by.css('.role-control')).isPresent() as Promise<boolean>;
  }

  fillEmailField(): Promise<void> {
    return element(by.css('input[type=email]')).sendKeys(
      'test@email.com'
    ) as Promise<void>;
  }

  fillPasswordField(): Promise<void> {
    return element(by.css('input[type=password]')).sendKeys(
      'password'
    ) as Promise<void>;
  }

  submitButtonEnabled(): Promise<boolean> {
    return element(by.buttonText('SUBMIT')).isEnabled() as Promise<boolean>;
  }

  submitForm(): Promise<void> {
    return element(by.buttonText('SUBMIT')).click() as Promise<void>;
  }
}
