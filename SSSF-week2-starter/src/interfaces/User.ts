// TODO: user interface
interface User {
  _id: number;
  user_name: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
}

interface UserOutput {
  _id: number;
  user_name: string;
  email: string;
}
interface LoginUser {
  _id: number;
  user_name: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
  iat: number;
  exp: number;
}

export {User, UserOutput, LoginUser};
