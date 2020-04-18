import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthStub {
  idToken: Observable<string | null> = of('token');
  authState: Observable<boolean> = of(false);
  user: Observable<any> = of({ uid: 'uid' });
  signInWithEmailAndPassword: (
    email: string,
    password: string
  ) => Promise<boolean> = (e, p) =>
    new Promise<boolean>((resolve) => resolve(true));
}
