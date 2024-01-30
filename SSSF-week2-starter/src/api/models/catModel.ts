// TODO: mongoose schema for cat
import mongoose from 'mongoose';
import {Cat} from '../../interfaces/Cat';
import mongoConnect from '../../utils/db';

const catSchema = new mongoose.Schema({
  cat_name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 100,
  },
  weight: {
    type: Number,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  birthdate: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  owner: {
    _id: {
      type: String,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
});

catSchema.index({location: '2dsphere'});

const catModelVariable = mongoose.model<Cat>('Cat', catSchema);

const addCat = async (cat: Omit<Cat, '_id'>) => {
  await mongoConnect();
  const newCat = new catModelVariable(
    {
      cat_name: cat.cat_name,
      weight: cat.weight,
      filename: cat.filename,
      birthdate: cat.birthdate,
      location: cat.location,
      owner: cat.owner,
    },
    {versionKey: false}
  );
  await newCat.save().catch((error) => {
    console.log(error);
  });
  return newCat;
};

const getCat = async (id: string) => {
  await mongoConnect();
  const cat = await catModelVariable.findById(id).catch((error) => {
    console.log(error);
  });
  return cat;
};

const getAllCats = async () => {
  await mongoConnect();
  const cats = await catModelVariable.find().catch((error) => {
    console.log(error);
  });
  return cats;
};

const deleteCat = async (id: string) => {
  await mongoConnect();
  const cat = await catModelVariable.findByIdAndDelete(id).catch((error) => {
    console.log(error);
  });
  return cat;
};

export {addCat, getCat, getAllCats, deleteCat};
