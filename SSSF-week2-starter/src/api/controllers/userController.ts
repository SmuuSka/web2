// TODO: create the following functions:
// - userGet - get user by id
// - userListGet - get all users
// - userPost - create new user. Remember to hash password
// - userPutCurrent - update current user
// - userDeleteCurrent - delete current user
// - checkToken - check if current user token is valid: return data from req.user. No need for database query
import {
  addUser,
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
} from '../models/userModel';

import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import {User} from '../../interfaces/User';
import MessageResponse from '../../interfaces/MessageResponse';
import {validationResult} from 'express-validator';
const salt = bcrypt.genSaltSync(12);

const userListGet = async (
  _req: Request,
  res: Response<User[]>,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    console.log('userListGet', users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: string}>,
  res: Response<User>,
  next: NextFunction
) => {
  try {
    const id = Number(req.params.id);
    const user = await getUser(id);
    console.log('userGet', user);
  } catch (error) {
    next(error);
  }
};
const userPost = async (
  req: Request<User>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('user_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    if (!req.body.role) {
      req.body.role = 'user';
    }
    if (req.body.user_name.length < 3) {
      throw new CustomError('Username too short', 400);
    }
    if (req.body.password.length < 5) {
      throw new CustomError('Password too short', 400);
    }
    if (!req.body.email.includes('@')) {
      throw new CustomError('Email not valid', 400);
    }
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, salt);

    const result = await addUser(user);
    console.log('userPost', result);
  } catch (error) {
    next(error);
  }
};

const userPut = async (
  req: Request<{id: User}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('cat_post validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const user = req.body;
    if (user && user.role !== 'admin') {
      throw new CustomError('Admin only', 403);
    }
    const result = await updateUser(user, Number(req.params.id));
    console.log('userPut', result);
  } catch (error) {
    next(error);
  }
};

// TODO: create userPutCurrent function to update current user
// userPutCurrent should use updateUser function from userModel
// userPutCurrent should use validationResult to validate req.body
const userPutCurrent = async (
  req: Request<{}, {}, User>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  const user = req.user;
  if (!user) {
    throw new CustomError('No user', 400);
  }
  try {
    const result = await updateUser(req.body, (req.user as User)._id);
    console.log('userPutCurrent', result);
  } catch (error) {
    next(error);
  }
};

// TODO: create userDelete function for admin to delete user by id
// userDelete should use deleteUser function from userModel
// userDelete should use validationResult to validate req.params.id
// userDelete should use req.user to get role
const userDelete = async (
  req: Request<{id: User}, {}, User>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.params.id);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('userDelete validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const user = req.user as User;
    if (!user || user.role !== 'admin') {
      throw new CustomError('No user nor admin', 400);
    }
    const result = await deleteUser((req.user as User)._id);
    console.log('userDelete', result);
  } catch (error) {
    next(error);
  }
};

const userDeleteCurrent = async (
  req: Request<{id: number}>,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('userDeleteCurrent validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = req.user as User;
    if (!user!._id) {
      throw new CustomError('No user', 400);
    }
    const result = await deleteUser(user!._id);
    console.log('userDeleteCurrent', result);
  } catch (error) {
    next(error);
  }
};

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    next(new CustomError('token not valid', 403));
  } else {
    res.json(req.user);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPut,
  userPutCurrent,
  userDelete,
  userDeleteCurrent,
  checkToken,
};
