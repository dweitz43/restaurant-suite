import { NavService } from './nav.service';
import { TestBed } from '@angular/core/testing';

describe('NavService', () => {
  let navService: NavService;

  beforeEach(async () => (navService = TestBed.inject(NavService)));

  it('should set toolbar button text', async () => {
    navService.toolbarButtonText$.subscribe((text) =>
      expect(text).toBe('BUTTON TEXT')
    );
    navService.toolbarButton = 'BUTTON TEXT';
  });

  it('should click toolbar button', async () => {
    navService.toolbarButtonClick$.subscribe((text) =>
      expect(text).toBe('BUTTON TEXT')
    );
    navService.toolbarButton = 'BUTTON TEXT';
    navService.clickToolbarButton();
  });
});
