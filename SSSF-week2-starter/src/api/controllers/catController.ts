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

import {Cat} from '../../interfaces/Cat';
import {NextFunction, Request, Response} from 'express';
import {User} from '../../interfaces/User';
import DBMessageResponse from '../../interfaces/DBMessageResponse';
import {validationResult} from 'express-validator';
import CustomError from '../../classes/CustomError';
import {addCat} from '../models/catModel';

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
    coords: res.locals.coords,
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
        coords: result.coords,
        owner: result.owner,
      },
    });
  } catch (e) {
    next(e);
  }
};

export {catPost};
