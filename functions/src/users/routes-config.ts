import { Application } from 'express';
import { all, create, get, patch, remove } from './controller';
import { isAuthenticated } from '../auth/authenticated';
import { isAuthorized } from '../auth/authorized';

export function usersRoutesConfig(app: Application) {
  // create user
  app.post('/users', create);

  // list all users
  app.get('/users', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }),
    all,
  ]);

  // get :id user
  app.get('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
    get,
  ]);

  // update :id user
  app.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin'], allowSameUser: true }),
    patch,
  ]);

  // delete :id user
  app.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }),
    remove,
  ]);
}
