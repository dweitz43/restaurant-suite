import { Application } from 'express';
import { all, create, get, patch, remove } from './controller';
import { isAuthenticated } from '../auth/authenticated';
import { isAuthorized } from '../auth/authorized';

export function restaurantsRoutesConfig(app: Application) {
  // create restaurant
  app.post('/restaurants', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'owner'] }),
    create,
  ]);

  // list all restaurants
  app.get('/restaurants', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'owner', 'regular'] }),
    all,
  ]);

  // get :id restaurant
  app.get('/restaurants/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'owner', 'regular'] }),
    get,
  ]);

  // update :id restaurant
  app.patch('/restaurants/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'owner'] }),
    patch,
  ]);

  // delete :id restaurant
  app.delete('/restaurants/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'owner'] }),
    remove,
  ]);
}
