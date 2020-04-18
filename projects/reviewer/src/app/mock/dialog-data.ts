import { Role } from '../user/user.model';

export const MOCK_EMPTY_USER_DIALOG_DATA = {};

export const MOCK_USER_DIALOG_DATA = {
  user: {
    uid: 'uid',
    email: 'test@email.com',
    displayName: 'test user',
    role: Role.ADMIN,
  },
  isAdmin: true,
};

export const MOCK_REVIEW_DIALOG_DATA = {
  user: {
    uid: 'uid',
    email: 'test@email.com',
    displayName: 'test user',
    role: Role.REGULAR,
  },
  restaurant: {
    name: 'restaurant',
    ownerId: 'ownerId',
    id: 'rid',
    reviews: [
      {
        id: 'id',
        uid: 'uid',
        rid: 'rid',
        rating: 2,
        date: 0,
        comment: 'comment',
      },
      {
        id: 'id2',
        uid: 'uid2',
        rid: 'rid',
        rating: 5,
        date: 0,
        comment: 'another comment',
      },
      {
        id: 'id3',
        uid: 'uid2',
        rid: 'rid',
        rating: 1,
        date: 0,
        comment: 'another comment',
        reply: 'reply',
      },
      {
        id: 'id4',
        uid: 'uid2',
        rid: 'rid',
        rating: 4,
        date: 0,
        comment: 'another comment',
        reply: 'reply',
      },
      {
        id: 'id5',
        uid: 'uid2',
        rid: 'rid',
        rating: 2,
        date: 0,
        comment: 'another comment',
        reply: 'reply',
      },
    ],
    reviewsAwaitingReply: [
      {
        id: 'id',
        uid: 'uid',
        rid: 'rid',
        rating: 2,
        date: 1586699395397,
        comment: 'comment',
      },
      {
        id: 'id2',
        uid: 'uid2',
        rid: 'rid',
        rating: 5,
        date: 1586699395397,
        comment: 'another comment',
      },
    ],
  },
};

export const MOCK_CREATE_RESTAURANT_DIALOG_DATA = {
  user: {
    uid: 'uid',
    email: 'test@email.com',
    displayName: 'test user',
    role: Role.ADMIN,
  },
};

export const MOCK_RESTAURANT_DIALOG_DATA = {
  user: {
    uid: 'uid',
    email: 'test@email.com',
    displayName: 'test user',
    role: Role.ADMIN,
  },
  restaurant: {
    name: 'restaurant',
    id: 'id',
    ownerId: 'ownerId',
    averageRating: 2,
    reviews: [
      {
        id: 'hid',
        uid: 'uid',
        rid: 'rid',
        rating: 5,
        date: 1586709664200,
        comment: 'new comment',
        reply: 'reply',
      },
      {
        id: 'lid',
        uid: 'uid',
        rid: 'rid',
        rating: 1,
        date: 1586709664224,
        comment: 'new comment',
        reply: 'reply',
      },
      {
        id: 'mid',
        uid: 'uid',
        rid: 'rid',
        rating: 3,
        date: 1586709664500,
        comment: 'new comment',
        reply: 'reply',
      },
    ],
    reviewsAwaitingReply: [
      {
        id: 'id',
        uid: 'uid',
        rid: 'rid',
        rating: 0,
        date: 0,
        comment: 'comment',
      },
    ],
  },
};
