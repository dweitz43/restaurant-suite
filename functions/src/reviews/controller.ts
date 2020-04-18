import { Request, Response } from 'express';
import { handleError } from '../error';
import * as firebaseHelper from 'firebase-functions-helper';
import { db } from '../index';

export async function create(req: Request, res: Response) {
  try {
    const { reviewUserId, rid, rating, date, comment } = req.body;
    if (!reviewUserId || !rid || (!rating && rating !== 0) || !date) {
      return res.status(400).send({ message: 'Missing fields' });
    }
    const newReview = await firebaseHelper.firestore.createNewDocument(
      db,
      'reviews',
      { uid: reviewUserId, rid, rating, date, comment }
    );
    return res.status(201).send({ id: newReview.id });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function get(req: Request, res: Response) {
  try {
    const { restaurant } = req.query;
    if (!restaurant) {
      return res.status(400).send({ message: 'Missing fields' });
    }
    const queryArray: string[] = ['rid', '==', restaurant];
    const listReviews = await firebaseHelper.firestore.queryData(
      db,
      'reviews',
      [queryArray]
    );
    const reviews =
      listReviews === 'No such document!' ? [] : mapReviews(listReviews);
    return res.status(200).send({ reviews });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function patch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { rating, comment, reply } = req.body;
    if (!id || (!rating && rating !== 0 && !comment && !reply)) {
      return res.status(400).send({ message: 'Missing fields' });
    }
    const updates: any = {};
    if (rating >= 0) {
      updates.rating = rating;
    }
    if (comment || comment === '') {
      updates.comment = comment;
    }
    if (reply || reply === '') {
      updates.reply = reply;
    }
    const review = await firebaseHelper.firestore.updateDocument(
      db,
      'reviews',
      id,
      updates
    );
    return res.status(204).send({ review });
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await firebaseHelper.firestore.deleteDocument(db, 'reviews', id);
    return res.status(204).send({});
  } catch (err) {
    return handleError(res, err);
  }
}

function mapReviews(reviews: {
  [id: string]: {
    uid: string;
    rid: string;
    date: number;
    rating: number;
    comment?: string;
    reply?: string;
  };
}) {
  return Object.keys(reviews).map((id) => {
    return {
      id,
      uid: reviews[id].uid,
      rid: reviews[id].rid,
      date: reviews[id].date,
      rating: reviews[id].rating,
      comment: reviews[id].comment,
      reply: reviews[id].reply,
    };
  });
}
