import { Application } from 'express';
import { isAuthenticated } from '../auth/authenticated';
import { isAuthorized } from '../auth/authorized';
import { isReviewer } from './reviewer';
import { create, get, patch, remove } from './controller';

export function reviewsRoutesConfig(app: Application) {
  // create review
  app.post('/reviews', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'regular'] }),
    isReviewer,
    create,
  ]);

  // list reviews
  app.get('/reviews', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'owner', 'regular'] }),
    get,
  ]);

  // update :id review
  app.patch('/reviews/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin', 'owner'] }),
    isReviewer,
    patch,
  ]);

  // delete :id review
  app.delete('/reviews/:id', [
    isAuthenticated,
    isAuthorized({ hasRole: ['admin'] }),
    isReviewer,
    remove,
  ]);
}
