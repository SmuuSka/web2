// TODO: mongoose schema for cat
import mongoose from 'mongoose';
import {Cat} from '../../interfaces/Cat';

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

export const catModelVariable = mongoose.model<Cat>('Cat', catSchema);
