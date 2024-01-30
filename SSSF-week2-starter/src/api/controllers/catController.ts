// TODO: create following functions:
// - catGetByUser - get all cats by current user id
// - catGetByBoundingBox - get all cats by bounding box coordinates (getJSON)
// - catPutAdmin - only admin can change cat owner
// - catDeleteAdmin - only admin can delete cat
// - catDelete - only owner can delete cat
// - catPut - only owner can update cat
// - catGet - get cat by id
// - catListGet - get all cats
// - catPost - create new cat

import {Cat, CatOutput} from '../../interfaces/Cat';
import {NextFunction, Request, Response} from 'express';
import {User} from '../../interfaces/User';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';
import CustomError from '../../classes/CustomError';
import {addCat, getCat, deleteCat, getAllCats} from '../models/catModel';
import MessageResponse from '../../interfaces/MessageResponse';
import {getUser} from '../models/userModel';

const catPost = async (
  req: Request<{}, {}, Cat>,
  res: Response<DBMessageResponse>,
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
  const user = res.locals.user as User;
  const cat: Omit<Cat, '_id'> = {
    cat_name: req.body.cat_name,
    weight: req.body.weight,
    filename: req.file?.filename as string,
    birthdate: req.body.birthdate,
    location: res.locals.coords,
    owner: {
      _id: user._id!,
      user_name: user.user_name!,
      email: user.email!,
    },
  };

  try {
    const result = await addCat(cat);
    res.json({
      message: 'Cat added',
      data: {
        _id: result._id,
        cat_name: result.cat_name,
        weight: result.weight,
        filename: result.filename,
        birthdate: result.birthdate,
        location: result.location,
        owner: result.owner,
      },
    });
  } catch (e) {
    next(e);
  }
};

const catGet = async (
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const cat = await getCat(req.params.id);
    const _cat = {
      _id: cat!._id,
      cat_name: cat!,
      weight: cat!.weight,
      filename: cat!.filename,
      birthdate: cat!.birthdate,
      location: cat!.location,
      owner: cat!.owner,
    };
    res.json(_cat);
  } catch (error) {
    next(error);
  }
};

const catListGet = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.param}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }

  try {
    const cats = (await getAllCats()) as Cat[];
    const _cats: Cat[] = cats.map((cat: Cat) => {
      const _cat: CatOutput = {
        _id: cat._id,
        cat_name: cat.cat_name,
        weight: cat.weight,
        filename: cat.filename,
        birthdate: cat.birthdate,
        location: cat.location,
        owner: cat.owner,
      };
      return _cat;
    });
    res.json(_cats);
  } catch (error) {
    next(error);
  }
};

const catGetByUser = async (
  req: Request,
  res: Response,
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
  try {
    const user = res.locals.user as User;
    const cats = (await getAllCats()) as Cat[];
    const _cats: Cat[] = cats.filter((cat: Cat) => {
      return cat.owner._id === user._id;
    });
    res.json(_cats);
  } catch (error) {
    next(error);
  }
};

const catDelete = async (
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
    next(new CustomError(messages, 400));
    return;
  }
  const user = res.locals.user as User;
  const cat = await getCat(req.params.id);
  if (user.role !== 'admin' || cat!.owner._id !== user._id) {
    next(new CustomError('Not authorized', 401));
    return;
  }
  try {
    const result = await deleteCat(req.params.id);
    res.json({
      message: 'Cat deleted',
      data: {
        _id: result!._id,
        cat_name: result!.cat_name,
        weight: result!.weight,
        filename: result!.filename,
        birthdate: result!.birthdate,
        location: result!.location,
        owner: result!.owner,
      },
    });
  } catch (err) {
    next(err);
  }
};

export {catPost, catGet, catDelete, catListGet, catGetByUser};
