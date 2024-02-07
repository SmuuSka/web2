// TODO: mongoose schema for user
import mongoose from 'mongoose';
import {User} from '../../interfaces/User';

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    unique: false,
    minlength: 3,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    unique: false,
    minlength: 5,
    maxlength: 100,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export const userModel = mongoose.model<User>('User', userSchema);
