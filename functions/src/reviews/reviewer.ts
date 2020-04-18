import { Request, Response } from 'express';

export async function isReviewer(req: Request, res: Response, next: Function) {
  const { role, uid } = res.locals;
  const { reviewUserId, ownerId, rating, date, comment, reply } = req.body;
  if (
    role === 'admin' ||
    (role === 'owner' && uid === ownerId && !rating && !date && !comment) ||
    (role === 'regular' &&
      uid === reviewUserId &&
      rating >= 0 &&
      date &&
      !reply)
  ) {
    return next();
  }
  return res.status(403).send();
}
