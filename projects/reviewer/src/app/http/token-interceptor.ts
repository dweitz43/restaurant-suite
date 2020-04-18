import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AngularFireAuth) {}

  /**
   * add Authorization header including Bearer token to all http requests
   */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth.idToken.pipe(
      take(1),
      switchMap((idToken) => {
        let clone = req.clone();
        if (idToken) {
          clone = clone.clone({
            headers: req.headers.set('Authorization', `Bearer ${idToken}`),
          });
        }
        return next.handle(clone);
      })
    );
  }
}
