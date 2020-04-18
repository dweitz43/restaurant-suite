import { SnackService } from './snack.service';
import { TestBed } from '@angular/core/testing';
import {
  MatSnackBar,
  MatSnackBarContainer,
  MatSnackBarModule,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SnackService', () => {
  let snackService: SnackService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatSnackBarModule],
    });
    snackService = TestBed.inject(SnackService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  it('should display snack bar for 3 seconds', async () => {
    snackService.showSnack('snack bar message');
    const snackInstance = snackBar._openedSnackBarRef
      ?.instance as SimpleSnackBar;
    const containerInstance = snackBar._openedSnackBarRef
      ?.containerInstance as MatSnackBarContainer;
    expect(snackInstance.data.message).toBe('snack bar message');
    expect(containerInstance.snackBarConfig.duration).toBe(3000);
  });
});
