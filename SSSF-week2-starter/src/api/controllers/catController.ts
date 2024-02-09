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

import {User, Cat} from '../../types/DBTypes';
import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';
import CustomError from '../../classes/CustomError';
import {catModel} from '../models/catModel';
const catPost = async (
  req: Request<{}, {}, Cat>,
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
  const user = res.locals.user as User;
  const cat: Omit<Cat, '_id'> = {
    cat_name: req.body.cat_name,
    weight: req.body.weight,
    filename: req.file?.filename as string,
    birthdate: req.body.birthdate,
    location: res.locals.coords,
    owner: user,
  };
  try {
    const result = await catModel.create(cat);
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
    const cat = await catModel.findById(req.params.id);
    res.json({
      _id: cat!._id,
      cat_name: cat!.cat_name,
      weight: cat!.weight,
      filename: cat!.filename,
      birthdate: cat!.birthdate,
      location: cat!.location,
      owner: {
        _id: cat!.owner._id,
      },
    });
  } catch (error) {
    next(error);
  }
};

const catListGet = async (
  req: Request,
  res: Response<Cat[]>,
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
    const cats = await catModel.find({});
    const _cats: Cat[] = cats.map((cat: Cat) => {
      return {
        _id: cat._id,
        cat_name: cat.cat_name,
        weight: cat.weight,
        filename: cat.filename,
        birthdate: cat.birthdate,
        location: cat.location,
        owner: {
          _id: cat.owner._id,
        },
      };
    });
    res.json(_cats);
  } catch (e) {
    next(new CustomError('Error', 500));
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
    const cats = await catModel.find({owner: user._id});
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catGetByBoundingBox = async (
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
    const getCoordinate = (coordinateString: string, index: number): number => {
      return parseFloat(coordinateString.split(',')[index]);
    };
    const topRightMax = getCoordinate(req.query.topRight as string, 0);
    const topRightMin = getCoordinate(req.query.topRight as string, 1);
    const bottomLeftMax = getCoordinate(req.query.bottomLeft as string, 0);
    const bottomLeftMin = getCoordinate(req.query.bottomLeft as string, 1);
    const cats = await catModel.find({});
    const _cats: Cat[] = cats.filter((cat: Cat) => {
      const [lat, lon] = cat.location.coordinates;
      return (
        lat <= topRightMax &&
        lat >= topRightMin &&
        lon <= bottomLeftMax &&
        lon >= bottomLeftMin
      );
    });
    res.json(_cats);
  } catch (error) {
    next(error);
  }
};

const catPut = async (
  req: Request<{id: string}, {}, Partial<Cat>>,
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
  const user = res.locals.user as User;
  const cat = await catModel.findById(req.params.id);
  const _cat = {
    _id: cat!._id,
    cat_name: cat!.cat_name,
    weight: cat!.weight,
    filename: cat!.filename,
    birthdate: cat!.birthdate,
    location: cat!.location,
    owner: {
      _id: cat!.owner._id.toString(),
    },
  };
  if (user._id !== _cat.owner._id) {
    next(new CustomError('Not authorized', 401));
    return;
  }
  try {
    const cat: Partial<Cat> = req.body;
    const result = await catModel.findByIdAndUpdate(_cat._id, cat, {
      new: true,
    });
    res.json({
      message: 'Cat updated',
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
  } catch (e) {
    next(e);
  }
};

const catPutAdmin = async (
  req: Request<{id: string}, {}, Partial<Cat>>,
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
  const user = res.locals.user as User;
  if (user.role !== 'admin') {
    next(new CustomError('Not authorized', 401));
    return;
  }
  try {
    const cat: Partial<Cat> = req.body;
    const result = await catModel.findByIdAndUpdate(req.params.id, cat, {
      new: true,
    });
    res.json({
      message: 'Cat updated',
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
  } catch (e) {
    next(e);
  }
};

const catDelete = async (req: Request, res: Response, next: NextFunction) => {
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
  const cat = await catModel.findById(req.params.id);
  const _cat = {
    _id: cat!._id,
    cat_name: cat!.cat_name,
    weight: cat!.weight,
    filename: cat!.filename,
    birthdate: cat!.birthdate,
    location: cat!.location,
    owner: {
      _id: cat!.owner._id.toString(),
    },
  };
  if (user._id !== _cat.owner._id) {
    next(new CustomError('Not authorized', 401));
    return;
  }
  try {
    const result = await catModel.findByIdAndDelete(req.params.id);
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

const catDeleteAdmin = async (
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
  const user = res.locals.user as User;
  if (user.role !== 'admin') {
    next(new CustomError('Not authorized', 401));
    return;
  }
  try {
    const result = await catModel.findByIdAndDelete(req.params.id);
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

export {
  catPost,
  catGet,
  catListGet,
  catGetByUser,
  catGetByBoundingBox,
  catPut,
  catPutAdmin,
  catDelete,
  catDeleteAdmin,
};
