// TODO: mongoose schema for user
import mongoConnect from '../../utils/db';
import mongoose from 'mongoose';
import {User} from '../../interfaces/User';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
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
    minlength: 3,
    maxlength: 20,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

const userModelVariable = mongoose.model('User', userSchema);

const addUser = async (user: User) => {
  await mongoConnect();
  const newUser = new userModelVariable(user);
  return newUser.save();
};
const getAllUsers = async () => {
  await mongoConnect();
  return userModelVariable.find({});
};

const getUser = async (id: number) => {
  await mongoConnect();
  return userModelVariable.findById(id);
};

const updateUser = async (data: Partial<User>, id: number) => {
  await mongoConnect();
  return userModelVariable.findByIdAndUpdate(id, data);
};

const deleteUser = async (id: number) => {
  await mongoConnect();
  return userModelVariable.findByIdAndDelete(id);
};

export {
  userModelVariable as default,
  addUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
