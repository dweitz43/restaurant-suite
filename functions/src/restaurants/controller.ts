import { Request, Response } from 'express';
import { handleError } from '../error';
import * as firebaseHelper from 'firebase-functions-helper';
import { db } from '../index';

export async function create(req: Request, res: Response) {
  try {
    const { name, ownerId } = req.body;
    if (!name || !ownerId) {
      return res.status(400).send({ message: 'Missing fields' });
    }
    const newRestaurant = await firebaseHelper.firestore.createNewDocument(
      db,
      'restaurants',
      { name, ownerId }
    );
    return res.status(201).send({ id: newRestaurant.id });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function all(req: Request, res: Response) {
  try {
    const { uid, role } = res.locals;
    const listRestaurants: any = await firebaseHelper.firestore.backup(
      db,
      'restaurants'
    );
    const restaurants = mapRestaurants(listRestaurants.restaurants, role, uid);
    return res.status(200).send({ restaurants });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function get(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const restaurant = await firebaseHelper.firestore.getDocument(
      db,
      'restaurants',
      id
    );
    return res.status(200).send({ restaurant });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function patch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!id || !name) {
      return res.status(400).send({ message: 'Missing fields' });
    }
    const restaurant = await firebaseHelper.firestore.updateDocument(
      db,
      'restaurants',
      id,
      { name }
    );
    return res.status(204).send({ restaurant });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await firebaseHelper.firestore.deleteDocument(db, 'restaurants', id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}

function mapRestaurants(
  restaurants: {
    [id: string]: { name: string; ownerId: string };
  },
  role: string,
  uid: string
) {
  return Object.keys(restaurants)
    .filter((id) => (role === 'owner' ? restaurants[id].ownerId === uid : true))
    .map((id) => {
      return {
        id,
        ownerId: restaurants[id].ownerId,
        name: restaurants[id].name,
      };
    });
}
