import express, {Request} from 'express';
import {
  catGet,
  catListGet,
  catGetByUser,
  catDelete,
  catDeleteAdmin,
  catPutAdmin,
  catPut,
  catGetByBoundingBox,
  catPost,
} from '../controllers/catController';
import multer, {FileFilterCallback} from 'multer';
import {authenticate, getCoordinates, makeThumbnail} from '../../middlewares';
import {param, body} from 'express-validator';

const fileFilter = (
  request: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.includes('image')) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({dest: './uploads/', fileFilter});
const router = express.Router();

// // TODO: add validation
//
router
  .route('/')
  .get(catListGet)
  .post(
    authenticate,
    upload.single('cat'),
    makeThumbnail,
    getCoordinates,
    body('cat_name').notEmpty().escape(),
    body('birthdate').isDate(),
    body('weight').isNumeric(),
    catPost
  );

router.route('/area').get(catGetByBoundingBox);

router.route('/user').get(authenticate, catGetByUser);

router
  .route('/admin/:id')
  .put(authenticate, catPutAdmin)
  .delete(authenticate, catDeleteAdmin);

router
  .route('/:id')
  .get(param('id'), catGet)
  .put(authenticate, param('id'), catPut)
  .delete(authenticate, param('id'), catDelete);

export default router;
