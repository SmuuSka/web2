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
import {User, UserTest} from '../../interfaces/User';
import MessageResponse from '../../interfaces/MessageResponse';
import {validationResult} from 'express-validator';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
const salt = bcrypt.genSaltSync(12);

const userListGet = async (
  _req: Request,
  res: Response<User[]>,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    console.log('userListGet', users);
    res.json(users);
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
  req: Request<{}, {}, User>,
  res: Response<DBMessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(req);
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
    const user = req.body as User;
    user.password = bcrypt.hashSync(req.body.password, salt);
    const result = await addUser(user);
    res.status(200).json({
      message: 'User added',
      data: {
        _id: result._id,
        user_name: result.user_name,
        email: result.email,
      },
    });
  } catch (error) {
    res.status(400);
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
    const result = await deleteUser((req.user as User)._id);
    console.log('userDelete', result);
  } catch (error) {
    next(error);
  }
};

const userDeleteCurrent = async (
  req: Request,
  res: Response<DBMessageResponse>,
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
    const result = await deleteUser(res.locals.user._id);
    res.json({
      message: 'User deleted',
      data: {
        _id: result!._id,
        user_name: result!.user_name,
        email: result!.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const checkToken = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('userToken validation', messages);
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const user = req.user;
    if (!user) {
      throw new CustomError('No user', 400);
    }
    return user;
  } catch (error) {
    next(error);
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
