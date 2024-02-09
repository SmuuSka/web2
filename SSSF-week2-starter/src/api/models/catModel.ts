// TODO: mongoose schema for cat
import mongoose from 'mongoose';
import {Cat} from '../../types/DBTypes';

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
    type: Date,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const catModel = mongoose.model<Cat>('Cat', catSchema);
