import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './user.model';

export class CreateUserRequest {
  displayName?: string;
  password?: string;
  email: string;
  role: string;
}
export class UpdateUserRequest extends CreateUserRequest {
  uid: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  refresh$: Observable<void>;
  private refreshSource: Subject<void> = new Subject<void>();
  private baseUrl = `${environment.base}/users`;
  private cache: { [key: string]: User | User[] } = {};

  constructor(private httpClient: HttpClient) {
    this.refresh$ = this.refreshSource.asObservable();
  }

  /**
   * GET api request to list users in system
   */
  get users$(): Observable<User[]> {
    return this.cache.users
      ? of(this.cache.users as User[])
      : this.httpClient.get<{ users: User[] }>(this.baseUrl).pipe(
          map((result) => {
            this.cache.users = result.users;
            return this.cache.users as User[];
          })
        );
  }

  /**
   * GET api request to get data for given User {id}
   */
  getUser(id: string): Observable<User> {
    return this.cache[id]
      ? of(this.cache[id] as User)
      : this.httpClient.get<{ user: User }>(`${this.baseUrl}/${id}`).pipe(
          map((result) => {
            this.cache[id] = result.user;
            return this.cache[id] as User;
          })
        );
  }

  /**
   * POST api request to create new User
   */
  create(user: CreateUserRequest) {
    return this.httpClient.post(this.baseUrl, user);
  }

  /**
   * PATCH api request to edit User
   */
  edit(user: UpdateUserRequest) {
    return this.httpClient.patch(`${this.baseUrl}/${user.uid}`, user);
  }

  /**
   * DELETE api request to remove User
   */
  remove(uid: string) {
    return this.httpClient.delete(`${this.baseUrl}/${uid}`);
  }

  /**
   * clear User data cache and stream refresh event to subscribed components
   */
  refresh() {
    this.cache = {};
    this.refreshSource.next();
  }
}
