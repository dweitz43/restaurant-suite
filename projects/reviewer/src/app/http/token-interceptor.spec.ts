import { RestaurantService } from '../restaurant/restaurant.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './token-interceptor';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AuthStub } from '../mock/auth-stub';

describe('TokenInterceptor', () => {
  const authStub: AuthStub = new AuthStub();
  let restaurantService: RestaurantService;
  let auth: AngularFireAuth;
  let httpClientMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
      ],
      providers: [
        {
          provide: AngularFireAuth,
          useValue: authStub,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });

    restaurantService = TestBed.inject(RestaurantService);
    auth = TestBed.inject(AngularFireAuth);
    httpClientMock = TestBed.inject(HttpTestingController);
  });

  it('should add Authorization header', async () => {
    restaurantService.restaurants$.subscribe((response) =>
      expect(response).toBeTruthy()
    );
    const req = httpClientMock.expectOne(`${environment.base}/restaurants`);
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
  });
});
