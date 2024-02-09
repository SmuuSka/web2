// TODO: create the following functions:
// - userGet - get user by id
// - userListGet - get all users
// - userPost - create new user. Remember to hash password
// - userPutCurrent - update current user
// - userDeleteCurrent - delete current user
// - checkToken - check if current user token is valid: return data from req.user. No need for database query
import {userModel} from '../models/userModel';
import {Request, Response, NextFunction} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
//import {User, UserOutput} from '../../interfaces/User';
import {User, UserOutput} from '../../types/DBTypes';
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
    const errors = validationResult(_req);
    if (!errors.isEmpty()) {
      const messages: string = errors
        .array()
        .map((error) => `${error.msg}: ${error.param}`)
        .join(', ');
      console.log('userListGet validation', messages);
      next(new CustomError(messages, 400));
      return;
    }
    const users = await userModel.find({});
    const _users: User[] = [];
    for (const user of users) {
      const _user = {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
      };
      _users.push(_user as User);
    }
    res.json(_users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: User}>,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req.params.id);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    console.log('userGet validation', messages);
    next(new CustomError(messages, 400));
    return;
  }
  try {
    const user = await userModel.findById(req.params.id);
    const _user = {
      _id: user!._id,
      user_name: user!.user_name,
      email: user!.email,
    };
    res.json(_user);
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
    const user = {
      user_name: req.body.user_name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
    };
    const result = await userModel.create(user);
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

// TODO: create userPutCurrent function to update current user
// userPutCurrent should use updateUser function from userModel
// userPutCurrent should use validationResult to validate req.body
const userPutCurrent = async (
  req: Request<{}, {}, User>,
  res: Response<DBMessageResponse>,
  next: NextFunction
) => {
  const errors = validationResult(res.locals.user._id);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  const user = req.body as User;
  console.log('userPutCurrent', user);
  try {
    const result = await userModel.findByIdAndUpdate(
      res.locals.user._id,
      user,
      {new: true}
    );
    res.json({
      message: 'User updated',
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
    const result = await userModel.findByIdAndDelete(req.params.id);
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
    const result = await userModel.findByIdAndDelete(res.locals.user._id);
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
    const user = res.locals.user as UserOutput;
    const _user = {
      _id: user._id,
      user_name: user.user_name,
      email: user.email,
    };
    res.json(_user);
  } catch (error) {
    next(error);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPutCurrent,
  userDelete,
  userDeleteCurrent,
  checkToken,
};
