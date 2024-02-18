import {Request} from 'express';
import {LoginUser, TokenContent} from '../types/DBTypes';
import {MyContext} from '../types/MyContext';
import fetchData from './fetchData';
import {UserResponse} from '../types/MessageTypes';

export default async (req: Request): Promise<MyContext> => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(' ')[1];
      if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not defined');
      console.log('token from 4-5 server: ', token);
      const user = await fetchData<UserResponse>(
        `${process.env.AUTH_URL}/users/token`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!user) {
        return {};
      }
      // add token to user object, so we can use it in resolvers
      const tokenContent: TokenContent = {
        token: token,
        user: user.user as LoginUser,
      };

      // console.log('user from token', userdata);
      return {userdata: tokenContent};
    } catch (error) {
      return {};
    }
  }
  return {};
};
