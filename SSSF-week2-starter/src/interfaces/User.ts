// TODO: user interface
interface User {
  _id: string;
  user_name: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
}

interface UserOutput {
  _id: string;
  user_name: string;
  email: string;
}
interface LoginUser {
  _id: string;
  user_name: string;
  email: string;
  role: 'admin' | 'user';
  password: string;
  iat: number;
  exp: number;
}
interface UserTest {
  user_name: string;
  email: string;
  password: string;
}

export {User, UserOutput, LoginUser, UserTest};
