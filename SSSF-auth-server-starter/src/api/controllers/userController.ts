// Description: This file contains the functions for the user routes
// TODO: add function check, to check if the server is alive
// TODO: add function to get all users
// TODO: add function to get a user by id
// TODO: add function to create a user
// TODO: add function to update a user
// TODO: add function to delete a user
// TODO: add function to check if a token is valid
import {Request, Response, NextFunction} from 'express';
import userModel from '../models/userModel';
import {LoginUser, OutputUser, ResponseUser, User, UserInput} from '../../interfaces/User';
import {validationResult} from 'express-validator';
import CustomError from '../../classes/CustomError';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import bcrypt from 'bcryptjs';
import LoginMessageResponse from '../../interfaces/LoginMessageResponse';
const salt = bcrypt.genSaltSync(12);

const check = (req: Request, res: Response) => {
  console.log('Checking server status...)');
  res.json({message: 'Server is alive'});
};

const userListGet = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userModel.find().select('-password -role');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select('-password -role');
    if (!user) {
      next(new CustomError('User not found', 404));
      return;
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const userPost = async (
  req: Request<{}, {}, UserInput>,
  res: Response<DBMessageResponse>,
  next: NextFunction
) => {
  try {
    const user = req.body as UserInput;
    user.password = bcrypt.hashSync(user.password, salt);
    const newUser = await userModel.create(user);
    const response: DBMessageResponse = {
      message: 'User created',
      user: {
        id: newUser._id,
        user_name: newUser.user_name,
        email: newUser.email,
      },
    };
    res.json(response);
  } catch (error) {
    next(new CustomError('User not created', 500));
  }
};

const userPut = async (
  req: Request<{id?: string}, {}, UserInput>,
  res: Response<DBMessageResponse, {userFromToken: LoginUser}>,
  next: NextFunction
) => {
  try {
    const {userFromToken} = res.locals;
    let id: string | undefined = userFromToken._id;
    if (userFromToken.role === 'admin') {
      id = req.params.id;
    }
    const result = await userModel
      .findByIdAndUpdate(id, req.body, {new: true})
      .select('-password -role');
    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: DBMessageResponse = {
      message: 'User updated',
      user: {
        id: result._id,
        user_name: result.user_name,
        email: result.email,
      },
    };
    res.json(response);
  } catch (error) {
    next(new CustomError('User not updated', 500));
  }
};

const userDelete = async (
  req: Request<{id?: string}, {}, UserInput>,
  res: Response<DBMessageResponse, {userFromToken: LoginUser}>,
  next: NextFunction
) => {
  try {
    const {userFromToken} = res.locals;
    let id: string | undefined = userFromToken._id;
    if (req.params.id && userFromToken.role === 'admin') {
      id = req.params.id;
      console.log('admin', id);
    }
    if (userFromToken.role === 'user') {
      id = userFromToken._id;
      console.log('user', id);
    }
    const result = await userModel
      .findByIdAndDelete(id)
      .select('-password -role');
    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: DBMessageResponse = {
      message: 'User deleted',
      user: {
        id: result._id,
        user_name: result.user_name,
        email: result.email,
      },
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const checkToken = async (
  req: Request,
  res: Response<ResponseUser, {userFromToken: LoginUser}>,
  next: NextFunction
) => {
  try {
    const userData = await userModel.findById(res.locals.userFromToken._id).select('-password -role');
    if (!userData) {
      next(new CustomError('User not found', 404));
      return;
    }
    const message: ResponseUser = {
      message: 'Token valid',
      user: userData,
    };
    res.json(message);
  } catch (error) {
    next(new CustomError('Token not valid', 500));
  }
};
export {check, userListGet, userGet, userPost, userPut, userDelete, checkToken};
