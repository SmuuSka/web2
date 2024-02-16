//import {GraphQLError} from 'graphql';
import {UserInput} from '../../types/DBTypes';
import {userModel} from '../models/userModel';
import {UserResponse} from '../../types/MessageTypes';
//import fetchData from '../../functions/fetchData';
//import {LoginResponse, UserResponse} from '../../types/MessageTypes';

// TODO: create resolvers based on user.graphql
// note: when updating or deleting a user don't send id to the auth server, it will get it from the token. So token needs to be sent with the request to the auth server
// note2: when updating or deleting a user as admin, you need to send user id (dont delete admin btw) and also check if the user is an admin by checking the role from the user object form context
export default {
  Query: {
    users: async () => {
      return userModel.find({});
    },
    userById: async (args: {id: string}) => {
      return userModel.findById(args.id);
    },
  },
  Mutation: {
    register: async (_parent: undefined, args: {user: UserInput}) => {
      const user: UserInput = {
        user_name: args.user.user_name!,
        email: args.user.email!,
        password: args.user.password!,
      };
      const newUser = userModel.create(user);
      return {user: newUser, message: 'User created'};
    },
  },
};
