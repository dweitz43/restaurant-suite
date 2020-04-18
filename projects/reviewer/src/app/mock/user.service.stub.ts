import { Injectable } from '@angular/core';
import { CreateUserRequest, UpdateUserRequest } from '../user/user.service';
import { Observable, of, Subject } from 'rxjs';
import { Role, User } from '../user/user.model';

@Injectable()
export class UserServiceStub {
  refresh$: Observable<void>;
  users$: Observable<User[]> = of([
    {
      uid: 'uid',
      role: Role.ADMIN,
      email: 'test@email.com',
      displayName: 'test user',
    },
  ]);
  private refreshSource: Subject<void> = new Subject<void>();
  constructor() {
    this.refresh$ = this.refreshSource.asObservable();
  }
  create: (user: CreateUserRequest) => Observable<any> = (u) =>
    of({ uid: 'uid' });
  edit: (user: UpdateUserRequest) => Observable<any> = (u) =>
    of({ uid: 'uid' });
  remove: (uid: string) => Observable<any> = (id) => of({});
  getUser: (id: string) => Observable<User> = (uid) =>
    of({
      uid: 'uid',
      role: Role.ADMIN,
      email: 'test@email.com',
      displayName: 'test user',
    });
  refresh: () => void = () => {
    this.refreshSource.next();
  };
}
