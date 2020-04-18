import { UserService } from './user.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../environments/environment';
import { Role, User } from './user.model';

describe('UserService', () => {
  let userService: UserService;
  let httpClientMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    userService = TestBed.inject(UserService);
    httpClientMock = TestBed.inject(HttpTestingController);
  });

  it('should get list of Users and use caching to avoid unnecessary requests', async () => {
    userService.users$.subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users[0].uid).toBe('uid');
      expect(users[0].displayName).toBe('display name');
      expect(users[0].role).toBe(Role.ADMIN);
      expect(users[0].email).toBe('email@email.com');
      userService.users$.subscribe((cached) => expect(cached).toEqual(users));
    });
    const req = httpClientMock.expectOne(`${environment.base}/users`);
    expect(req.request.method).toBe('GET');
    req.flush({
      users: [
        {
          uid: 'uid',
          displayName: 'display name',
          role: 'admin',
          email: 'email@email.com',
        },
      ],
    });
  });

  it('should get user by id and use caching to avoid unnecessary requests', async () => {
    userService.getUser('uid').subscribe((user) => {
      expect(user.uid).toBe('uid');
      expect(user.role).toBe(Role.ADMIN);
      expect(user.email).toBe('email@email.com');
      expect(user.displayName).toBe('display name');
      userService
        .getUser('uid')
        .subscribe((cached) => expect(cached).toEqual(user));
    });
    const req = httpClientMock.expectOne(`${environment.base}/users/uid`);
    expect(req.request.method).toBe('GET');
    req.flush({
      user: {
        uid: 'uid',
        email: 'email@email.com',
        role: 'admin',
        displayName: 'display name',
      },
    });
  });

  it('should create a new user', async () => {
    userService
      .create({ password: 'password', email: 'email@email.com', role: 'admin' })
      .subscribe((success: { uid: string }) => {
        expect(success).toBeTruthy();
        expect(success.uid).toBe('uid');
      });
    const req = httpClientMock.expectOne(`${environment.base}/users`);
    expect(req.request.method).toBe('POST');
    req.flush({ uid: 'uid' });
  });

  it('should edit a user', async () => {
    userService
      .edit({
        uid: 'uid',
        displayName: 'display name',
        role: 'regular',
        email: 'email@email.com',
      })
      .subscribe((updated: User) => {
        expect(updated).toBeTruthy();
        expect(updated.displayName).toBeTruthy('display name');
        expect(updated.uid).toBe('uid');
        expect(updated.role).toBe(Role.REGULAR);
      });
    const req = httpClientMock.expectOne(`${environment.base}/users/uid`);
    expect(req.request.method).toBe('PATCH');
    req.flush({
      uid: 'uid',
      displayName: 'display name',
      role: 'regular',
      email: 'email@email.com',
    });
  });

  it('should delete a user', async () => {
    userService
      .remove('uid')
      .subscribe((success) => expect(success).toBeTruthy());
    const req = httpClientMock.expectOne(`${environment.base}/users/uid`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
