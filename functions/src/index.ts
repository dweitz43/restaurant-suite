import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { usersRoutesConfig } from './users/routes-config';
import { restaurantsRoutesConfig } from './restaurants/routes-config';
import { reviewsRoutesConfig } from './reviews/routes-config';

const firebaseApp = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://restaurant-suite-dweitz43.firebaseio.com',
});

export const db = admin.firestore(firebaseApp);

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: true }));
usersRoutesConfig(app);
restaurantsRoutesConfig(app);
reviewsRoutesConfig(app);

export const api = functions.https.onRequest(app);
