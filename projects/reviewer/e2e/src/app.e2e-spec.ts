import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('Reviewer');
  });

  it('should display authentication component', () => {
    page.navigateTo();
    expect(page.hasUserAuthenticationComponent()).toBe(true);
  });

  it('should fill log in form and submit', () => {
    page.navigateTo();
    page.fillEmailField();
    page.fillPasswordField();
    expect(page.submitButtonEnabled()).toBe(true);
    page.submitForm();
  });

  it('should click on tab to display Create Account form', () => {
    page.navigateTo();
    page.clickCreateAccountTab();
    expect(page.hasRoleControl()).toBe(true);
  });

  it('fill Create Account form and submit', () => {
    page.navigateTo();
    page.clickCreateAccountTab();
    page.fillEmailField();
    page.fillPasswordField();
    expect(page.submitButtonEnabled()).toBe(true);
    page.submitForm();
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});
