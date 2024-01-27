import express from 'express';
import {
  checkToken,
  userDelete,
  userDeleteCurrent,
  userGet,
  userListGet,
  userPost,
  userPut,
  userPutCurrent,
} from '../controllers/userController';
import passport from '../../passport';
import {body, param} from 'express-validator';

const router = express.Router();

// TODO: add validation

router
  .route('/')
  .get(userListGet)
  .post(
    passport.authenticate('jwt', {session: false}),
    body('username').isLength({min: 3}),
    body('email').isEmail(),
    body('password').isLength({min: 3}),
    userPost
  )
  .put(passport.authenticate('jwt', {session: false}), userPutCurrent)
  .delete(passport.authenticate('jwt', {session: false}), userDeleteCurrent);

router.get(
  '/token',
  passport.authenticate('jwt', {session: false}),
  checkToken
);

router
  .route('/:id')
  .get(param('_id').isNumeric, userGet)
  .put(
    passport.authenticate('jwt', {session: false}),
    param('_id').isNumeric(),
    userPut
  )
  .delete(
    passport.authenticate('jwt', {session: false}),
    param('_id').isNumeric(),
    userDelete
  );

export default router;
